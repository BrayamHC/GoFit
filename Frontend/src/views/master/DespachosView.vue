<template>
    <v-container fluid class="pa-6">
        <!-- Snackbar para notificaciones -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout" location="top">
            {{ snackbar.text }}
        </v-snackbar>

        <!-- Header -->
        <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center mb-6 ga-4">
            <div>
                <h1 class="text-h4 font-weight-bold text-white mb-1">Inventario</h1>
                <p class="text-body-2 text-grey-lighten-1 ma-0">Gestión de inventario del sistema</p>
            </div>
            <v-btn color="red" size="large" prepend-icon="mdi-plus" @click="openCreateDialog">
                Agregar
            </v-btn>
        </div>

        <!-- Filtros -->
        <v-chip-group v-model="selectedFilter" mandatory class="mb-6">
            <v-chip filter variant="outlined" value="todos" color="red">
                Todos
                <v-chip class="ml-2" size="x-small" color="grey-lighten-1">{{ despachosStore.totalDespachos }}</v-chip>
            </v-chip>
            <v-chip filter variant="outlined" value="activos" color="red">
                Activos
                <v-chip class="ml-2" size="x-small" color="green">{{ despachosStore.totalActivos }}</v-chip>
            </v-chip>
            <v-chip filter variant="outlined" value="inactivos" color="red">
                Inactivos
                <v-chip class="ml-2" size="x-small" color="red-lighten-2">{{ despachosStore.totalInactivos }}</v-chip>
            </v-chip>
            <v-chip filter variant="outlined" value="eliminados" color="red">
                Eliminados
                <v-chip class="ml-2" size="x-small" color="orange">{{ despachosStore.totalEliminados }}</v-chip>
            </v-chip>
        </v-chip-group>

        <!-- Loading State -->
        <v-card v-if="despachosStore.loading" class="text-center py-16" elevation="2" rounded="lg">
            <v-progress-circular indeterminate color="red" size="64" class="mb-4"></v-progress-circular>
            <div class="text-h6 text-grey">Cargando despachos...</div>
        </v-card>

        <!-- Error State -->
        <v-card v-else-if="despachosStore.error" class="text-center py-16" elevation="2" rounded="lg">
            <v-icon size="64" color="red" class="mb-4">mdi-alert-circle-outline</v-icon>
            <div class="text-h6 mb-2">Error al cargar despachos</div>
            <div class="text-body-2 text-grey mb-4">{{ despachosStore.error }}</div>
            <v-btn color="red" variant="flat" prepend-icon="mdi-refresh" @click="loadDespachos">
                Reintentar
            </v-btn>
        </v-card>

        <!-- Empty State -->
        <v-card v-else-if="filteredDespachos.length === 0" class="text-center py-16" elevation="2" rounded="lg">
            <v-icon size="64" color="grey" class="mb-4">mdi-office-building-outline</v-icon>
            <div class="text-h6 mb-2">No hay inventario {{ filterText }}</div>
            <div class="text-body-2 text-grey mb-4">
                {{ selectedFilter === 'todos' ? 'Comienza agregando maquinaria' : `No hay inventario ${filterText}`
                }}
            </div>
            <v-btn v-if="selectedFilter === 'todos'" color="red" variant="flat" prepend-icon="mdi-plus"
                @click="openCreateDialog">
                Agregar Producto
            </v-btn>
        </v-card>

        <!-- Grid de Despachos -->
        <v-row v-else>
            <v-col v-for="despacho in filteredDespachos" :key="despacho.despacho_id" cols="12" sm="6" lg="4" xl="3">
                <v-card elevation="2" rounded="lg" class="despacho-card">
                    <!-- Barra superior roja -->
                    <div class="red-bar"></div>

                    <!-- Header -->
                    <v-card-title class="d-flex justify-space-between align-center">
                        <span class="text-h6 text-truncate" :title="despacho.razon_social">
                            {{ despacho.nombre_corto || despacho.razon_social }}
                        </span>
                        <v-chip :color="getStatusColor(despacho.status)" size="small" variant="flat">
                            {{ getStatusLabel(despacho.status) }}
                        </v-chip>
                    </v-card-title>

                    <!-- Body -->
                    <v-card-text>
                        <div class="d-flex align-center ga-2 mb-2">
                            <v-icon color="red" size="small">mdi-domain</v-icon>
                            <span class="text-body-2 text-grey-darken-1 text-truncate" :title="despacho.razon_social">
                                {{ despacho.razon_social }}
                            </span>
                        </div>
                        <div class="d-flex align-center ga-2 mb-2">
                            <v-icon color="red" size="small">mdi-web</v-icon>
                            <span class="text-body-2 text-grey-darken-1 font-mono text-caption">
                                {{ despacho.subdominio }}
                            </span>
                        </div>
                        <div class="d-flex align-center ga-2 mb-2">
                            <v-icon color="red" size="small">mdi-globe-model</v-icon>
                            <span class="text-body-2 text-grey-darken-1">
                                {{ despacho.zona_horaria || 'No especificado' }}
                            </span>
                        </div>
                        <div class="d-flex align-center ga-2">
                            <v-icon color="red" size="small">mdi-account-group</v-icon>
                            <span class="text-body-2 text-grey-darken-1">
                                {{ despacho.total_usuarios || 0 }} usuarios
                            </span>
                        </div>
                    </v-card-text>

                    <!-- Actions -->
                    <v-card-actions class="pa-0">
                        <v-btn block variant="text" color="grey-darken-3" @click="viewDespacho(despacho)">
                            <v-icon start>mdi-eye</v-icon>
                            Ver Detalles
                        </v-btn>
                        <v-divider vertical></v-divider>
                        <v-btn block variant="text" color="blue-darken-4" @click="editDespacho(despacho)">
                            <v-icon start>mdi-pencil</v-icon>
                            Editar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Dialog para ver/editar detalles -->
        <v-dialog v-model="viewDialog" max-width="800" scrollable persistent>
            <v-card v-if="selectedDespacho">
                <!-- Header del Dialog -->
                <v-card-title class="bg-grey-darken-4 text-white d-flex align-center justify-space-between pa-4">
                    <div class="d-flex align-center">
                        <v-icon color="red" class="mr-2">mdi-office-building</v-icon>
                        <span>Detalles del Despacho</span>
                    </div>
                    <v-btn icon @click="closeViewDialog" variant="text" color="white">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-divider class="border-opacity-100" color="red" :thickness="2"></v-divider>

                <!-- Contenido del Dialog -->
                <v-card-text class="pa-6 bg-grey-lighten-4">
                    <v-form ref="editForm">
                        <!-- Información General -->
                        <div class="info-section mb-4">
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <div class="d-flex align-center mb-3">
                                        <v-icon color="red" class="mr-2">mdi-information</v-icon>
                                        <h3 class="text-h6">Información General</h3>
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <div class="d-flex justify-end mb-3">
                                        <v-tooltip text="desactivar" location="bottom">
                                            <template v-slot:activator="{ props }">
                                                <v-icon color="red" v-bind="props" class="cursor-pointer">
                                                    mdi-delete
                                                </v-icon>
                                            </template>
                                        </v-tooltip>
                                    </div>
                                </v-col>
                            </v-row>

                            <v-row dense>
                                <v-col cols="12" sm="6">
                                    <div class="info-item">
                                        <div class="text-caption text-grey-darken-1 mb-1">Razón Social</div>
                                        <div class="text-body-1 font-weight-medium">{{ selectedDespacho.razon_social }}
                                        </div>
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <div v-if="!isEditMode" class="info-item">
                                        <div class="text-caption text-grey-darken-1 mb-1">Nombre Corto</div>
                                        <div class="text-body-1 font-weight-medium">{{ selectedDespacho.nombre_corto ||
                                            'N/A' }}</div>
                                    </div>
                                    <v-text-field v-else v-model="editFormData.nombre_corto" label="Nombre Corto"
                                        variant="outlined" density="compact" :rules="nombreCortoRules"
                                        placeholder="Ej: Novita" hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <div class="info-item">
                                        <div class="text-caption text-grey-darken-1 mb-1">Estado</div>
                                        <v-chip :color="getStatusColor(selectedDespacho.status)" size="small">
                                            {{ getStatusLabel(selectedDespacho.status) }}
                                        </v-chip>
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <div class="info-item">
                                        <div class="text-caption text-grey-darken-1 mb-1">Subdominio</div>
                                        <div class="text-body-1 font-weight-medium">{{ selectedDespacho.subdominio }}
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>

                        <!-- Información de Contacto -->
                        <div class="info-section mb-4">
                            <div class="d-flex align-center mb-3">
                                <v-icon color="red" class="mr-2">mdi-card-account-details</v-icon>
                                <h3 class="text-h6">Información de Contacto</h3>
                            </div>
                            <v-row dense>
                                <v-col cols="12">
                                    <div v-if="!isEditMode" class="info-item">
                                        <div class="text-caption text-grey-darken-1 mb-1">Nombre del Administrador</div>
                                        <div class="text-body-1 font-weight-medium">{{
                                            selectedDespacho.admin_despacho ||
                                            'No especificado' }}</div>
                                    </div>
                                    <v-text-field v-else v-model="editFormData.nombre_completo"
                                        label="Nombre del Administrador" variant="outlined" density="compact"
                                        :rules="nombreCompletoRules" placeholder="Ej: Juan Pérez López"
                                        hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <div v-if="!isEditMode" class="info-item">
                                        <div class="text-caption text-grey-darken-1 mb-1">Teléfono</div>
                                        <div class="text-body-1 font-weight-medium">{{
                                            selectedDespacho.telefono_admin ||
                                            'No especificado' }}</div>
                                    </div>
                                    <v-text-field v-else v-model="editFormData.telefono" label="Teléfono"
                                        variant="outlined" density="compact" :rules="telefonoRules"
                                        placeholder="Ej: 2221234567" hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <div v-if="!isEditMode" class="info-item">
                                        <div class="text-caption text-grey-darken-1 mb-1">Email</div>
                                        <div class="text-body-1 font-weight-medium">{{ selectedDespacho.email_admin ||
                                            'No especificado' }}</div>
                                    </div>
                                    <v-text-field v-else v-model="editFormData.email" label="Email" type="email"
                                        variant="outlined" density="compact" :rules="emailRules"
                                        placeholder="contacto@despacho.com" hide-details="auto" />
                                </v-col>
                            </v-row>
                        </div>

                        <!-- Información Fiscal -->
                        <div class="info-section mb-4">
                            <div class="d-flex align-center mb-3">
                                <v-icon color="red" class="mr-2">mdi-file-document</v-icon>
                                <h3 class="text-h6">Información Fiscal</h3>
                            </div>
                            <v-row dense>
                                <v-col cols="12" sm="6">
                                    <div class="info-item">
                                        <div class="text-caption text-grey-darken-1 mb-1">RFC</div>
                                        <div class="text-body-1 font-weight-medium">{{ selectedDespacho.rfc ||
                                            'No especificado' }}</div>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>

                        <!-- Configuración del Sistema -->
                        <div class="info-section">
                            <div class="d-flex align-center mb-3">
                                <v-icon color="red" class="mr-2">mdi-cog</v-icon>
                                <h3 class="text-h6">Configuración del Sistema</h3>
                            </div>
                            <v-row dense>
                                <v-col cols="12" sm="6">
                                    <div class="info-item">
                                        <div class="text-caption text-grey-darken-1 mb-1">Zona Horaria</div>
                                        <div class="text-body-1 font-weight-medium">{{ selectedDespacho.zona_horaria ||
                                            'No especificado' }}</div>
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <div class="info-item">
                                        <div class="text-caption text-grey-darken-1 mb-1">Plan</div>
                                        <div class="text-body-1 font-weight-medium">{{ selectedDespacho.plan_asociado ||
                                            'No especificado' }}</div>
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <div class="info-item">
                                        <div class="text-caption text-grey-darken-1 mb-1">Fecha de Creación</div>
                                        <div class="text-body-1 font-weight-medium">{{
                                            formatDate(selectedDespacho.fecha_creacion) }}</div>
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <div class="info-item">
                                        <div class="text-caption text-grey-darken-1 mb-1">Total de Usuarios</div>
                                        <div class="text-body-1 font-weight-medium">{{ selectedDespacho.total_usuarios
                                            ||
                                            0
                                        }}</div>
                                    </div>
                                </v-col>
                                <v-col cols="12">
                                    <div v-if="!isEditMode" class="info-item">
                                        <div class="text-caption text-grey-darken-1 mb-1">Notas</div>
                                        <div class="text-body-1 font-weight-medium">{{ selectedDespacho.nota ||
                                            'Sin notas' }}</div>
                                    </div>
                                    <v-textarea v-else v-model="editFormData.nota" label="Notas" variant="outlined"
                                        density="compact" rows="3" placeholder="Notas adicionales sobre el despacho"
                                        counter="500" :rules="notaRules" hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <div class="info-item">
                                        <div class="text-caption text-grey-darken-1 mb-1">Usuario Creación</div>
                                        <div class="text-body-1 font-weight-medium">{{ selectedDespacho.usuario_creacion
                                            ||
                                            'No especificado' }}</div>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>

                        <!-- Alert de error -->
                        <v-alert v-if="editError" type="error" variant="tonal" class="mt-4" closable
                            @click:close="editError = null">
                            {{ editError }}
                        </v-alert>
                    </v-form>
                </v-card-text>

                <v-divider></v-divider>

                <!-- Actions -->
                <v-card-actions class="pa-4 justify-end">
                    <v-btn v-if="!isEditMode" variant="text" @click="closeViewDialog">
                        CERRAR
                    </v-btn>
                    <v-btn v-if="!isEditMode" color="blue-darken-4" variant="flat" @click="enableEditMode">
                        <v-icon start>mdi-pencil</v-icon>
                        EDITAR
                    </v-btn>

                    <v-btn v-if="isEditMode" variant="text" @click="cancelEdit" :disabled="isSaving">
                        CANCELAR
                    </v-btn>
                    <v-btn v-if="isEditMode" color="blue-darken-4" variant="flat" @click="saveDespacho"
                        :loading="isSaving" :disabled="isSaving">
                        <v-icon start>mdi-content-save</v-icon>
                        GUARDAR
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useDespachosStore } from '@/stores/despachosStore'

