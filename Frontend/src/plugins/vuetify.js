import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'dark', 
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#3B82F6',      // Azul
          secondary: '#475569',    // Gris azulado
          error: '#EF4444',        // Rojo (tu color principal)
          success: '#10B981',      // Verde
          warning: '#F59E0B',      // Amarillo
          info: '#3B82F6',         // Azul info
          background: '#1E293B',   // Fondo oscuro (como tu app)
          surface: '#334155',      // Cards y superficies
        },
      },
    },
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none;', // Botones sin MAYÚSCULAS automáticas
    },
  },
})