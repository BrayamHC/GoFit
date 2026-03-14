<template>
    <v-app>
        <v-main>
            <div class="master-login-container">
                <v-card class="master-login-card" elevation="24">
                    <!-- Badge Panel Maestro -->
                    <v-chip class="master-badge" color="error" variant="flat">
                        <v-icon start>mdi-dumbbell</v-icon>
                        Panel Administrador
                    </v-chip>

                    <!-- Header -->
                    <div class="login-header">
                        <h1>Go Fit</h1>
                        <p>Administración Central</p>
                    </div>

                    <!-- Snackbar para notificaciones -->
                    <v-snackbar v-model="showToast" :color="toastColor" :timeout="toastTimeout" location="top">
                        {{ toastMessage }}
                        <template v-slot:actions>
                            <v-btn variant="text" @click="showToast = false">
                                Cerrar
                            </v-btn>
                        </template>
                    </v-snackbar>

                    <!-- Mensaje de error -->
                    <v-alert v-if="errorMessage" type="error" variant="tonal" class="error-message mb-4">
                        <template v-slot:prepend>
                            <v-icon>mdi-alert-circle</v-icon>
                        </template>
                        {{ errorMessage }}
                    </v-alert>

                    <!-- Formulario -->
                    <v-form @submit.prevent="handleLogin" class="login-form">
                        <v-text-field v-model="email" label="Correo Electrónico" type="email"
                            placeholder="admin@gofit.com" :disabled="loading" variant="outlined" color="error"
                            autocomplete="email" required class="mb-3" />

                        <v-text-field v-model="password" label="Contraseña" type="password" placeholder="••••••••"
                            :disabled="loading" variant="outlined" color="error" autocomplete="current-password"
                            required class="mb-4" />

                        <v-btn type="submit" color="error" size="x-large" :loading="loading" :disabled="loading" block
                            class="login-button">
                            <v-icon start>{{ loading ? 'mdi-loading mdi-spin' : 'mdi-login' }}</v-icon>
                            {{ loading ? 'Verificando...' : 'Iniciar Sesión' }}
                        </v-btn>
                    </v-form>

                    <!-- Footer -->
                    <v-divider class="my-4"></v-divider>
                    <!-- <div class="login-footer">
                        <router-link to="/login" class="footer-link">
                            <v-icon size="small" class="mr-2">mdi-arrow-left</v-icon>
                            Ir al login de usuarios
                        </router-link>
                    </div> -->
                </v-card>
            </div>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMasterAuthStore } from '@/stores/masterAuthStore'

const router = useRouter()
const masterAuthStore = useMasterAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const showToast = ref(false)
const toastMessage = ref('')
const toastColor = ref('success')
const toastTimeout = ref(3000)

const loading = computed(() => masterAuthStore.loading)

const handleLogin = async () => {
    errorMessage.value = ''

    if (!email.value || !password.value) {
        errorMessage.value = 'Por favor completa todos los campos'
        return
    }

    const result = await masterAuthStore.login({
        email: email.value,
        password: password.value
    })

    if (result.success) {
        toastColor.value = 'success'
        toastMessage.value = result.message || 'Bienvenido a Go Fit'
        toastTimeout.value = 3000
        showToast.value = true

        setTimeout(() => {
            router.push('/core/dashboard')
        }, 500)
    } else {
        errorMessage.value = result.error || 'Error al iniciar sesión'

        toastColor.value = 'error'
        toastMessage.value = result.error || 'Credenciales inválidas'
        toastTimeout.value = 5000
        showToast.value = true

        setTimeout(() => {
            errorMessage.value = ''
        }, 5000)
    }
}
</script>

<style scoped>
.master-login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100vw;
    background-image: url('/images/2.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    padding: clamp(1rem, 3vh, 2rem);
    position: fixed;
    top: 0;
    left: 0;
    overflow-y: auto;
}

.master-login-card {
    padding: clamp(1.5rem, 4vh, 3rem);
    width: 100%;
    max-width: 450px;
    border-top: 4px solid #dc2626 !important;
    animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.master-badge {
    margin-bottom: clamp(0.75rem, 2vh, 1.5rem);
    font-weight: 600;
    height: 36px;
}

.login-header {
    text-align: center;
    margin-bottom: clamp(1rem, 3vh, 2.5rem);
}

.login-header h1 {
    font-size: clamp(1.4rem, 3vw, 2rem);
    color: #0f172a;
    margin: 0.5rem 0;
    font-weight: 700;
    letter-spacing: 1px;
}

.login-header p {
    color: #64748b;
    font-size: clamp(0.85rem, 1.5vw, 1rem);
    margin: 0;
}

.error-message {
    animation: shake 0.4s ease-in-out;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

.login-form {
    display: flex;
    flex-direction: column;
}

.login-button {
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0.5px;
    transition: all 0.2s;
}

.login-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(220, 38, 38, 0.4) !important;
}

.login-button:active:not(:disabled) {
    transform: translateY(0);
}

.login-footer {
    text-align: center;
}

.footer-link {
    display: inline-flex;
    align-items: center;
    color: #64748b;
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.2s;
}

.footer-link:hover {
    color: #0f172a;
}

/* Laptops con altura reducida (ej. 14" a 768px de alto) */
@media (max-height: 800px) {
    .master-login-card {
        padding: 1.5rem 2rem;
    }

    .login-header {
        margin-bottom: 1rem;
    }

    .master-badge {
        margin-bottom: 0.75rem;
    }
}

/* Mobile */
@media (max-width: 640px) {
    .master-login-container {
        padding: 1rem;
        align-items: flex-start;
        padding-top: 2rem;
    }

    .master-login-card {
        padding: 1.5rem;
    }

    .login-header h1 {
        font-size: 1.5rem;
    }
}

:deep(.v-field) {
    border-radius: 8px;
    font-size: 1rem;
}

:deep(.v-field--focused) {
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

:deep(.v-label) {
    font-weight: 600;
    color: #0f172a;
    font-size: 0.95rem;
}
</style>
