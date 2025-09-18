import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      vessels: 'Vessels',
      crew: 'Crew Management',
      maintenance: 'Maintenance',
      logistics: 'Logistics',
      reports: 'Reports',
      settings: 'Settings',
      users: 'Users',
      
      // Authentication
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      forgotPassword: 'Forgot Password?',
      dontHaveAccount: "Don't have an account? Sign up",
      alreadyHaveAccount: 'Already have an account? Sign in',
      
      // Dashboard
      welcomeBack: 'Welcome back, {{name}}!',
      dashboardSubtitle: "Here's what's happening with your marine operations today.",
      activeVessels: 'Active Vessels',
      crewMembers: 'Crew Members',
      pendingMaintenance: 'Pending Maintenance',
      activeRoutes: 'Active Routes',
      recentActivities: 'Recent Activities',
      quickActions: 'Quick Actions',
      weatherConditions: 'Weather Conditions',
      systemStatus: 'System Status',
      
      // User Management
      userManagement: 'User Management',
      addUser: 'Add User',
      editUser: 'Edit User',
      deleteUser: 'Delete User',
      userDetails: 'User Details',
      role: 'Role',
      status: 'Status',
      createdAt: 'Created At',
      lastLogin: 'Last Login',
      
      // Common
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      
      // Actions
      addNewVessel: 'Add New Vessel',
      manageCrew: 'Manage Crew',
      scheduleMaintenance: 'Schedule Maintenance',
      generateReport: 'Generate Report',
      
      // Status
      online: 'Online',
      offline: 'Offline',
      limited: 'Limited',
      active: 'Active',
      inactive: 'Inactive',
      
      // Weather
      clearSkies: 'Clear Skies',
      wind: 'Wind',
      visibility: 'Visibility',
      waveHeight: 'Wave Height',
      
      // System
      gpsTracking: 'GPS Tracking',
      communication: 'Communication',
      weatherService: 'Weather Service',
      backupSystems: 'Backup Systems'
    }
  },
  es: {
    translation: {
      // Navigation
      dashboard: 'Panel de Control',
      vessels: 'Embarcaciones',
      crew: 'Gestión de Tripulación',
      maintenance: 'Mantenimiento',
      logistics: 'Logística',
      reports: 'Informes',
      settings: 'Configuración',
      users: 'Usuarios',
      
      // Authentication
      signIn: 'Iniciar Sesión',
      signUp: 'Registrarse',
      signOut: 'Cerrar Sesión',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      fullName: 'Nombre Completo',
      forgotPassword: '¿Olvidaste tu contraseña?',
      dontHaveAccount: '¿No tienes cuenta? Regístrate',
      alreadyHaveAccount: '¿Ya tienes cuenta? Inicia sesión',
      
      // Dashboard
      welcomeBack: '¡Bienvenido de vuelta, {{name}}!',
      dashboardSubtitle: 'Esto es lo que está pasando con tus operaciones marinas hoy.',
      activeVessels: 'Embarcaciones Activas',
      crewMembers: 'Miembros de Tripulación',
      pendingMaintenance: 'Mantenimiento Pendiente',
      activeRoutes: 'Rutas Activas',
      recentActivities: 'Actividades Recientes',
      quickActions: 'Acciones Rápidas',
      weatherConditions: 'Condiciones Meteorológicas',
      systemStatus: 'Estado del Sistema',
      
      // User Management
      userManagement: 'Gestión de Usuarios',
      addUser: 'Agregar Usuario',
      editUser: 'Editar Usuario',
      deleteUser: 'Eliminar Usuario',
      userDetails: 'Detalles del Usuario',
      role: 'Rol',
      status: 'Estado',
      createdAt: 'Creado en',
      lastLogin: 'Último Acceso',
      
      // Common
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      add: 'Agregar',
      search: 'Buscar',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      confirm: 'Confirmar',
      
      // Actions
      addNewVessel: 'Agregar Nueva Embarcación',
      manageCrew: 'Gestionar Tripulación',
      scheduleMaintenance: 'Programar Mantenimiento',
      generateReport: 'Generar Informe',
      
      // Status
      online: 'En Línea',
      offline: 'Desconectado',
      limited: 'Limitado',
      active: 'Activo',
      inactive: 'Inactivo',
      
      // Weather
      clearSkies: 'Cielos Despejados',
      wind: 'Viento',
      visibility: 'Visibilidad',
      waveHeight: 'Altura de Olas',
      
      // System
      gpsTracking: 'Rastreo GPS',
      communication: 'Comunicación',
      weatherService: 'Servicio Meteorológico',
      backupSystems: 'Sistemas de Respaldo'
    }
  },
  fr: {
    translation: {
      // Navigation
      dashboard: 'Tableau de Bord',
      vessels: 'Navires',
      crew: 'Gestion d\'Équipage',
      maintenance: 'Maintenance',
      logistics: 'Logistique',
      reports: 'Rapports',
      settings: 'Paramètres',
      users: 'Utilisateurs',
      
      // Authentication
      signIn: 'Se Connecter',
      signUp: 'S\'Inscrire',
      signOut: 'Se Déconnecter',
      email: 'Email',
      password: 'Mot de Passe',
      confirmPassword: 'Confirmer le Mot de Passe',
      fullName: 'Nom Complet',
      forgotPassword: 'Mot de passe oublié?',
      dontHaveAccount: 'Pas de compte? Inscrivez-vous',
      alreadyHaveAccount: 'Déjà un compte? Connectez-vous',
      
      // Dashboard
      welcomeBack: 'Bon retour, {{name}}!',
      dashboardSubtitle: 'Voici ce qui se passe avec vos opérations marines aujourd\'hui.',
      activeVessels: 'Navires Actifs',
      crewMembers: 'Membres d\'Équipage',
      pendingMaintenance: 'Maintenance en Attente',
      activeRoutes: 'Routes Actives',
      recentActivities: 'Activités Récentes',
      quickActions: 'Actions Rapides',
      weatherConditions: 'Conditions Météorologiques',
      systemStatus: 'État du Système',
      
      // User Management
      userManagement: 'Gestion des Utilisateurs',
      addUser: 'Ajouter Utilisateur',
      editUser: 'Modifier Utilisateur',
      deleteUser: 'Supprimer Utilisateur',
      userDetails: 'Détails de l\'Utilisateur',
      role: 'Rôle',
      status: 'Statut',
      createdAt: 'Créé le',
      lastLogin: 'Dernière Connexion',
      
      // Common
      save: 'Sauvegarder',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      add: 'Ajouter',
      search: 'Rechercher',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      confirm: 'Confirmer'
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false // react already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  })

export default i18n
