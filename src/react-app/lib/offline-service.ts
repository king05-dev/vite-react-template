import { supabase } from './supabase'
import { offlineDB } from './offline-db'

export interface SyncOperation {
  id?: number
  table: string
  operation: 'create' | 'update' | 'delete'
  data: any
  timestamp: number
  synced: boolean
  retryCount?: number
}

export class OfflineService {
  private isOnline: boolean = navigator.onLine
  private syncInProgress: boolean = false
  private maxRetries: number = 3

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this))
    window.addEventListener('offline', this.handleOffline.bind(this))
  }

  private handleOnline() {
    this.isOnline = true
    console.log('🌐 Connection restored - starting sync...')
    this.syncPendingOperations()
  }

  private handleOffline() {
    this.isOnline = false
    console.log('📱 Offline mode activated')
  }

  // Generic CRUD operations with offline support
  async create<T>(table: string, data: T): Promise<T> {
    if (this.isOnline) {
      try {
        const { data: result, error } = await supabase
          .from(table)
          .insert(data)
          .select()
          .single()

        if (error) throw error

        // Cache the result
        await this.cacheData(table, result.id, result)
        return result
      } catch (error) {
        console.warn(`Failed to create ${table} online, queuing for sync:`, error)
        return this.createOffline(table, data)
      }
    } else {
      return this.createOffline(table, data)
    }
  }

  async read<T>(table: string, id?: string): Promise<T | T[]> {
    if (this.isOnline) {
      try {
        let query = supabase.from(table).select('*')
        
        if (id) {
          const { data, error } = await query.eq('id', id).single()
          if (error) throw error
          return data
        }

        const { data, error } = await query

        if (error) throw error

        // Cache the results
        if (Array.isArray(data)) {
          for (const item of data) {
            await this.cacheData(table, (item as any).id, item)
          }
        } else if (data) {
          await this.cacheData(table, (data as any).id, data)
        }

        return data
      } catch (error) {
        console.warn(`Failed to read ${table} online, using cache:`, error)
        return this.readOffline(table, id)
      }
    } else {
      return this.readOffline(table, id)
    }
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    if (this.isOnline) {
      try {
        const { data: result, error } = await supabase
          .from(table)
          .update(data)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        // Update cache
        await this.cacheData(table, id, result)
        return result
      } catch (error) {
        console.warn(`Failed to update ${table} online, queuing for sync:`, error)
        return this.updateOffline(table, id, data)
      }
    } else {
      return this.updateOffline(table, id, data)
    }
  }

  async delete(table: string, id: string): Promise<void> {
    if (this.isOnline) {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('id', id)

        if (error) throw error

        // Remove from cache
        await this.removeCachedData(table, id)
      } catch (error) {
        console.warn(`Failed to delete ${table} online, queuing for sync:`, error)
        await this.deleteOffline(table, id)
      }
    } else {
      await this.deleteOffline(table, id)
    }
  }

  // Offline operations
  private async createOffline<T>(table: string, data: T): Promise<T> {
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const dataWithId = { ...data, id: tempId, _isTemp: true }

    // Cache locally
    await this.cacheData(table, tempId, dataWithId)

    // Queue for sync
    await offlineDB.addToSyncQueue(table, 'create', dataWithId)

    return dataWithId
  }

  private async readOffline<T>(table: string, id?: string): Promise<T | T[]> {
    if (id) {
      const cached = await offlineDB.getCache(`${table}_${id}`)
      return cached || null
    } else {
      // Get all cached items for this table
      const allCached = await offlineDB.cached_data
        .where('key')
        .startsWith(`${table}_`)
        .toArray()
      
      return allCached.map(item => item.data)
    }
  }

  private async updateOffline<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    // Get current cached data
    const current = await offlineDB.getCache(`${table}_${id}`)
    const updated = { ...current, ...data, updated_at: new Date().toISOString() }

    // Update cache
    await this.cacheData(table, id, updated)

    // Queue for sync
    await offlineDB.addToSyncQueue(table, 'update', { id, ...data })

    return updated
  }

  private async deleteOffline(table: string, id: string): Promise<void> {
    // Remove from cache
    await this.removeCachedData(table, id)

    // Queue for sync
    await offlineDB.addToSyncQueue(table, 'delete', { id })
  }

  // Cache management
  private async cacheData(table: string, id: string, data: any): Promise<void> {
    const key = `${table}_${id}`
    await offlineDB.setCache(key, data, 60) // Cache for 60 minutes
  }

  private async removeCachedData(table: string, id: string): Promise<void> {
    const key = `${table}_${id}`
    await offlineDB.cached_data.where('key').equals(key).delete()
  }

  // Sync operations
  async syncPendingOperations(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) return

    this.syncInProgress = true
    console.log('🔄 Starting sync of pending operations...')

    try {
      const pendingOps = await offlineDB.getPendingSyncItems()
      console.log(`Found ${pendingOps.length} pending operations`)

      for (const op of pendingOps) {
        try {
          await this.syncOperation(op)
          await offlineDB.markSynced(op.id!)
          console.log(`✅ Synced ${op.operation} on ${op.table}`)
        } catch (error) {
          console.error(`❌ Failed to sync ${op.operation} on ${op.table}:`, error)
          
          // Increment retry count
          const retryCount = ((op as any).retryCount || 0) + 1
          if (retryCount >= this.maxRetries) {
            console.error(`Max retries reached for operation ${op.id}, marking as failed`)
            await offlineDB.markSynced(op.id!) // Remove from queue
          } else {
            await offlineDB.sync_queue.update(op.id!, { retryCount })
          }
        }
      }

      // Clean up synced items
      await offlineDB.clearSyncedItems()
      console.log('🧹 Cleaned up synced operations')

    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      this.syncInProgress = false
    }
  }

  private async syncOperation(op: SyncOperation): Promise<void> {
    const { table, operation, data } = op

    switch (operation) {
      case 'create':
        const { _isTemp, ...createData } = data
        const { data: created, error: createError } = await supabase
          .from(table)
          .insert(createData)
          .select()
          .single()

        if (createError) throw createError

        // Update cache with real ID
        if (_isTemp) {
          await this.removeCachedData(table, data.id)
          await this.cacheData(table, created.id, created)
        }
        break

      case 'update':
        const { id: updateId, ...updateData } = data
        const { error: updateError } = await supabase
          .from(table)
          .update(updateData)
          .eq('id', updateId)

        if (updateError) throw updateError
        break

      case 'delete':
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('id', data.id)

        if (deleteError) throw deleteError
        break
    }
  }

  // Utility methods
  getConnectionStatus(): boolean {
    return this.isOnline
  }

  async getPendingOperationsCount(): Promise<number> {
    const pending = await offlineDB.getPendingSyncItems()
    return pending.length
  }

  async clearAllCache(): Promise<void> {
    await offlineDB.cached_data.clear()
    await offlineDB.sync_queue.clear()
  }
}

export const offlineService = new OfflineService()
