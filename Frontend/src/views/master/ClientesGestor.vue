<template>
  <page-container>
    <!-- Header -->
    <v-row class="mb-2">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3">
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">
              Clientes
              <span class="text-h5 text-medium-emphasis font-weight-regular ml-1">
                ({{ clientes.length }})
              </span>
            </h1>
            <p class="text-body-2 text-medium-emphasis">Gestión de clientes del gimnasio</p>
          </div>
          <v-btn
            color="red-darken-1"
            size="large"
            prepend-icon="mdi-account-plus"
            rounded="lg"
            elevation="2"
            @click="openCreateDialog"
          >
            Nuevo cliente
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Barra de búsqueda y filtros -->
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Buscar cliente..."
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
      <v-spacer />
      <v-col cols="auto">
        <v-btn
          icon="mdi-refresh"
          variant="tonal"
          rounded="lg"
          :loading="loadingClientes"
          @click="cargarClientes"
        />
      </v-col>
    </v-row>

    <!-- Estado: cargando -->
    <div v-if="loadingClientes" class="text-center py-16">
      <v-progress-circular indeterminate color="red-darken-1" size="64" class="mb-4" />
      <p class="text-h6 text-medium-emphasis">Cargando clientes...</p>
    </div>

    <!-- Estado: sin clientes -->
    <div v-else-if="clientesFiltrados.length === 0" class="text-center py-16">
      <v-icon size="90" color="grey-darken-1" class="mb-4">mdi-account-group-outline</v-icon>
      <p class="text-h6 text-medium-emphasis">No hay clientes registrados</p>
      <p class="text-body-2 text-medium-emphasis">
        Crea tu primer cliente usando el botón de arriba
      </p>
    </div>

    <!-- Grid de Cards -->
    <v-row v-else>
      <v-col
        v-for="cliente in clientesFiltrados"
        :key="cliente.cliente_id"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
      >
        <v-card class="cliente-card" rounded="xl" elevation="3">
          <!-- Barra roja superior -->
          <div class="red-bar" />

          <!-- Avatar + nombre + status -->
          <div class="d-flex flex-column align-center pt-6 pb-3 px-4">
            <v-avatar size="72" :color="getAvatarColor(cliente.nombre)" class="mb-3 avatar-shadow">
              <span class="text-h5 font-weight-bold text-white">
                {{ getInitials(cliente.nombre, cliente.apellido) }}
              </span>
            </v-avatar>

            <p class="text-h6 font-weight-bold text-center mb-1">
              {{ cliente.nombre }} {{ cliente.apellido }}
            </p>

            <v-chip
              :color="cliente.status === 'activo' ? 'green' : 'grey'"
              size="small"
              variant="flat"
              class="text-capitalize"
            >
              {{ cliente.status }}
            </v-chip>
          </div>

          <v-divider class="mx-4" />

          <!-- Detalle del cliente -->
          <v-card-text class="pt-3">
            <div class="info-row">
              <v-icon size="16" color="red-darken-1">mdi-email-outline</v-icon>
              <span class="text-body-2 text-truncate" :title="cliente.email">
                {{ cliente.email || '—' }}
              </span>
            </div>
            <div class="info-row">
              <v-icon size="16" color="red-darken-1">mdi-phone-outline</v-icon>
              <span class="text-body-2">{{ cliente.telefono || '—' }}</span>
            </div>
            <div class="info-row">
              <v-icon size="16" color="red-darken-1">mdi-cake-variant-outline</v-icon>
              <span class="text-body-2">{{ formatDate(cliente.fecha_nacimiento) }}</span>
            </div>
            <div class="info-row">
              <v-icon size="16" color="red-darken-1">mdi-calendar-outline</v-icon>
              <span class="text-body-2">Alta: {{ formatDate(cliente.fecha_creacion) }}</span>
            </div>
          </v-card-text>

          <!-- Acciones -->
          <v-card-actions class="px-4 pb-4">
            <v-btn
              variant="tonal"
              color="red-darken-1"
              size="small"
              rounded="lg"
              prepend-icon="mdi-eye-outline"
              block
            >
              Ver detalle
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- ===== DIALOG CREAR CLIENTE ===== -->
    <v-dialog v-model="createDialog" max-width="580px" persistent>
      <v-card rounded="xl" elevation="10" class="overflow-hidden">
        <!-- Header decorativo con gradiente -->
        <div class="dialog-header">
          <div class="dialog-header-bg" />
          <div class="d-flex align-center justify-space-between pa-6 position-relative">
            <div class="d-flex align-center ga-3">
              <v-avatar color="white" size="48">
                <v-icon color="red-darken-1" size="28">mdi-account-plus</v-icon>
              </v-avatar>
              <div>
                <p class="text-h6 font-weight-bold text-white mb-0">Nuevo Cliente</p>
                <p class="text-caption text-white" style="opacity: 0.75">
                  Completa los datos del cliente
                </p>
              </div>
            </div>
            <v-btn icon="mdi-close" variant="text" color="white" @click="closeDialog" />
          </div>
        </div>

        <!-- Formulario -->
        <v-card-text class="pa-6">
          <v-form ref="clienteForm" @submit.prevent="crearCliente">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.nombre"
                  label="Nombre *"
                  prepend-inner-icon="mdi-account-outline"
                  variant="outlined"
                  rounded="lg"
                  color="red-darken-1"
                  :rules="requerido('Nombre')"
                  :disabled="loading"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.apellido"
                  label="Apellido *"
                  prepend-inner-icon="mdi-account-outline"
                  variant="outlined"
                  rounded="lg"
                  color="red-darken-1"
                  :rules="requerido('Apellido')"
                  :disabled="loading"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.email"
                  label="Correo electrónico"
                  type="email"
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
                  rounded="lg"
                  color="red-darken-1"
                  :rules="emailRules"
                  :disabled="loading"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.telefono"
                  label="Teléfono"
                  prepend-inner-icon="mdi-phone-outline"
                  variant="outlined"
                  rounded="lg"
                  color="red-darken-1"
                  :disabled="loading"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.fecha_nacimiento"
                  label="Fecha de nacimiento"
                  type="date"
                  prepend-inner-icon="mdi-cake-variant-outline"
                  variant="outlined"
                  rounded="lg"
                  color="red-darken-1"
                  :disabled="loading"
                />
              </v-col>
            </v-row>

            <v-alert
              v-if="errorMsg"
              type="error"
              variant="tonal"
              rounded="lg"
              class="mt-2"
              closable
              @click:close="errorMsg = null"
            >
              {{ errorMsg }}
            </v-alert>
          </v-form>
        </v-card-text>

        <v-divider />

        <!-- Acciones -->
        <v-card-actions class="pa-5">
          <v-spacer />
          <v-btn variant="text" color="grey" size="large" :disabled="loading" @click="closeDialog">
            Cancelar
          </v-btn>
          <v-btn
            color="red-darken-1"
            size="large"
            rounded="lg"
            :loading="loading"
            prepend-icon="mdi-check"
            @click="crearCliente"
          >
            Crear cliente
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  </page-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useClientesStore } from '@/stores/clientesStore'
import PageContainer from '@/components/pageContainer.vue'