const router = useRouter()
const despachosStore = useDespachosStore()

// Estado
const selectedFilter = ref('todos')
const viewDialog = ref(false)
const selectedDespacho = ref(null)
const isEditMode = ref(false)
const isSaving = ref(false)
const editError = ref(null)
const editForm = ref(null)

// Datos del formulario de edición (campos que se envían al backend)
const editFormData = reactive({
    despacho_id: null,
    nombre_corto: '',
    nombre_completo: '',  // Se mapea a admin_despacho en BD
    telefono: '',         // Se mapea a telefono_admin en BD
    email: '',            // Se mapea a email_admin en BD
    nota: ''
})

// Snackbar
const snackbar = ref({
    show: false,
    text: '',
    color: 'success',
    timeout: 3000
})

const showSnackbar = (text, color = 'success', timeout = 3000) => {
    snackbar.value = { show: true, text, color, timeout }
}

// ==================== REGLAS DE VALIDACIÓN ====================
const nombreCortoRules = [
    v => !v || v.length <= 50 || 'Máximo 50 caracteres'
]

const nombreCompletoRules = [
    v => !v || v.length <= 100 || 'Máximo 100 caracteres'
]

const telefonoRules = [
    v => !v || v.length <= 20 || 'Máximo 20 caracteres'
]

