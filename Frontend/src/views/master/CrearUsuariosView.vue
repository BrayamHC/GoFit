<!-- Vista actualizada con cards estilizadas para usuarios -->
<template>
    <v-container fluid class="pa-6">
        <!-- Header -->
        <v-row class="mb-4">
            <v-col cols="12">
                <div class="d-flex align-center justify-space-between">
                    <div>
                        <h1 class="text-h4 font-weight-bold mb-2">Usuarios</h1>
                        <p class="text-body-1 text-medium-emphasis">
                            Gestión de usuarios del sistema
                        </p>
                    </div>
                    <v-btn color="grey-lighten-2" size="large" prepend-icon="mdi-account-plus"
                        @click="openCreateDialog">
                        Nuevo Usuario
                    </v-btn>
                </div>
            </v-col>
        </v-row>

        <!-- Tabla de usuarios  -->
        <v-row>
            <v-col cols="12">
                <v-card color="transparent" elevation="0">
                    <v-card-text v-if="loadingUsuarios" class="text-center py-12">
                        <v-progress-circular indeterminate color="primary" size="64" class="mb-4" />
                        <p class="text-h6 text-medium-emphasis">
                            Cargando usuarios...
                        </p>
                    </v-card-text>

                    <v-card-text v-else-if="usuarios.length === 0" class="text-center py-12">
                        <v-icon size="80" color="grey-lighten-1" class="mb-4">
                            mdi-account-group
                        </v-icon>
                        <p class="text-h6 text-medium-emphasis">
                            No hay usuarios registrados
                        </p>
                        <p class="text-body-2 text-medium-emphasis">
                            Crea tu primer usuario usando el botón de arriba
                        </p>
                    </v-card-text>

                    <div v-else>
                        <!-- Header con contador y botón de refresh -->
                        <v-card-title class="d-flex align-center justify-space-between mb-2">
                            <span>Usuarios Registrados ({{ usuarios.length }})</span>
                            <v-btn icon="mdi-refresh" variant="text" @click="cargarUsuarios"
                                :loading="loadingUsuarios" />
                        </v-card-title>

                        <!-- Grid de Usuarios -->
                        <v-card-text>
                            <v-row>
                                <v-col v-for="usuario in usuarios" :key="usuario.usuario_id" cols="12" sm="6" lg="4"
                                    xl="3">
                                    <v-card elevation="2" rounded="lg" class="usuario-card">
                                        <!-- Barra superior naranja -->
                                        <div class="orange-bar"></div>

                                        <!-- Header -->
                                        <v-card-title class="d-flex justify-space-between align-center">
                                            <span class="text-h6 text-truncate" :title="usuario.nombre">
                                                {{ usuario.nombre }}
                                            </span>
                                            <!-- <v-chip :color="getRolColor(usuario.rol)" size="small" variant="flat">
                                                {{ getRolLabel(usuario.rol) }}
                                            </v-chip> -->
                                            <v-switch v-model="EstadoUsuarios"></v-switch>
                                        </v-card-title>

                                        <!-- Body -->
                                        <v-card-text>
                                            <div class="d-flex align-center ga-2 mb-2">
                                                <v-icon color="deep-orange-darken-3" size="small">mdi-email</v-icon>
                                                <span class="text-body-2 text-grey-darken-1 text-truncate"
                                                    :title="usuario.email">
                                                    {{ usuario.email }}
                                                </span>
                                            </div>
                                            <!-- <div class="d-flex align-center ga-2 mb-2">
                                                <v-icon color="deep-orange-darken-3"
                                                    size="small">mdi-shield-account</v-icon>
                                                <span class="text-body-2 text-grey-darken-1">
                                                    {{ getRolLabel(usuario.rol) }}
                                                </span>
                                            </div> -->
                                            <div class="d-flex align-center ga-2 mb-2">
                                                <v-icon color="deep-orange-darken-3" size="small">mdi-calendar</v-icon>
                                                <span class="text-body-2 text-grey-darken-1">
                                                    {{ formatDate(usuario.fecha_creacion) }}
                                                </span>
                                            </div>
                                            <div class="d-flex align-center ga-2">
                                                <v-icon color="deep-orange-darken-3"
                                                    size="small">mdi-account-check</v-icon>
                                                <span class="text-body-2 text-grey-darken-1">
                                                    ID: {{ usuario.usuario_id }}
                                                </span>
                                            </div>
                                        </v-card-text>


                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Dialog de Crear Usuario -->
        <v-dialog v-model="createDialog" max-width="600px" persistent>
            <v-card>
                <v-card-title class="d-flex align-center justify-space-between pa-6 
                 text-black">
                    <div class="d-flex align-center">
                        <v-icon class="mr-3" color="grey-darken-3">mdi-account-plus</v-icon>
                        <span class="text-h5">Crear Nuevo Usuario</span>
                    </div>
                    <v-btn icon="mdi-close" variant="text" color="white" @click="closeDialog" />
                </v-card-title>

                <v-divider />

                <v-card-text class="pa-6" color="blue-grey-darken-3">
                    <v-form ref="userForm" @submit.prevent="createUser">
                        <v-text-field v-model="formData.nombre" label="Nombre Completo"
                            placeholder="Ej: Juan Pérez García" prepend-inner-icon="mdi-account" variant="outlined"
                            color="orange" :rules="nombreRules" :error-messages="fieldErrors.nombre" :disabled="loading"
                            class="mb-4" @input="clearFieldError('nombre')" />

                        <v-text-field v-model="formData.email" label="Correo Electrónico" type="email"
                            placeholder="usuario@ejemplo.com" prepend-inner-icon="mdi-email" variant="outlined"
                            color="orange" :rules="emailRules" :error-messages="fieldErrors.email" :disabled="loading"
                            class="mb-4" @input="clearFieldError('email')" />

                        <v-text-field v-model="formData.password" label="Contraseña"
                            :type="showPassword ? 'text' : 'password'" placeholder="Mínimo 6 caracteres"
                            prepend-inner-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            variant="outlined" color="orange" :rules="passwordRules"
                            :error-messages="fieldErrors.password" :disabled="loading" class="mb-4"
                            @click:append-inner="showPassword = !showPassword" @input="clearFieldError('password')" />

                        <v-text-field v-model="confirmPassword" label="Confirmar Contraseña"
                            :type="showConfirmPassword ? 'text' : 'password'" placeholder="Repite la contraseña"
                            prepend-inner-icon="mdi-lock-check"
                            :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'" variant="outlined"
                            color="orange" :rules="confirmPasswordRules" :disabled="loading" class="mb-2"
                            @click:append-inner="showConfirmPassword = !showConfirmPassword" />

                        <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable
                            @click:close="clearError">
                            {{ error }}
                        </v-alert>
                    </v-form>
                </v-card-text>

                <v-divider />

                <v-card-actions class="pa-6">
                    <v-spacer />
                    <v-btn variant="text" color="grey" size="large" :disabled="loading" @click="closeDialog">
                        Cancelar
                    </v-btn>
                    <v-btn color="orange" size="large" :loading="loading" :disabled="loading" @click="createUser">
                        Crear Usuario
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Snackbar para mensajes -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout" location="top">
            {{ snackbar.message }}
            <template v-slot:actions>
                <v-btn variant="text" @click="snackbar.show = false">
                    Cerrar
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useDespachosStore } from '@/stores/despachosStore'

