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
    sets: { mdi },
  },

  theme: {
    defaultTheme: 'light',
    themes: {

      light: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface:    '#FFFFFF',
          primary:    '#1976D2',
          secondary:  '#424242',
          error:      '#EF4444',
          info:       '#2196F3',
          success:    '#4CAF50',
          warning:    '#FB8C00',
        },
      },

      masterDark: {
        dark: true,
        colors: {
          background:        '#0f172a',
          surface:           '#1e293b',
          'surface-bright':  '#1e293b',
          'surface-variant': '#334155',
          primary:           '#dc2626',
          secondary:         '#1e3a5f',
          error:             '#dc2626',
          info:              '#3B82F6',
          success:           '#10B981',
          warning:           '#F59E0B',
        },
      },

    },
  },

  defaults: {
    VBtn: {
      style: 'text-transform: none; letter-spacing: 0.3px;',
    },
  },
})