const emailRules = [
    v => !v || /.+@.+\..+/.test(v) || 'Email debe ser válido'
]

const notaRules = [
    v => !v || v.length <= 500 || 'Máximo 500 caracteres'
]

// Computed
const filteredDespachos = computed(() => {
    switch (selectedFilter.value) {
        case 'activos':
            return despachosStore.despachosActivos
        case 'inactivos':
            return despachosStore.despachosInactivos
        case 'eliminados':
            return despachosStore.despachosEliminados
        case 'todos':
        default:
            return despachosStore.despachos
    }
})

const filterText = computed(() => {
    const texts = {
        'todos': '',
        'activos': 'activos',
        'inactivos': 'inactivos',
        'eliminados': 'eliminados'
    }
    return texts[selectedFilter.value] || ''
})

// Métodos auxiliares
const getStatusColor = (status) => {
    const colors = {
        'activo': 'green',
        'inactivo': 'red',
        'eliminado': 'orange'
    }
    return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
    const labels = {
        'activo': 'ACTIVO',
        'inactivo': 'INACTIVO',
        'eliminado': 'ELIMINADO'
    }
    return labels[status] || status?.toUpperCase() || 'N/A'
}

const formatDate = (date) => {
    if (!date) return 'N/A'
    try {
        return new Date(date).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    } catch {
        return date
    }
}