// Store
const despachosStore = useDespachosStore()

// Referencias
const userForm = ref(null)
const createDialog = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const usuarios = ref([])
const loadingUsuarios = ref(false)

const formData = reactive({
    nombre: '',
    email: '',
    password: ''
})

const confirmPassword = ref('')

const loading = ref(false)
const error = ref(null)

const fieldErrors = reactive({
    nombre: [],
    email: [],
    password: []
})


const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
    timeout: 3000
})

// ==================== REGLAS DE VALIDACIÓN ====================
const nombreRules = [
    v => !!v || 'El nombre completo es requerido',
    v => (v && v.length >= 3) || 'El nombre debe tener al menos 3 caracteres',
    v => (v && v.length <= 100) || 'El nombre no puede tener más de 100 caracteres'
]

const emailRules = [
    v => !!v || 'El correo electrónico es requerido',
    v => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido'
]

const passwordRules = [
    v => !!v || 'La contraseña es requerida',
    v => (v && v.length >= 6) || 'La contraseña debe tener al menos 6 caracteres',
    v => (v && v.length <= 50) || 'La contraseña no puede tener más de 50 caracteres'
]

const confirmPasswordRules = [
    v => !!v || 'Debes confirmar la contraseña',
    v => v === formData.password || 'Las contraseñas no coinciden'
]

