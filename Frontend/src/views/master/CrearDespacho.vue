<template>
    <v-app>
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout" location="top">
            {{ snackbar.text }}
        </v-snackbar>

        <v-container fluid class="pa-6 bg-grey-darken-3" style="min-height: 100vh;">
            <!-- Header -->
            <v-row class="mb-6">
                <v-col>
                    <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-4">
                        <div class="d-flex align-center ga-4">
                            <v-btn icon variant="text" color="white" @click="volver" :disabled="loading">
                                <v-icon>mdi-arrow-left</v-icon>
                            </v-btn>
                            <div>
                                <h1 class="text-h4 font-weight-bold text-white mb-1">Nuevo Producto</h1>
                                <p class="text-body-2 text-grey-lighten-1 ma-0">
                                    Agrega nuevo producto
                                </p>
                            </div>
                        </div>
                        <div class="d-flex ga-3">
                            <v-btn variant="text" color="white" @click="volver" :disabled="loading">
                                Cancelar
                            </v-btn>
                            <v-btn color="red" variant="flat" prepend-icon="mdi-content-save" @click="submitForm"
                                :loading="loading" elevation="2" size="large">
                                Crear Producto
                            </v-btn>
                        </div>
                    </div>
                </v-col>
            </v-row>

            <!-- Contenido Principal -->
            <v-row>
                <!-- Sidebar de navegación -->
                <v-col cols="12" md="3">
                    <v-card elevation="2" rounded="lg" class="bg-grey-darken-4">
                        <v-list density="compact" nav bg-color="transparent">
                            <v-list-item v-for="step in steps" :key="step.id" :value="step.id"
                                :active="currentStep === step.id" @click="currentStep = step.id"
                                :prepend-icon="step.icon" :title="step.label" color="red" rounded="lg" class="mb-1">
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>

                <!-- Formulario -->
                <v-col cols="12" md="9">
                    <v-card elevation="2" rounded="lg" class="bg-grey-darken-4">
                        <!-- Paso 1: Información General -->
                        <v-card-text v-show="currentStep === 'general'" class="pa-8">
                            <h2 class="text-h5 font-weight-medium text-white mb-6">Datos del Producto</h2>

                            <v-row>
                                <!-- Razón Social y Nombre Corto -->
                                <v-col cols="12" lg="6">
                                    <v-text-field v-model="formData.razon_social" label="Razón Social"
                                        placeholder="Ej: Consultorios Médicos Delta" variant="outlined"
                                        density="comfortable" @input="generateSubdominio"
                                        :error-messages="getFieldError('razon_social')"
                                        hint="Nombre legal completo del despacho o consultorio" persistent-hint
                                        color="red" bg-color="grey-darken-4">
                                        <template v-slot:label>
                                            <span class="text-white">Razón Social <span class="text-red">*</span></span>
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" lg="6">
                                    <v-text-field v-model="formData.nombre_corto" label="Nombre Corto"
                                        placeholder="Ej: Admin Delta" variant="outlined" density="comfortable"
                                        hint="Nombre corto para identificación rápida" persistent-hint color="red"
                                        bg-color="grey-darken-4">
                                        <template v-slot:label>
                                            <span class="text-white">Nombre Corto</span>
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <!-- Teléfono y Email -->
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="formData.telefono" label="Teléfono Principal"
                                        placeholder="(000) 000-0000" variant="outlined" density="comfortable"
                                        color="red" bg-color="grey-darken-4">
                                        <template v-slot:label>
                                            <span class="text-white">Teléfono Principal</span>
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field v-model="formData.email_despacho" label="Email General" type="email"
                                        placeholder="info@ejemplo.com" variant="outlined" density="comfortable"
                                        color="red" bg-color="grey-darken-4">
                                        <template v-slot:label>
                                            <span class="text-white">Email General</span>
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <!-- Dirección -->
                                <v-col cols="12">
                                    <v-textarea v-model="formData.direccion" label="Dirección Completa"
                                        placeholder="Calle, número, colonia, ciudad, estado, C.P." rows="3"
                                        variant="outlined" density="comfortable" color="red" bg-color="grey-darken-4">
                                        <template v-slot:label>
                                            <span class="text-white">Dirección Completa</span>
                                        </template>
                                    </v-textarea>
                                </v-col>

                                <!-- Información Fiscal -->
                                <v-col cols="12">
                                    <v-divider class="my-4 border-opacity-25"></v-divider>
                                    <h3 class="text-h6 font-weight-medium text-white mb-4">Información Fiscal</h3>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field v-model="formData.rfc" label="R.F.C." placeholder="XAXX010101000"
                                        variant="outlined" density="comfortable" color="red" bg-color="grey-darken-4">
                                        <template v-slot:label>
                                            <span class="text-white">R.F.C.</span>
                                        </template>
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>

                        <!-- Paso 2: Datos del Administrador -->
                        <v-card-text v-show="currentStep === 'admin'" class="pa-8">
                            <h2 class="text-h5 font-weight-medium text-white mb-2">Usuario Administrador</h2>

                            <!-- Nota informativa -->
                            <v-alert type="info" variant="tonal" class="mb-6" color="blue-darken-2">
                                <strong>Nota:</strong> Este usuario tendrá acceso completo al sistema del despacho.
                                Se recomienda compartir estas credenciales de forma segura.
                            </v-alert>

                            <v-row>
                                <!-- Datos personales -->
                                <v-col cols="12">
                                    <v-text-field v-model="formData.nombre_completo"
                                        placeholder="Ej: Administrador Consultorios Delta" variant="outlined"
                                        density="comfortable" :error-messages="getFieldError('nombre_completo')"
                                        color="red" bg-color="grey-darken-4">
                                        <template v-slot:label>
                                            <span class="text-white">Nombre Completo <span
                                                    class="text-red">*</span></span>
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field v-model="formData.telefono_admin" label="Teléfono"
                                        placeholder="(000) 000-0000" variant="outlined" density="comfortable"
                                        color="red" bg-color="grey-darken-4">
                                        <template v-slot:label>
                                            <span class="text-white">Teléfono</span>
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <!-- Email -->
                                <v-col cols="12">
                                    <v-text-field v-model="formData.email" type="email"
                                        placeholder="admin@medicosdelta.com" variant="outlined" density="comfortable"
                                        :error-messages="getEmailErrors()" hint="Será usado para iniciar sesión"
                                        persistent-hint color="red" bg-color="grey-darken-4">
                                        <template v-slot:label>
                                            <span class="text-white">Email <span class="text-red">*</span></span>
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <!-- Credenciales de Acceso -->
                                <v-col cols="12">
                                    <v-divider class="my-4 border-opacity-25"></v-divider>
                                    <h3 class="text-h6 font-weight-medium text-white mb-4">Credenciales de Acceso</h3>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field v-model="formData.password" :type="showPassword ? 'text' : 'password'"
                                        placeholder="Mínimo 8 caracteres" variant="outlined" density="comfortable"
                                        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                        @click:append-inner="showPassword = !showPassword"
                                        :error-messages="getFieldError('password')"
                                        hint="Debe incluir mayúsculas, minúsculas y números" persistent-hint color="red"
                                        bg-color="grey-darken-4">
                                        <template v-slot:label>
                                            <span class="text-white">Contraseña <span class="text-red">*</span></span>
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field v-model="formData.confirm_password"
                                        :type="showConfirmPassword ? 'text' : 'password'"
                                        placeholder="Confirma la contraseña" variant="outlined" density="comfortable"
                                        :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                        @click:append-inner="showConfirmPassword = !showConfirmPassword"
                                        :error-messages="getPasswordMatchError()" color="red" bg-color="grey-darken-4">
                                        <template v-slot:label>
                                            <span class="text-white">Confirmar Contraseña <span
                                                    class="text-red">*</span></span>
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <!-- Mensaje de advertencia -->
                                <v-col cols="12">
                                    <v-alert type="warning" variant="tonal" color="amber-darken-2">
                                        <strong>Importante:</strong> Guarda estas credenciales en un lugar seguro.
                                        El administrador podrá cambiar su contraseña después del primer acceso.
                                    </v-alert>
                                </v-col>
                            </v-row>
                        </v-card-text>

                        <!-- Paso 3: Configuración -->
                        <v-card-text v-show="currentStep === 'config'" class="pa-8">
                            <h2 class="text-h5 font-weight-medium text-white mb-6">Configuración del Sistema</h2>

                            <v-row>
                                <!-- Subdominio -->
                                <v-col cols="12">
                                    <v-text-field v-model="formData.subdominio" placeholder="consultorios-medicos-delta"
                                        variant="outlined" density="comfortable"
                                        :error-messages="getFieldError('subdominio')"
                                        hint="Este será la URL de acceso al despacho. Solo letras minúsculas, números y guiones."
                                        persistent-hint color="red" bg-color="grey-darken-4" class="font-mono">
                                        <template v-slot:label>
                                            <span class="text-white">Subdominio <span class="text-red">*</span></span>
                                        </template>
                                        <template v-slot:append-inner>
                                            <span class="text-grey text-body-2">.midominio.com</span>
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <!-- Zona y Plan -->
                                <v-col cols="12" md="6">
                                    <v-select v-model="formData.zona_id" :items="despachosStore.zonasHorarias"
                                        item-title="nombre" item-value="zona_id" placeholder="Seleccione una zona"
                                        variant="outlined" density="comfortable" :loading="despachosStore.loading"
                                        :disabled="despachosStore.zonasHorarias.length === 0"
                                        @update:model-value="onZonaChange" :error-messages="getFieldError('zona_id')"
                                        color="red" bg-color="grey-darken-4">
                                        <template v-slot:label>
                                            <span class="text-white">Zona / Región <span
                                                    class="text-red">*</span></span>
                                        </template>
                                    </v-select>
                                    <div v-if="despachosStore.zonasHorarias.length === 0"
                                        class="text-caption text-warning mt-1">
                                        Cargando zonas...
                                    </div>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-select v-model="formData.plan_id" :items="planesFormateados"
                                        item-title="displayName" item-value="plan_id" placeholder="Seleccione un plan"
                                        variant="outlined" density="comfortable" :loading="despachosStore.loading"
                                        :disabled="despachosStore.planes.length === 0"
                                        @update:model-value="onPlanChange" :error-messages="getFieldError('plan_id')"
                                        color="red" bg-color="grey-darken-4">
                                        <template v-slot:label>
                                            <span class="text-white">Plan de Suscripción <span
                                                    class="text-red">*</span></span>
                                        </template>

                                        <!-- Template personalizado para cada item -->
                                        <template v-slot:item="{ props, item }">
                                            <v-list-item v-bind="props" :title="item.raw.nombre_plan">
                                                <template v-slot:subtitle>
                                                    <div class="text-caption">{{ item.raw.nombre_plan }} - ${{
                                                        item.raw.costo }}</div>

                                                </template>
                                            </v-list-item>
                                        </template>

                                        <!-- Template para el valor seleccionado -->
                                        <template v-slot:selection="{ item }">
                                            <span>{{ item.raw.nombre_plan }} - ${{
                                                parseFloat(item.raw.costo).toFixed(2) }} {{ item.raw.moneda
                                                }}</span>
                                        </template>
                                    </v-select>
                                    <div v-if="despachosStore.planes.length === 0"
                                        class="text-caption text-warning mt-1">
                                        Cargando planes...
                                    </div>
                                </v-col>

                                <!-- Configuración Adicional -->
                                <v-col cols="12">
                                    <v-divider class="my-4 border-opacity-25"></v-divider>
                                    <h3 class="text-h6 font-weight-medium text-white mb-4">Configuración Adicional</h3>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field v-model="formData.fecha_activacion" label="Fecha de Activación"
                                        type="date" variant="outlined" density="comfortable" color="red"
                                        bg-color="grey-darken-4">
                                        <template v-slot:label>
                                            <span class="text-white">Fecha de Activación</span>
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field v-model.number="formData.limite_usuarios" label="Límite de Usuarios"
                                        type="number" placeholder="5" variant="outlined" density="comfortable" :min="1"
                                        :max="100" color="red" bg-color="grey-darken-4">
                                        <template v-slot:label>
                                            <span class="text-white">Límite de Usuarios</span>
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <!-- Notas de Configuración -->
                                <v-col cols="12">
                                    <v-textarea v-model="formData.notas" label="Notas de Configuración"
                                        placeholder="Agrega notas adicionales sobre la configuración del despacho..."
                                        rows="4" variant="outlined" density="comfortable" color="red"
                                        bg-color="grey-darken-4">
                                        <template v-slot:label>
                                            <span class="text-white">Notas de Configuración</span>
                                        </template>
                                    </v-textarea>
                                </v-col>

                                <!-- Vista Previa -->
                                <v-col cols="12">
                                    <v-card color="red-darken-4" variant="tonal" elevation="0">
                                        <v-card-text>
                                            <div class="d-flex align-start ga-3">
                                                <v-icon size="large" color="red-lighten-2">mdi-office-building</v-icon>
                                                <div class="flex-grow-1">
                                                    <h4 class="text-subtitle-1 font-weight-medium text-white mb-3">
                                                        Vista Previa del Despacho
                                                    </h4>
                                                    <v-row dense>
                                                        <v-col cols="12" class="d-flex justify-space-between">
                                                            <span class="font-weight-medium text-red-lighten-2">Razón
                                                                Social:</span>
                                                            <span class="text-white">{{ formData.razon_social ||
                                                                'Sin definir' }}</span>
                                                        </v-col>
                                                        <v-col cols="12" class="d-flex justify-space-between">
                                                            <span class="font-weight-medium text-red-lighten-2">URL de
                                                                Acceso:</span>
                                                            <span class="text-white font-mono text-caption">
                                                                {{ formData.subdominio ?
                                                                    `${formData.subdominio}.midominio.com` :
                                                                    'sin-subdominio.midominio.com' }}
                                                            </span>
                                                        </v-col>
                                                    </v-row>
                                                </div>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDespachosStore } from '@/stores/despachosStore'