// Métodos principales
const loadDespachos = async () => {
    await despachosStore.fetchDespachos()
}

const openCreateDialog = () => {
    router.push('crear-despachos')
}

const viewDespacho = (despacho) => {
    selectedDespacho.value = despacho
    loadDespachoData(despacho)
    isEditMode.value = false
    viewDialog.value = true
}

const closeViewDialog = () => {
    viewDialog.value = false
    isEditMode.value = false
    selectedDespacho.value = null
    editError.value = null
    resetEditForm()
}

const editDespacho = (despacho) => {
    selectedDespacho.value = despacho
    loadDespachoData(despacho)
    isEditMode.value = true
    viewDialog.value = true
}

const loadDespachoData = (despacho) => {
    editFormData.despacho_id = despacho.despacho_id
    editFormData.nombre_corto = despacho.nombre_corto || ''
    editFormData.nombre_completo = despacho.admin_despacho || ''
    editFormData.telefono = despacho.telefono_admin || ''
    editFormData.email = despacho.email_admin || ''
    editFormData.nota = despacho.nota || ''
}

const enableEditMode = () => {
    isEditMode.value = true
}

const cancelEdit = () => {
    isEditMode.value = false
    editError.value = null
    if (selectedDespacho.value) {
        loadDespachoData(selectedDespacho.value)
    }
    if (editForm.value) {
        editForm.value.resetValidation()
    }
}