const clientesStore = useClientesStore()

const clienteForm = ref(null)
const createDialog = ref(false)
const loading = ref(false)
const loadingClientes = ref(false)
const errorMsg = ref(null)
const search = ref('')
const filtroStatus = ref('todos')

const clientes = ref([])

const statusOpciones = [
  { label: 'Todos', value: 'todos' },
  { label: 'Activos', value: 'activo' },
  { label: 'Inactivos', value: 'inactivo' },
]

const formData = reactive({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  fecha_nacimiento: '',
})

const snackbar = reactive({ show: false, message: '', color: 'success' })

// ── Filtrado reactivo ──────────────────────────────────────────
const clientesFiltrados = computed(() => {
  let lista = clientes.value

  if (filtroStatus.value !== 'todos') {
    lista = lista.filter((c) => c.status === filtroStatus.value)
  }

  if (search.value?.trim()) {
    const q = search.value.toLowerCase()
    lista = lista.filter(
      (c) =>
        `${c.nombre} ${c.apellido}`.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.telefono?.includes(q),
    )
  }

  return lista
})

// ── Validaciones ───────────────────────────────────────────────
const requerido = (campo) => [
  (v) => !!v?.trim() || `${campo} es requerido`,
  (v) => (v && v.length >= 2) || `${campo} debe tener al menos 2 caracteres`,
]

const emailRules = [(v) => !v || /.+@.+\..+/.test(v) || 'Correo electrónico inválido']

// ── Helpers visuales ──────────────────────────────────────────
const avatarColors = [
  'red-darken-2',
  'blue-darken-2',
  'green-darken-2',
  'purple-darken-2',
  'teal-darken-2',
  'orange-darken-2',
]

const getAvatarColor = (nombre) => {
  const idx = (nombre?.charCodeAt(0) || 0) % avatarColors.length
  return avatarColors[idx]
}

const getInitials = (nombre, apellido) => {
  return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase()
}

const formatDate = (date) => {
  if (!date) return '—'
  try {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return date
  }
}

// ── CRUD ──────────────────────────────────────────────────────
const cargarClientes = async () => {
  loadingClientes.value = true
  try {
    const result = await clientesStore.getClientes()
    if (result.success) {
      clientes.value = result.data || []
    } else {
      showSnackbar(result.error || 'Error al cargar clientes', 'error')
    }
  } catch {
    showSnackbar('Error al cargar clientes', 'error')
  } finally {
    loadingClientes.value = false
  }
}

const openCreateDialog = () => {
  resetForm()
  createDialog.value = true
}

const closeDialog = () => {
  createDialog.value = false
  resetForm()
}

const resetForm = () => {
  Object.assign(formData, {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
  })
  errorMsg.value = null
  clienteForm.value?.resetValidation()
}

const crearCliente = async () => {
  const { valid } = await clienteForm.value.validate()
  if (!valid) return

  loading.value = true
  errorMsg.value = null

  try {
    const payload = { ...formData }
    if (!payload.email) delete payload.email
    if (!payload.telefono) delete payload.telefono
    if (!payload.fecha_nacimiento) delete payload.fecha_nacimiento

    const result = await clientesStore.crearCliente(payload)

    if (result.success) {
      showSnackbar('¡Cliente creado exitosamente!', 'success')
      closeDialog()
      await cargarClientes()
    } else {
      errorMsg.value = result.error || 'Error al crear el cliente'
    }
  } catch {
    errorMsg.value = 'Error inesperado. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

const showSnackbar = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

onMounted(cargarClientes)
</script>