const router = useRouter()
const despachosStore = useDespachosStore()

// Snackbar (reemplazo de Toast)
const snackbar = ref({
    show: false,
    text: '',
    color: 'success',
    timeout: 3000
})

const showSnackbar = (text, color = 'success', timeout = 3000) => {
    snackbar.value = { show: true, text, color, timeout }
}

// Estado del formulario
const currentStep = ref('general')
const submitted = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Pasos del formulario
const steps = ref([
    { id: 'general', label: 'Información General', icon: 'mdi-office-building' },
    { id: 'admin', label: 'Datos del Administrador', icon: 'mdi-account' },
    { id: 'config', label: 'Configuración', icon: 'mdi-cog' }
])

// Datos del formulario - Ajustados al formato del endpoint
const formData = ref({
    // Información General
    razon_social: '',
    nombre_corto: '',
    telefono: '',
    email_despacho: '',
    direccion: '',
    rfc: '',
    // Usuario Administrador
    nombre_completo: '',
    telefono_admin: '',
    email: '',
    password: '',
    confirm_password: '',
    // Configuración
    subdominio: '',
    zona_id: null,
    plan_id: null,
    fecha_activacion: new Date().toISOString().split('T')[0],
    limite_usuarios: 5,
    notas: ''
})

// Computed para planes formateados
const planesFormateados = computed(() => {
    return despachosStore.planes.map(plan => ({
        ...plan,
        // Formatear el título para mostrar
        displayName: `${plan.nombre_plan} - $${parseFloat(plan.costo_mensual).toFixed(2)} ${plan.moneda}/mes`,
        // Información adicional
        subtitle: plan.descripcion_plan
    }))
})