const resetEditForm = () => {
    editFormData.despacho_id = null
    editFormData.nombre_corto = ''
    editFormData.nombre_completo = ''
    editFormData.telefono = ''
    editFormData.email = ''
    editFormData.nota = ''
    if (editForm.value) {
        editForm.value.resetValidation()
    }
}

const saveDespacho = async () => {
    const { valid } = await editForm.value.validate()

    if (!valid) {
        editError.value = 'Por favor, corrige los errores en el formulario'
        return
    }

    isSaving.value = true
    editError.value = null

    try {
        // Comparar valores originales con los editados y solo enviar lo que cambió
        const cambios = {
            despacho_id: editFormData.despacho_id  // Siempre se incluye
        }

        // Solo agregar campos que hayan cambiado
        if (editFormData.nombre_corto !== selectedDespacho.value.nombre_corto) {
            cambios.nombre_corto = editFormData.nombre_corto || null
        }

        if (editFormData.nombre_completo !== selectedDespacho.value.admin_despacho) {
            cambios.nombre_completo = editFormData.nombre_completo || null
        }

        if (editFormData.telefono !== selectedDespacho.value.telefono_admin) {
            cambios.telefono = editFormData.telefono || null
        }

        if (editFormData.email !== selectedDespacho.value.email_admin) {
            cambios.email = editFormData.email || null
        }

        if (editFormData.nota !== selectedDespacho.value.nota) {
            cambios.nota = editFormData.nota || null
        }

        // Verificar si hay cambios (más allá del despacho_id)
        if (Object.keys(cambios).length === 1) {
            showSnackbar(' No hay cambios para guardar', 'warning')
            isSaving.value = false
            return
        }

        console.log('Datos a enviar al backend (solo campos modificados):', cambios)

        const result = await despachosStore.updateDespacho(
            editFormData.despacho_id,
            cambios
        )

        if (result.success) {
            showSnackbar('Despacho actualizado exitosamente', 'success')
            isEditMode.value = false

            Object.keys(cambios).forEach(key => {
                if (key === 'nombre_completo') {
                    selectedDespacho.value.admin_despacho = cambios.nombre_completo
                } else if (key === 'telefono') {
                    selectedDespacho.value.telefono_admin = cambios.telefono
                } else if (key === 'email') {
                    selectedDespacho.value.email_admin = cambios.email
                } else if (key !== 'despacho_id') {
                    selectedDespacho.value[key] = cambios[key]
                }
            })

            // Recargar todos los despachos
            await loadDespachos()
        } else {
            editError.value = result.error || 'Error al actualizar el despacho'
            showSnackbar(editError.value, 'error', 5000)
        }

    } catch (err) {
        editError.value = 'Error inesperado al guardar los cambios'
        showSnackbar(editError.value, 'error', 5000)
    } finally {
        isSaving.value = false
    }
}

onMounted(() => {
    loadDespachos()
})
</script>

<style scoped>
.despacho-card {
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}

.despacho-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.red-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background-color: rgb(220, 38, 38);
}

.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Estilos para las secciones de información */
.info-section {
    background: white;
    border-radius: 8px;
    padding: 16px;
}

.info-item {
    padding: 8px 0;
}

:deep(.v-field--variant-outlined) {
    border-radius: 8px;
}

:deep(.v-field--disabled) {
    opacity: 0.6;
}

:deep(.v-dialog .v-card-title) {
    position: sticky;
    top: 0;
    z-index: 1;
}
</style>