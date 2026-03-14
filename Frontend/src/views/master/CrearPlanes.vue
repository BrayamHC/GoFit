<template>
    <v-container fluid class="bg-grey-darken-3 min-h-screen pa-6">

        <!-- Header -->
        <v-row align="center" class="mb-8">
            <v-col>
                <p class="text-h4 font-weight-bold text-white mb-1">Membresías</p>
                <p class="text-body-2 text-medium-emphasis">Gestión de membresías del sistema</p>
            </v-col>
            <v-col cols="auto">
                <v-btn color="red-darken-3" variant="flat" prepend-icon="mdi-plus" class="font-weight-bold"
                    @click="abrirDialog">
                    CREAR MEMBRESÍA
                </v-btn>
            </v-col>
        </v-row>

        <!-- Filtros -->
        <v-row class="mb-6" no-gutters>
            <v-col class="d-flex ga-2 flex-wrap">
                <v-btn v-for="f in filtros" :key="f.key" :variant="filtroActivo === f.key ? 'flat' : 'outlined'"
                    :color="filtroActivo === f.key ? 'red-darken-3' : 'grey-darken-1'" rounded="xl" size="small"
                    class="text-none" @click="filtroActivo = f.key">
                    <v-icon v-if="filtroActivo === f.key" start size="13">mdi-check</v-icon>
                    {{ f.label }}
                    <v-chip size="x-small" class="ml-2" :color="filtroActivo === f.key ? 'white' : 'grey-darken-2'"
                        variant="flat">
                        {{ contarPorFiltro(f.key) }}
                    </v-chip>
                </v-btn>
            </v-col>
        </v-row>

        <!-- Loading -->
        <v-row v-if="store.loading">
            <v-col class="d-flex justify-center pa-12">
                <v-progress-circular indeterminate color="red-darken-3" size="48" />
            </v-col>
        </v-row>

        <!-- Cards -->
        <v-row v-else>
            <v-col v-for="plan in planesFiltrados" :key="plan.plan_id" cols="12" sm="6" md="4" lg="3">
                <v-card rounded="xl" elevation="0" border height="480" class="d-flex flex-column">

                    <!-- ── Franja izquierda de color + contenido ── -->
                    <v-card-text class="pa-0 flex-grow-1 d-flex flex-column">

                        <!-- Zona superior: nombre, precio, status -->
                        <v-row no-gutters class="pa-5 pb-4">
                            <v-col>
                                <!-- Status + editar -->
                                <v-row no-gutters align="center" class="mb-3">
                                    <v-chip :color="plan.status === 'activo' ? 'green' : 'red'" size="x-small" label
                                        variant="tonal" class="font-weight-bold text-uppercase mr-2">
                                        {{ plan.status }}
                                    </v-chip>
                                    <v-spacer />
                                    <v-btn icon size="x-small" variant="text" color="grey" density="compact">
                                        <v-icon size="15">mdi-pencil-outline</v-icon>
                                    </v-btn>
                                </v-row>

                                <!-- Nombre -->
                                <p class="text-subtitle-1 font-weight-bold text-grey-darken-4 mb-0">{{ plan.nombre_plan
                                    }}</p>
                                <p class="text-caption text-medium-emphasis mb-0 text-truncate">{{ plan.descripcion_plan
                                    }}</p>

                                <!-- Precio -->
                                <v-row no-gutters align="baseline" class="mt-3">
                                    <span class="text-body-1 font-weight-bold text-red-darken-3">$</span>
                                    <span class="text-h4 font-weight-black text-red-darken-3 mx-1">
                                        {{ formatPrecio(plan.costo) }}
                                    </span>
                                    <v-chip size="x-small" color="grey-lighten-3" variant="flat"
                                        class="text-grey-darken-2 font-weight-medium">
                                        {{ plan.moneda }}/mes
                                    </v-chip>
                                </v-row>
                            </v-col>
                        </v-row>

                        <v-divider />

                        <!-- Recursos 2×2 -->
                        <v-row dense no-gutters class="pa-4 pb-0">
                            <v-col v-for="recurso in getRecursos(plan)" :key="recurso.label" cols="6" class="pa-1">
                                <v-row no-gutters align="center">
                                    <v-sheet color="red-lighten-5" width="28" height="28" rounded="lg"
                                        class="d-flex align-center justify-center mr-2 flex-shrink-0">
                                        <v-icon size="15" color="red-darken-3">{{ recurso.icon }}</v-icon>
                                    </v-sheet>
                                    <div>
                                        <p class="text-caption font-weight-bold text-grey-darken-3 mb-0 line-height-1">
                                            {{ recurso.valor }}</p>
                                        <p class="mb-0 text-grey" style="font-size:10px; line-height:1.3">{{
                                            recurso.label }}</p>
                                    </div>
                                </v-row>
                            </v-col>
                        </v-row>

                        <v-divider class="mt-4" />

                        <!-- Características (siempre 4 filas) -->
                        <div class="pa-4 pb-2 flex-grow-1">
                            <template v-for="n in 4" :key="n">
                                <!-- Slot ocupado -->
                                <v-row v-if="plan.caracteristicas && plan.caracteristicas[n - 1]" no-gutters
                                    align="center" class="mb-2">
                                    <v-icon size="15" color="red-darken-3"
                                        class="mr-2 flex-shrink-0">mdi-check-circle</v-icon>
                                    <span class="text-caption text-grey-darken-3">{{ plan.caracteristicas[n - 1]
                                        }}</span>
                                </v-row>
                                <!-- Slot vacío — guarda el espacio -->
                                <v-row v-else no-gutters align="center" class="mb-2">
                                    <v-icon size="15" color="grey-lighten-2"
                                        class="mr-2 flex-shrink-0">mdi-minus-circle-outline</v-icon>
                                    <v-sheet color="grey-lighten-3" height="8" rounded="pill" width="80" />
                                </v-row>
                            </template>
                        </div>

                    </v-card-text>

                    <!-- Botón anclado abajo -->
                    <!-- <v-card-actions class="pa-4 pt-2">
                        <v-btn color="red-darken-3" varia       nt="flat" block rounded="lg"
                            class="text-none font-weight-bold">
                            Seleccionar Plan
                        </v-btn>
                    </v-card-actions> -->

                </v-card>
            </v-col>

            <!-- Empty state -->
            <v-col v-if="planesFiltrados.length === 0" cols="12">
                <v-row justify="center" class="pa-12">
                    <v-col cols="auto" class="text-center">
                        <v-icon size="64" color="grey-darken-1" class="mb-4">mdi-tag-off-outline</v-icon>
                        <p class="text-h6 text-medium-emphasis">No hay planes en esta categoría</p>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- ══════════════════════════════════════════════
         Dialog Crear Plan
    ══════════════════════════════════════════════ -->
        <v-dialog v-model="dialog" max-width="960" persistent scrollable>
            <v-card rounded="lg">

                <v-card-title class="d-flex align-center pa-6 pb-4">
                    <span class="text-h6 font-weight-bold">Crear Plan</span>
                    <v-spacer />
                    <v-btn icon variant="text" @click="cerrarDialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-divider />

                <v-card-text class="pa-0">
                    <v-row no-gutters>

                        <!-- ── Formulario ── -->
                        <v-col cols="12" md="7" class="pa-6">

                            <!-- Información Básica -->
                            <v-row no-gutters align="center" class="mb-5">
                                <v-sheet width="4" height="18" color="red-darken-3" rounded="pill" class="mr-3" />
                                <span class="text-subtitle-2 font-weight-bold">Información Básica</span>
                            </v-row>

                            <v-row dense>
                                <v-col cols="12">
                                    <v-text-field v-model="form.nombrePlan" label="Nombre del Plan" variant="outlined"
                                        density="compact" placeholder="Plan Profesional" hide-details="auto"
                                        :rules="[v => !!v || 'El nombre es requerido']" />
                                </v-col>

                                <v-col cols="12">
                                    <v-textarea v-model="form.descripcionPlan" label="Descripción" variant="outlined"
                                        density="compact" placeholder="Descripción detallada del plan..." rows="3"
                                        hide-details />
                                </v-col>
                            </v-row>

                            <!-- Precio y Periodo -->
                            <v-row no-gutters align="center" class="mt-6 mb-5">
                                <v-sheet width="4" height="18" color="red-darken-3" rounded="pill" class="mr-3" />
                                <span class="text-subtitle-2 font-weight-bold">Precio y Periodo</span>
                            </v-row>

                            <v-row dense>
                                <v-col cols="5">
                                    <v-text-field v-model.number="form.costo" label="Precio" variant="outlined"
                                        density="compact" type="number" prefix="$" hide-details />
                                </v-col>

                                <v-col cols="4">
                                    <v-select v-model="form.moneda" label="Moneda" :items="['MXN', 'USD']"
                                        variant="outlined" density="compact" hide-details />
                                </v-col>

                                <v-col cols="3">
                                    <v-text-field v-model.number="form.diasDuracion" label="Días" variant="outlined"
                                        density="compact" type="number" hide-details />
                                </v-col>
                            </v-row>

                            <!-- Límites de Recursos -->
                            <v-row no-gutters align="center" class="mt-6 mb-2">
                                <v-sheet width="4" height="18" color="red-darken-3" rounded="pill" class="mr-3" />
                                <span class="text-subtitle-2 font-weight-bold">Límites de Recursos</span>
                                <v-chip size="x-small" variant="tonal" color="grey" class="ml-3">-1 = ilimitado</v-chip>
                            </v-row>

                            <v-row dense class="mt-3">
                                <v-col cols="6">
                                    <v-text-field v-model.number="form.limiteUsuarios" label="Usuarios"
                                        variant="outlined" density="compact" type="number"
                                        prepend-inner-icon="mdi-account-multiple-outline" hide-details />
                                </v-col>

                                <v-col cols="6">
                                    <v-text-field v-model.number="form.limiteAlmacenamientoMb"
                                        label="Almacenamiento (MB)" variant="outlined" density="compact" type="number"
                                        prepend-inner-icon="mdi-database-outline" hide-details />
                                </v-col>

                                <v-col cols="6">
                                    <v-text-field v-model.number="form.totalTimbres" label="Timbres/mes"
                                        variant="outlined" density="compact" type="number"
                                        prepend-inner-icon="mdi-receipt-text-outline" hide-details />
                                </v-col>
                            </v-row>

                            <!-- Características -->
                            <v-row no-gutters align="center" class="mt-6 mb-5">
                                <v-sheet width="4" height="18" color="red-darken-3" rounded="pill" class="mr-3" />
                                <span class="text-subtitle-2 font-weight-bold">Características</span>
                                <v-chip size="x-small" variant="tonal" color="grey" class="ml-3">
                                    {{ form.caracteristicas.length }}/4
                                </v-chip>
                            </v-row>

                            <v-row dense>
                                <v-col cols="12">
                                    <v-text-field v-model="nuevaCaracteristica" label="Nueva característica"
                                        variant="outlined" density="compact" placeholder="Ej: Reportes dinámicos"
                                        hide-details :disabled="form.caracteristicas.length >= 4"
                                        @keyup.enter="agregarCaracteristica">
                                        <template #append-inner>
                                            <v-btn icon size="x-small" color="red-darken-3" variant="flat"
                                                :disabled="form.caracteristicas.length >= 4"
                                                @click="agregarCaracteristica">
                                                <v-icon size="16">mdi-plus</v-icon>
                                            </v-btn>
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" class="mt-2">
                                    <v-row dense>
                                        <v-col v-for="(c, i) in form.caracteristicas" :key="i" cols="12">
                                            <v-sheet color="red-lighten-5" rounded="lg"
                                                class="d-flex align-center px-3 py-2">
                                                <v-icon size="14" color="red-darken-3"
                                                    class="mr-2 flex-shrink-0">mdi-check-circle-outline</v-icon>
                                                <span class="text-caption text-grey-darken-3 flex-grow-1">{{ c }}</span>
                                                <v-btn icon size="x-small" variant="text" color="red-darken-3"
                                                    density="compact" @click="eliminarCaracteristica(i)">
                                                    <v-icon size="14">mdi-close</v-icon>
                                                </v-btn>
                                            </v-sheet>
                                        </v-col>

                                        <!-- Slots vacíos hasta 4 -->
                                        <v-col v-for="n in (4 - form.caracteristicas.length)" :key="'empty-' + n"
                                            cols="12">
                                            <v-sheet color="grey-lighten-4" rounded="lg"
                                                class="d-flex align-center px-3 py-2" border
                                                style="border-style: dashed !important">
                                                <v-icon size="14" color="grey-lighten-1" class="mr-2">mdi-plus</v-icon>
                                                <span class="text-caption text-disabled">Característica {{
                                                    form.caracteristicas.length + n }}</span>
                                            </v-sheet>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>

                        </v-col>

                        <!-- ── Vista Previa ── -->
                        <v-col cols="12" md="5" class="bg-grey-lighten-4 pa-6">
                            <v-row justify="center" class="mb-5">
                                <v-col cols="auto" class="text-center">
                                    <v-btn variant="flat" color="grey-darken-4" size="small" rounded="xl"
                                        class="font-weight-bold mb-2" readonly>
                                        Vista Previa en Vivo
                                    </v-btn>
                                    <p class="text-caption text-medium-emphasis">Los cambios se reflejan al instante</p>
                                </v-col>
                            </v-row>

                            <v-card rounded="lg" elevation="2" max-width="280" class="mx-auto">
                                <v-sheet color="red-darken-3" height="6" rounded="0" />
                                <v-card-text class="pa-5">

                                    <v-row no-gutters align="center" class="mb-3">
                                        <v-sheet color="red-lighten-5" width="42" height="42" rounded="lg"
                                            class="d-flex align-center justify-center mr-3 flex-shrink-0">
                                            <v-icon color="red-darken-3" size="22">mdi-star-outline</v-icon>
                                        </v-sheet>
                                        <div>
                                            <p class="text-subtitle-2 font-weight-bold text-grey-darken-4 mb-0">
                                                {{ form.nombrePlan || 'Nombre del Plan' }}
                                            </p>
                                            <p class="text-caption text-medium-emphasis mb-0">
                                                {{ form.descripcionPlan || 'Descripción corta' }}
                                            </p>
                                        </div>
                                    </v-row>

                                    <v-row no-gutters align="baseline" class="mb-3">
                                        <span class="text-h6 font-weight-bold text-grey-darken-4">$</span>
                                        <span class="text-h4 font-weight-black text-grey-darken-4 mx-1">
                                            {{ form.costo ?? '0' }}
                                        </span>
                                        <span class="text-caption text-medium-emphasis">{{ form.moneda }}/mes</span>
                                    </v-row>

                                    <v-divider class="mb-3" />

                                    <v-list density="compact" class="pa-0 bg-transparent">
                                        <v-list-item class="px-0" min-height="22">
                                            <template #prepend>
                                                <v-icon size="14" color="grey"
                                                    class="mr-2">mdi-account-multiple-outline</v-icon>
                                            </template>
                                            <v-list-item-title
                                                class="text-caption text-medium-emphasis">Usuarios</v-list-item-title>
                                            <template #append>
                                                <span class="text-caption font-weight-bold">{{ form.limiteUsuarios ?? 1
                                                    }}</span>
                                            </template>
                                        </v-list-item>

                                        <v-list-item class="px-0" min-height="22">
                                            <template #prepend>
                                                <v-icon size="14" color="grey"
                                                    class="mr-2">mdi-database-outline</v-icon>
                                            </template>
                                            <v-list-item-title
                                                class="text-caption text-medium-emphasis">Almacenamiento</v-list-item-title>
                                            <template #append>
                                                <span class="text-caption font-weight-bold">
                                                    {{ formatAlmacenamiento(form.limiteAlmacenamientoMb) }}
                                                </span>
                                            </template>
                                        </v-list-item>

                                        <v-list-item class="px-0" min-height="22">
                                            <template #prepend>
                                                <v-icon size="14" color="grey"
                                                    class="mr-2">mdi-receipt-text-outline</v-icon>
                                            </template>
                                            <v-list-item-title
                                                class="text-caption text-medium-emphasis">Timbres/mes</v-list-item-title>
                                            <template #append>
                                                <span class="text-caption font-weight-bold">{{ form.totalTimbres ?? 50
                                                    }}</span>
                                            </template>
                                        </v-list-item>
                                    </v-list>

                                    <!-- <v-btn color="red-darken-3" variant="flat" block size="small" rounded="lg"
                                        class="mt-4 font-weight-bold">
                                        Seleccionar Plan
                                    </v-btn> -->

                                    <!-- Características preview -->
                                    <div v-if="form.caracteristicas.length" class="mt-3">
                                        <v-divider class="mb-2" />
                                        <v-row v-for="(c, i) in form.caracteristicas" :key="i" no-gutters align="center"
                                            class="mb-1">
                                            <v-icon size="13" color="red-darken-3"
                                                class="mr-2">mdi-check-circle-outline</v-icon>
                                            <span class="text-caption text-grey-darken-3">{{ c }}</span>
                                        </v-row>
                                    </div>

                                </v-card-text>
                            </v-card>
                        </v-col>

                    </v-row>
                </v-card-text>

                <v-divider />

                <!-- Error -->
                <v-alert v-if="store.error" type="error" variant="tonal" class="mx-6 mt-4" closable
                    @click:close="store.clearError()">
                    {{ store.error }}
                </v-alert>

                <v-card-actions class="pa-4 ga-2">
                    <v-spacer />
                    <v-btn variant="text" color="grey" class="text-none" @click="cerrarDialog">
                        Cancelar
                    </v-btn>
                    <v-btn color="red-darken-3" variant="flat" class="font-weight-bold text-none"
                        :loading="store.loading" @click="guardarPlan">
                        Crear Plan
                    </v-btn>
                </v-card-actions>

            </v-card>
        </v-dialog>

    </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDespachosStore } from '@/stores/despachosStore'