// Validación de email
const isValidEmail = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(formData.value.email)
})

// Generar subdominio automáticamente
const generateSubdominio = () => {
    if (formData.value.razon_social) {
        formData.value.subdominio = formData.value.razon_social
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
    }
}

// Funciones de validación de errores
const getFieldError = (field) => {
    if (!submitted.value) return ''

    const errors = {
        razon_social: !formData.value.razon_social ? 'Este campo es obligatorio' : '',
        nombre_completo: !formData.value.nombre_completo ? 'Este campo es obligatorio' : '',
        password: !formData.value.password ? 'Este campo es obligatorio' : '',
        subdominio: !formData.value.subdominio ? 'Este campo es obligatorio' : '',
        zona_id: !formData.value.zona_id ? 'Seleccione una zona' : '',
        plan_id: !formData.value.plan_id ? 'Seleccione un plan' : ''
    }

    return errors[field] || ''
}

const getEmailErrors = () => {
    if (!submitted.value) return ''
    if (!formData.value.email) return 'Este campo es obligatorio'
    if (!isValidEmail.value) return 'Ingrese un correo válido'
    return ''
}

const getPasswordMatchError = () => {
    if (!submitted.value) return ''
    if (formData.value.password !== formData.value.confirm_password) {
        return 'Las contraseñas no coinciden'
    }
    return ''
}

