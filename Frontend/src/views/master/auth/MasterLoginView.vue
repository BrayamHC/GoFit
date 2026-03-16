<template>
  <v-app>
    <v-snackbar
      v-model="showToast"
      :color="toastColor"
      :timeout="toastTimeout"
      location="top center"
      rounded="lg"
    >
      <div class="d-flex align-center ga-2">
        <v-icon>{{ toastColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
        {{ toastMessage }}
      </div>
      <template #actions>
        <v-btn variant="text" @click="showToast = false">Cerrar</v-btn>
      </template>
    </v-snackbar>

    <div class="master-login-container">
      <div class="login-left">
        <v-card class="master-login-card" elevation="24">
          <v-chip class="master-badge" color="error" variant="flat">
            <v-icon start>mdi-dumbbell</v-icon>
            Panel Administrador
          </v-chip>

          <div class="login-header">
            <h1>Go Fit</h1>
            <p>Administración Central</p>
          </div>

          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            class="error-message mb-4"
            closable
          >
            <template #prepend>
              <v-icon>mdi-alert-circle</v-icon>
            </template>
            {{ errorMessage }}
          </v-alert>

          <v-form @submit.prevent="handleLogin" class="login-form">
            <v-text-field
              v-model="email"
              label="Correo Electrónico"
              type="email"
              placeholder="admin@gofit.com"
              :disabled="loading"
              variant="solo"
              density="comfortable"
              flat
              bg-color="#f8fafc"
              color="error"
              autocomplete="email"
              required
              class="mb-3"
            />

            <v-text-field
              v-model="password"
              label="Contraseña"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :disabled="loading"
              variant="solo"
              density="comfortable"
              flat
              bg-color="#f8fafc"
              color="error"
              autocomplete="current-password"
              required
              class="mb-5"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
            />

            <div class="login-button-wrapper">
              <v-btn
                type="submit"
                color="error"
                size="x-large"
                :loading="loading"
                :disabled="loading"
                class="login-button"
              >
                <v-icon start>{{ loading ? 'mdi-loading mdi-spin' : 'mdi-login' }}</v-icon>
                {{ loading ? 'Verificando...' : 'Iniciar Sesión' }}
              </v-btn>
            </div>
          </v-form>

          <v-divider class="mt-6 mb-4" />

          <p class="text-caption text-medium-emphasis text-center mb-0">
            © {{ new Date().getFullYear() }} Go Fit — Todos los derechos reservados
          </p>
        </v-card>
      </div>

      <div class="login-right" aria-hidden="true" />
    </div>
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
const showPassword = ref(false) // ← agrega esta línea

const loading = computed(() => masterAuthStore.loading)

const handleLogin = async () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor completa todos los campos'
    return
  }

  const result = await masterAuthStore.login({
    email: email.value,
    password: password.value,
  })

  if (result.success) {
    router.push('/core/dashboard') // navega directo, sin toast aquí
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
:deep(.v-field--variant-solo) {
  border-radius: 10px !important;
  border: 1.5px solid #e2e8f0;
  box-shadow: none !important;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

:deep(.v-field--variant-solo:hover) {
  border-color: #94a3b8;
}

:deep(.v-field--variant-solo.v-field--focused) {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
}

:deep(.v-field--variant-solo .v-field__overlay) {
  display: none;
}

:deep(.v-label) {
  font-weight: 500;
  font-size: 0.9rem;
  color: #94a3b8;
}
</style>
