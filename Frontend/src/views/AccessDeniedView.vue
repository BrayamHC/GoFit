<template>
    <v-container fluid class="fill-height access-denied-container">
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6" lg="5">
                <v-card class="error-card text-center" elevation="8">
                    <v-card-text class="pa-8">
                        <!-- Icono de error -->
                        <v-avatar size="120" color="error" class="mb-6">
                            <v-icon size="80" color="white">
                                mdi-lock-alert
                            </v-icon>
                        </v-avatar>

                        <!-- Título -->
                        <h1 class="text-h3 font-weight-bold error--text mb-4">
                            Acceso Denegado
                        </h1>

                        <!-- Descripción -->
                        <p class="text-h6 text-medium-emphasis mb-6">
                            No tienes los permisos necesarios para acceder a esta página
                        </p>

                        <!-- Información adicional -->
                        <v-alert type="info" variant="tonal" class="mb-6 text-left">
                            <p class="mb-2">
                                <strong>¿Por qué veo esto?</strong>
                            </p>
                            <ul class="pl-4">
                                <li>Tu rol de usuario no tiene acceso a este módulo</li>
                                <li>El módulo no está habilitado en tu sucursal</li>
                                <li>Necesitas permisos adicionales del administrador</li>
                            </ul>
                        </v-alert>

                        <!-- Información del usuario actual -->
                        <v-card v-if="userInfo" variant="outlined" class="mb-6">
                            <v-card-text>
                                <div class="d-flex align-center justify-space-between mb-2">
                                    <span class="text-medium-emphasis">Usuario:</span>
                                    <span class="font-weight-bold">{{ userInfo.name }}</span>
                                </div>
                                <div class="d-flex align-center justify-space-between mb-2">
                                    <span class="text-medium-emphasis">Rol:</span>
                                    <v-chip size="small" color="primary">
                                        {{ userInfo.role }}
                                    </v-chip>
                                </div>
                                <div class="d-flex align-center justify-space-between">
                                    <span class="text-medium-emphasis">Sucursal:</span>
                                    <span class="font-weight-bold">{{ userInfo.branch }}</span>
                                </div>
                            </v-card-text>
                        </v-card>

                        <!-- Botones de acción -->
                        <div class="d-flex flex-column ga-3">
                            <v-btn color="primary" size="large" prepend-icon="mdi-home" @click="goToDashboard">
                                Ir al Dashboard
                            </v-btn>

                            <v-btn variant="outlined" size="large" prepend-icon="mdi-arrow-left" @click="goBack">
                                Volver Atrás
                            </v-btn>

                            <v-btn variant="text" size="large" prepend-icon="mdi-logout" color="error"
                                @click="handleLogout">
                                Cerrar Sesión
                            </v-btn>
                        </div>
                    </v-card-text>

                    <v-divider />

                    <!-- Footer -->
                    <v-card-text class="py-4">
                        <p class="text-body-2 text-medium-emphasis mb-2">
                            Si crees que esto es un error, contacta al administrador del sistema
                        </p>
                        <v-btn variant="text" size="small" prepend-icon="mdi-email" color="primary">
                            Contactar Soporte
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

// Información del usuario
const userInfo = computed(() => {
    if (!authStore.user) return null

    return {
        name: authStore.user.name || authStore.user.email,
        role: authStore.user.role?.name || 'Sin rol',
        branch: authStore.user.branch?.name || 'Sin sucursal'
    }
})

// Funciones de navegación
const goToDashboard = () => {
    router.push('/dashboard').catch(err => {
        console.error('Error al navegar al dashboard:', err)
        // Si falla, intenta recargar
        window.location.href = '/dashboard'
    })
}

const goBack = () => {
    // Si hay historial, volver atrás
    if (window.history.length > 1) {
        router.back()
    } else {
        // Si no, ir al dashboard
        goToDashboard()
    }
}

const handleLogout = async () => {
    try {
        await authStore.logout()
        router.push('/login')
    } catch (error) {
        console.error('Error al cerrar sesión:', error)
        // Forzar logout en caso de error
        window.location.href = '/login'
    }
}

// Al montar, verificar si realmente no tiene acceso
onMounted(() => {
    /* console.log(' Acceso Denegado')
    console.log('Usuario:', authStore.user)
    console.log('Autenticado:', authStore.isAuthenticated) */
})
</script>

<style scoped>
.access-denied-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.error-card {
    border-radius: 16px !important;
    border-top: 4px solid rgb(var(--v-theme-error));
}

/* Animación del icono */
.v-avatar {
    animation: pulse 2s infinite;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }
}

/* Estilo para la lista */
ul {
    list-style-type: disc;
}

ul li {
    margin-bottom: 0.5rem;
}
</style>