// Handlers para dropdowns
const onZonaChange = (value) => {
    console.log('Zona seleccionada:', value)
}

const onPlanChange = (value) => {
    console.log('Plan seleccionado:', value)
}

// Validar formulario
const validateForm = () => {
    if (!formData.value.razon_social) return false
    if (!formData.value.nombre_completo) return false
    if (!formData.value.email || !isValidEmail.value) return false
    if (!formData.value.password) return false
    if (formData.value.password !== formData.value.confirm_password) return false
    if (!formData.value.subdominio) return false
    if (!formData.value.zona_id) return false
    if (!formData.value.plan_id) return false
    return true
}

// Preparar datos para enviar al backend
const prepareDataForBackend = () => {
    // Convertir fecha al formato esperado YYYY-MM-DD (que ya viene así del input type="date")
    const formatDate = (dateString) => {
        if (!dateString) return ''
        // El input type="date" ya devuelve en formato YYYY-MM-DD
        return dateString
    }

    return {
        razon_social: formData.value.razon_social,
        subdominio: formData.value.subdominio,
        rfc: formData.value.rfc || '',
        zona_id: formData.value.zona_id,
        plan_id: formData.value.plan_id,
        nombre_corto: formData.value.nombre_corto || '',
        password: formData.value.password,
        email: formData.value.email,
        nombre_completo: formData.value.nombre_completo,
        telefono: formData.value.telefono || '',
        fecha_activacion: formatDate(formData.value.fecha_activacion),
        notas: formData.value.notas || ''
    }
}

