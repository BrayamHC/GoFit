<template>
  <PageContainer>
    <!-- Header -->
    <v-row class="mb-2">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3">
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">
              Suscripciones
              <span class="text-h5 text-medium-emphasis font-weight-regular ml-1">
                ({{ suscripciones.length }})
              </span>
            </h1>
            <p class="text-body-2 text-medium-emphasis">Suscripciones activas y historial</p>
          </div>
          <v-btn
            icon="mdi-refresh"
            variant="tonal"
            rounded="lg"
            :loading="loading"
            @click="cargarSuscripciones"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Filtros y búsqueda -->
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Buscar por cliente o membresía..."
          variant="outlined"
          density="comfortable"
          rounded="lg"
          hide-details
          clearable
          color="red-darken-1"
        />
      </v-col>
      <v-col cols="12" sm="4" md="3">
        <v-select
          v-model="filtroStatus"
          :items="statusOpciones"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          hide-details
          color="red-darken-1"
          prepend-inner-icon="mdi-filter-outline"
        />
      </v-col>
    </v-row>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-16">
      <v-progress-circular indeterminate color="red-darken-1" size="64" class="mb-4" />
      <p class="text-h6 text-medium-emphasis">Cargando suscripciones...</p>
    </div>

    <!-- Empty -->
    <div v-else-if="suscripcionesFiltradas.length === 0" class="text-center py-16">
      <v-icon size="90" color="grey-darken-1" class="mb-4">mdi-card-account-details-outline</v-icon>
      <p class="text-h6 text-medium-emphasis">No hay suscripciones registradas</p>
    </div>

    <!-- Tabla -->
    <v-card v-else rounded="xl" elevation="2">
      <v-table density="comfortable" hover>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Membresía</th>
            <th>Inicio</th>
            <th>Vencimiento</th>
            <th>Días gracia</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in suscripcionesFiltradas" :key="s.suscripcion_id">
            <td>
              <div class="d-flex align-center ga-2 py-2">
                <v-avatar size="34" :color="getAvatarColor(s.cliente_nombre)" class="flex-shrink-0">
                  <span class="text-caption font-weight-bold text-white">
                    {{ getInitials(s.cliente_nombre) }}
                  </span>
                </v-avatar>
                <div>
                  <p class="text-body-2 font-weight-bold mb-0">{{ s.cliente_nombre }}</p>
                  <p class="text-caption text-medium-emphasis mb-0">{{ s.cliente_email || '—' }}</p>
                </div>
              </div>
            </td>
            <td>
              <div>
                <p class="text-body-2 font-weight-medium mb-0">{{ s.membresia_nombre }}</p>
                <p class="text-caption text-medium-emphasis mb-0">
                  ${{ formatPrecio(s.membresia_precio) }} {{ s.membresia_moneda }}
                </p>
              </div>
            </td>
            <td class="text-body-2">{{ formatDate(s.fecha_inicio) }}</td>
            <td>
              <div>
                <p
                  class="text-body-2 mb-0"
                  :class="{ 'text-red-darken-1': esPorVencer(s.fecha_fin) }"
                >
                  {{ formatDate(s.fecha_fin) }}
                </p>
                <p
                  v-if="esPorVencer(s.fecha_fin) && s.status === 'vigente'"
                  class="text-caption text-red-darken-1 mb-0"
                >
                  Vence pronto
                </p>
              </div>
            </td>
            <td class="text-body-2">{{ s.dias_gracia }} días</td>
            <td>
              <v-chip
                :color="getStatusColor(s.status)"
                size="small"
                variant="flat"
                class="text-capitalize font-weight-medium"
              >
                {{ s.status }}
              </v-chip>
            </td>
            <td>
              <v-btn icon="mdi-dots-vertical" variant="text" size="small" density="compact" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
      rounded="lg"
    >
      <div class="d-flex align-center ga-2">
        <v-icon>{{
          snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'
        }}</v-icon>
        {{ snackbar.message }}
      </div>
    </v-snackbar>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import PageContainer from '@/components/pageContainer.vue'
import { useSuscripcionesStore } from '@/stores/suscripcionesStore'

const store = useSuscripcionesStore()

const loading       = ref(false)
const search        = ref('')
const filtroStatus  = ref('todos')
const suscripciones = ref([])

const snackbar = reactive({ show: false, message: '', color: 'success' })

const statusOpciones = [
    { label: 'Todos',       value: 'todos'      },
    { label: 'Vigentes',    value: 'vigente'    },
    { label: 'Vencidas',    value: 'vencida'    },
    { label: 'Suspendidas', value: 'suspendida' },
]

// ── Filtrado ───────────────────────────────────────────────────
const suscripcionesFiltradas = computed(() => {
    let lista = suscripciones.value

    if (filtroStatus.value !== 'todos') {
        lista = lista.filter(s => s.status === filtroStatus.value)
    }

    if (search.value?.trim()) {
        const q = search.value.toLowerCase()
        lista = lista.filter(s =>
            s.cliente_nombre?.toLowerCase().includes(q) ||
            s.membresia_nombre?.toLowerCase().includes(q) ||
            s.cliente_email?.toLowerCase().includes(q)
        )
    }

    return lista
})

// ── Helpers ───────────────────────────────────────────────────
const avatarColors = ['red-darken-2', 'blue-darken-2', 'green-darken-2', 'purple-darken-2', 'teal-darken-2', 'orange-darken-2']

const getAvatarColor = (nombre) => {
    const idx = (nombre?.charCodeAt(0) || 0) % avatarColors.length
    return avatarColors[idx]
}

const getInitials = (nombreCompleto) => {
    const partes = nombreCompleto?.split(' ') || []
    return `${partes[0]?.charAt(0) || ''}${partes[1]?.charAt(0) || ''}`.toUpperCase()
}

const formatDate = (date) => {
    if (!date) return '—'
    try {
        return new Date(date).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch { return date }
}

const formatPrecio = (precio) => parseFloat(precio ?? 0).toFixed(2)

const esPorVencer = (fechaFin) => {
    if (!fechaFin) return false
    const hoy   = new Date()
    const fin   = new Date(fechaFin)
    const diff  = (fin - hoy) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 7
}

const getStatusColor = (status) => {
    const map = {
        vigente:    'green',
        vencida:    'red',
        suspendida: 'orange',
        eliminada:  'grey',
    }
    return map[status] || 'grey'
}

// ── Data ──────────────────────────────────────────────────────
const cargarSuscripciones = async () => {
    loading.value = true
    try {
        const result = await store.getSuscripciones()
        if (result.success) {
            suscripciones.value = result.data || []
        } else {
            snackbar.message = result.error || 'Error al cargar suscripciones'
            snackbar.color   = 'error'
            snackbar.show    = true
        }
    } catch {
        snackbar.message = 'Error inesperado'
        snackbar.color   = 'error'
        snackbar.show    = true
    } finally {
        loading.value = false
    }
}

onMounted(cargarSuscripciones)
</script>
