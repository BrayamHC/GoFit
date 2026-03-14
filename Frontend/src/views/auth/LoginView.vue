<template>
    <v-container fluid class="login-container pa-0">
        <v-row no-gutters class="fill-height" align="center" justify="center">
            <v-col cols="12" sm="8" md="6" lg="4" xl="3">
                <v-card class="login-card" elevation="24">
                    <!-- Header -->
                    <v-card-text class="text-center pt-8 pb-4">
                        <v-icon size="80" color="primary" class="mb-4">
                            mdi-office-building
                        </v-icon>
                        <h1 class="text-h4 font-weight-bold primary--text mb-2">
                            DELTA ERP
                        </h1>
                        <p class="text-body-1 text-medium-emphasis">
                            Sistema de Gestión Farmacéutica
                        </p>
                    </v-card-text>

                    <!-- Formulario -->
                    <v-card-text class="px-8 pb-8">
                        <v-form ref="loginForm" @submit.prevent="handleLogin">
                            <!-- Email -->
                            <v-text-field v-model="email" label="Correo Electrónico" type="email"
                                placeholder="usuario@ejemplo.com" prepend-inner-icon="mdi-email-outline"
                                variant="outlined" color="primary" :rules="emailRules"
                                :error-messages="fieldErrors.email" :disabled="loading" class="mb-2"
                                @input="clearFieldError('email')" />

                            <!-- Password -->
                            <v-text-field v-model="password" label="Contraseña"
                                :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                                prepend-inner-icon="mdi-lock-outline"
                                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" variant="outlined"
                                color="primary" :rules="passwordRules" :error-messages="fieldErrors.password"
                                :disabled="loading" class="mb-4" @click:append-inner="showPassword = !showPassword"
                                @input="clearFieldError('password')" />

                            <!-- Alert de Error -->
                            <v-alert v-if="error" type="error" variant="tonal" class="mb-4" closable
                                @click:close="clearError">
                                {{ error }}
                            </v-alert>

                            <!-- Botón Login -->
                            <v-btn type="submit" color="primary" size="large" block :loading="loading"
                                :disabled="loading" class="text-none font-weight-bold">
                                Iniciar Sesión
                            </v-btn>
                        </v-form>
                    </v-card-text>

                    <!-- Footer -->
                    <v-divider />
                    <v-card-text class="text-center py-4">
                        <p class="text-body-2 text-medium-emphasis mb-0">
                            Derechos reservados para Farmacéutica DELTA.
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

// Referencias
const loginForm = ref(null)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref(null)

// Errores por campo
const fieldErrors = reactive({
    email: [],
    password: []
})

// Snackbar
const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
    timeout: 3000
})

// Reglas de validación
const emailRules = [
    v => !!v || 'El correo electrónico es requerido',
    v => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido'
]

const passwordRules = [
    v => !!v || 'La contraseña es requerida',
    v => (v && v.length >= 4) || 'La contraseña debe tener al menos 4 caracteres'
]

// Limpiar error de un campo específico
const clearFieldError = (field) => {
    fieldErrors[field] = []
    if (error.value) error.value = null
}

// Limpiar error general
const clearError = () => {
    error.value = null
}

// Mostrar snackbar
const showSnackbar = (message, color = 'success') => {
    snackbar.message = message
    snackbar.color = color
    snackbar.show = true
}

// Manejar login
const handleLogin = async () => {
    // Validar formulario
    const { valid } = await loginForm.value.validate()

    if (!valid) {
        return
    }

    loading.value = true
    error.value = null

    try {
        const result = await authStore.login({
            email: email.value,
            password: password.value
        })

        if (result.success) {
            showSnackbar('¡Inicio de sesión exitoso!', 'success')

            // Pequeño delay para mostrar el mensaje
            setTimeout(() => {
                router.push('/dashboard')
            }, 500)
        } else {
            error.value = result.error || 'Error al iniciar sesión'

            // Si el error es específico de campo
            if (result.error?.includes('correo')) {
                fieldErrors.email = [result.error]
            } else if (result.error?.includes('contraseña')) {
                fieldErrors.password = [result.error]
            }
        }
    } catch (err) {
        console.error('Error en login:', err)
        error.value = 'Error inesperado. Por favor, intenta de nuevo.'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.login-container {
    min-height: 100vh;
    width: 100vw;
    background-image: url('/images/1.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-card {
    border-top: 4px solid rgb(var(--v-theme-primary));
    border-radius: 16px !important;
    max-width: 450px;
    width: 100%;
}

/* Estilos adicionales para los campos */
:deep(.v-field--variant-outlined) {
    border-radius: 8px;
}

:deep(.v-btn) {
    border-radius: 8px;
    letter-spacing: 0.5px;
}

/* Responsive */
@media (max-width: 600px) {
    .login-card {
        margin: 1rem;
    }
}
</style>