const store = useDespachosStore()

const filtros = [
    { key: 'todos', label: 'Todos' },
    { key: 'activo', label: 'Activos' },
    { key: 'inactivo', label: 'Inactivos' }
]
const filtroActivo = ref('todos')

const planesFiltrados = computed(() => {
    if (filtroActivo.value === 'todos') return store.planes
    return store.planes.filter(p => p.status === filtroActivo.value)
})

const contarPorFiltro = (key) => {
    if (key === 'todos') return store.planes.length
    return store.planes.filter(p => p.status === key).length
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatPrecio = (costo) => parseFloat(costo ?? 0).toFixed(2)

const formatAlmacenamiento = (mb) => {
    if (!mb && mb !== 0) return '—'
    if (mb === -1) return 'Ilimitado'
    if (mb >= 1000) return `${(mb / 1000).toFixed(0)} GB`
    return `${mb} MB`
}

const getRecursos = (plan) => [
    { icon: 'mdi-account-multiple-outline', label: 'Usuarios', valor: plan.limite_usuarios === -1 ? 'Ilimitado' : plan.limite_usuarios },
    { icon: 'mdi-database-outline', label: 'Almacenamiento', valor: formatAlmacenamiento(plan.limite_almacenamiento_mb) },
    { icon: 'mdi-receipt-text-outline', label: 'Timbres/mes', valor: plan.total_timbres },
    { icon: 'mdi-calendar-clock-outline', label: 'Duración', valor: `${plan.dias_duracion} días` }
]

const dialog = ref(false)

const formDefault = () => ({
    nombrePlan: '',
    descripcionPlan: '',
    costo: 0,
    moneda: 'MXN',
    diasDuracion: 30,
    limiteUsuarios: 1,
    limiteAlmacenamientoMb: 1000,
    totalTimbres: 50,
    caracteristicas: []
})

const nuevaCaracteristica = ref('')

const agregarCaracteristica = () => {
    const val = nuevaCaracteristica.value.trim()
    if (!val || form.value.caracteristicas.length >= 4) return
    form.value.caracteristicas.push(val)
    nuevaCaracteristica.value = ''
}

const eliminarCaracteristica = (i) => form.value.caracteristicas.splice(i, 1)

const form = ref(formDefault())

const abrirDialog = () => { form.value = formDefault(); dialog.value = true }
const cerrarDialog = () => { dialog.value = false; store.clearError() }

const guardarPlan = async () => {
    const result = await store.createPlan({ ...form.value })
    if (result.success) cerrarDialog()
}

onMounted(() => {
    if (store.planes.length === 0) store.fetchDespachos()
})
</script>