// Enviar formulario
const submitForm = async () => {
    submitted.value = true

    if (!validateForm()) {
        showSnackbar(
            'Por favor complete todos los campos requeridos en todas las secciones',
            'warning',
            4000
        )

        // Navegar al primer paso con error
        if (!formData.value.razon_social) {
            currentStep.value = 'general'
        } else if (!formData.value.nombre_completo || !formData.value.email || !formData.value.password) {
            currentStep.value = 'admin'
        } else {
            currentStep.value = 'config'
        }

        return
    }

    loading.value = true

    try {
        // Preparar datos en el formato esperado por el backend
        const dataToSend = prepareDataForBackend()

        console.log('Enviando datos:', dataToSend)

        const result = await despachosStore.createDespacho(dataToSend)

        if (result.success) {
            showSnackbar('El despacho ha sido creado correctamente', 'success', 3000)

            // Esperar un poco antes de redirigir
            setTimeout(() => {
                router.push('/core/despachos')
            }, 1500)
        } else {
            showSnackbar(result.error || 'No se pudo crear el despacho', 'error', 5000)
        }
    } catch (error) {
        console.error('Error al crear despacho:', error)
        showSnackbar('Ocurrió un error inesperado', 'error', 5000)
    } finally {
        loading.value = false
    }
}

// Volver a la lista
const volver = () => {
    router.push('/core/despachos')
}

// Cargar datos iniciales
onMounted(async () => {
    console.log('Montando componente CrearDespacho')

    // Cargar zonas y planes si no están cargados
    if (despachosStore.zonasHorarias.length === 0 || despachosStore.planes.length === 0) {
        console.log('Cargando datos iniciales...')
        await despachosStore.fetchDespachos()
        console.log('Datos cargados - Zonas:', despachosStore.zonasHorarias.length, 'Planes:', despachosStore.planes.length)
    }
})
</script>

<style scoped>
/* Estilos para campos de texto oscuros */
:deep(.v-field) {
    color: white !important;
}

:deep(.v-field__input) {
    color: white !important;
}

:deep(.v-field__input::placeholder) {
    color: rgba(255, 255, 255, 0.5) !important;
}

:deep(.v-label) {
    opacity: 1 !important;
}

:deep(.v-select__selection-text) {
    color: white !important;
}

:deep(.v-list-item-title) {
    color: white !important;
}
</style>