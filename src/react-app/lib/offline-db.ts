import Dexie, { Table } from 'dexie'

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface CachedData {
  id?: number
  key: string
  data: any
  timestamp: number
  expires_at?: number
}

export interface SyncQueue {
  id?: number
  table: string
  operation: 'create' | 'update' | 'delete'
  data: any
  timestamp: number
  synced: boolean
}

export class OfflineDatabase extends Dexie {
  users!: Table<User>
  cached_data!: Table<CachedData>
  sync_queue!: Table<SyncQueue>

  constructor() {
    super('MarineHubOfflineDB')
    
    this.version(1).stores({
      users: 'id, email, full_name, created_at',
      cached_data: '++id, key, timestamp, expires_at',
      sync_queue: '++id, table, operation, timestamp, synced'
    })
  }

  // Cache management methods
  async setCache(key: string, data: any, ttlMinutes: number = 60) {
    const expires_at = Date.now() + (ttlMinutes * 60 * 1000)
    await this.cached_data.put({
      key,
      data,
      timestamp: Date.now(),
      expires_at
    })
  }

  async getCache(key: string) {
    const cached = await this.cached_data.where('key').equals(key).first()
    if (!cached) return null
    
    // Check if expired
    if (cached.expires_at && cached.expires_at < Date.now()) {
      await this.cached_data.where('key').equals(key).delete()
      return null
    }
    
    return cached.data
  }

  async clearExpiredCache() {
    const now = Date.now()
    await this.cached_data.where('expires_at').below(now).delete()
  }

  // Sync queue methods
  async addToSyncQueue(table: string, operation: 'create' | 'update' | 'delete', data: any) {
    await this.sync_queue.add({
      table,
      operation,
      data,
      timestamp: Date.now(),
      synced: false
    })
  }

  async getPendingSyncItems() {
    return await this.sync_queue.where('synced').equals(0).toArray()
  }

  async markSynced(id: number) {
    await this.sync_queue.update(id, { synced: true })
  }

  async clearSyncedItems() {
    await this.sync_queue.where('synced').equals(1).delete()
  }

  // User management
  async cacheUser(user: User) {
    await this.users.put(user)
  }

  async getCachedUser(id: string) {
    return await this.users.get(id)
  }

  async clearUserCache() {
    await this.users.clear()
  }
}

export const offlineDB = new OfflineDatabase()