//MÉTODOS

// NUEVOS: Métodos para estilizar las cards
const getRolColor = (rol) => {
    const colors = {
        'superadmin': 'purple',
        'admin': 'blue',
        'usuario': 'green',
        'invitado': 'grey'
    }
    return colors[rol] || 'grey'
}

const getRolLabel = (rol) => {
    const labels = {
        'superadmin': 'SUPER ADMIN',
        'admin': 'ADMIN',
        'usuario': 'USUARIO',
        'invitado': 'INVITADO'
    }
    return labels[rol] || rol?.toUpperCase() || 'N/A'
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

/* const editUsuario = (usuario) => {
    console.log('Editar usuario:', usuario)
} */

const cargarUsuarios = async () => {
    loadingUsuarios.value = true
    try {
        const result = await despachosStore.getUsuariosActivos()


        if (result.success) {
            usuarios.value = result.data.usuarios || result.data || []
        } else {
            showSnackbar(result.error || 'Error al cargar usuarios', 'error')
        }
    } catch (err) {
        showSnackbar('Error al cargar usuarios', 'error')
    } finally {
        loadingUsuarios.value = false
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
    formData.nombre = ''
    formData.email = ''
    formData.password = ''
    confirmPassword.value = ''
    error.value = null

    Object.keys(fieldErrors).forEach(key => {
        fieldErrors[key] = []
    })

    if (userForm.value) {
        userForm.value.resetValidation()
    }
}

const clearFieldError = (field) => {
    fieldErrors[field] = []
    if (error.value) error.value = null
}

const clearError = () => {
    error.value = null
}

const showSnackbar = (message, color = 'success') => {
    snackbar.message = message
    snackbar.color = color
    snackbar.show = true
}

const createUser = async () => {
    const { valid } = await userForm.value.validate()

    if (!valid) {
        return
    }

    loading.value = true
    error.value = null

    try {
        const result = await despachosStore.createUsuarioGlobal({
            nombre: formData.nombre,
            email: formData.email,
            password: formData.password
        })

        if (result.success) {
            showSnackbar('¡Usuario creado exitosamente!', 'success')
            closeDialog()

            await cargarUsuarios()
        } else {
            error.value = result.error || 'Error al crear el usuario'

            if (result.error?.toLowerCase().includes('correo') ||
                result.error?.toLowerCase().includes('email')) {
                fieldErrors.email = ['Este correo ya está en uso']
            }
        }
    } catch (err) {
        error.value = 'Error inesperado al crear el usuario. Intenta de nuevo.'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    cargarUsuarios()
})
</script>

<style scoped>
/* Estilos para las cards de usuarios */
.usuario-card {
    position: relative;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}

.usuario-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 4px #DC2626 !important;
}

.orange-bar {
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

:deep(.v-field--variant-outlined) {
    border-radius: 8px;
}

:deep(.v-btn) {
    border-radius: 8px;
    letter-spacing: 0.5px;
}
</style>