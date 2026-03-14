<template>
    <v-container fluid class="pa-6">
        <!-- Título y descripción -->
        <div class="mb-8">
            <h1 class="text-h3 font-weight-bold mb-2 text-white">Dashboard Admin</h1>
            <p class="text-body-1 text-grey-lighten-1">
                Bienvenido al panel de administración central
            </p>
        </div>

        <!-- Cards de estadísticas -->
        <v-row>
            <!-- Total Despachos -->
            <v-col cols="12" sm="6" md="4" xl="3">
                <v-card class="stat-card" elevation="4" rounded="lg">
                    <v-card-text class="text-center pa-6">
                        <v-avatar color="red-lighten-5" size="64" class="mb-4">
                            <v-icon color="red" size="32">mdi-dumbbell</v-icon>
                        </v-avatar>
                        <div class="text-body-2 text-grey-darken-1 mb-2">Total Maquinarias</div>
                        <div class="text-h3 font-weight-bold">{{ stats.totalDespachos }}</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Total Usuarios -->
            <v-col cols="12" sm="6" md="4" xl="3">
                <v-card class="stat-card" elevation="4" rounded="lg">
                    <v-card-text class="text-center pa-6">
                        <v-avatar color="red-lighten-5" size="64" class="mb-4">
                            <v-icon color="red" size="32">mdi-account-group</v-icon>
                        </v-avatar>
                        <div class="text-body-2 text-grey-darken-1 mb-2">Total Usuarios</div>
                        <div class="text-h3 font-weight-bold">{{ stats.totalUsuarios }}</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Despachos Activos -->
            <v-col cols="12" sm="6" md="4" xl="3">
                <v-card class="stat-card" elevation="4" rounded="lg">
                    <v-card-text class="text-center pa-6">
                        <v-avatar color="red-lighten-5" size="64" class="mb-4">
                            <v-icon color="red" size="32">mdi-check-circle</v-icon>
                        </v-avatar>
                        <div class="text-body-2 text-grey-darken-1 mb-2">Clientes Activos</div>
                        <div class="text-h3 font-weight-bold">{{ stats.despachosActivos }}</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Estadística adicional (ejemplo) -->
            <v-col cols="12" sm="6" md="4" xl="3">
                <v-card class="stat-card" elevation="4" rounded="lg">
                    <v-card-text class="text-center pa-6">
                        <v-avatar color="red-lighten-5" size="64" class="mb-4">
                            <v-icon color="red" size="32">mdi-chart-line</v-icon>
                        </v-avatar>
                        <div class="text-body-2 text-grey-darken-1 mb-2">Actividad Mensual</div>
                        <div class="text-h3 font-weight-bold">{{ stats.actividadMensual }}</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Sección adicional de información -->
        <v-row class="mt-4">
            <v-col cols="12" lg="6">
                <v-card elevation="4" rounded="lg" height="100%">
                    <v-card-title class="bg-grey-darken-2 d-flex align-center">
                        <v-icon class="mr-2" color="red">mdi-clock-outline</v-icon>
                        Actividad Reciente
                    </v-card-title>
                    <v-card-text class="pa-0">
                        <v-list lines="two">
                            <v-list-item v-for="(activity, i) in recentActivity" :key="i" :prepend-icon="activity.icon">
                                <v-list-item-title>{{ activity.title }}</v-list-item-title>
                                <v-list-item-subtitle>{{ activity.subtitle }}</v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" lg="6">
                <v-card elevation="4" rounded="lg" height="100%">
                    <v-card-title class="bg-grey-darken-2 d-flex align-center">
                        <v-icon class="mr-2" color="red">mdi-information-outline</v-icon>
                        Accesos Rápidos
                    </v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item v-for="(action, i) in quickActions" :key="i" :to="action.to"
                                :prepend-icon="action.icon">
                                <v-list-item-title>{{ action.title }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const stats = ref({
    totalDespachos: 2,
    totalUsuarios: 7,
    despachosActivos: 2,
    actividadMensual: 156
})

// Actividad reciente
const recentActivity = ref([
    {
        icon: 'mdi-account-plus',
        title: 'Nuevo usuario registrado',
        subtitle: 'Hace 2 horas'
    },
    {
        icon: 'mdi-office-building',
        title: 'Despacho actualizado',
        subtitle: 'Hace 5 horas'
    },
    {
        icon: 'mdi-file-document',
        title: 'Reporte generado',
        subtitle: 'Hace 1 día'
    }
])

// Acciones rápidas
const quickActions = ref([
    {
        icon: 'mdi-package-variant',
        title: 'Crear nuevo producto',
        to: 'crear-despachos'
    },
    {
        icon: 'mdi-account-multiple-plus',
        title: 'Administrar usuarios',
        to: '/master/usuarios'
    },
    {
        icon: 'mdi-cog',
        title: 'Configuración del sistema',
        to: '/master/configuracion'
    }
])

// Cargar datos al montar el componente
onMounted(async () => {
    // Aquí puedes cargar los datos reales desde tu API/store
    // const data = await masterStore.fetchDashboardStats()
    // stats.value = data
})
</script>

<style scoped>
.stat-card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}
</style>