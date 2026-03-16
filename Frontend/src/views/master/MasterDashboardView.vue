<template>
    <PageContainer>

        <!-- ── Header ── -->
        <div class="mb-5 mb-md-8">
            <h1 class="text-h4 text-sm-h3 font-weight-bold mb-1 text-white">
                Dashboard Admin
            </h1>
            <p class="text-body-2 text-sm-body-1 text-medium-emphasis mb-0">
                Bienvenido al panel de administración central
            </p>
        </div>

        <!-- ── Stat Cards ── -->
        <v-row>
            <v-col cols="12" sm="6" lg="3">
                <v-card class="stat-card" elevation="4" rounded="lg">
                    <v-card-text class="text-center pa-5">
                        <v-avatar color="red-lighten-5" size="56" class="mb-3">
                            <v-icon color="red" size="28">mdi-dumbbell</v-icon>
                        </v-avatar>
                        <div class="text-caption text-grey-darken-1 text-uppercase font-weight-medium mb-1">
                            Total Maquinarias
                        </div>
                        <div class="text-h4 font-weight-bold">{{ stats.totalDespachos }}</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" lg="3">
                <v-card class="stat-card" elevation="4" rounded="lg">
                    <v-card-text class="text-center pa-5">
                        <v-avatar color="red-lighten-5" size="56" class="mb-3">
                            <v-icon color="red" size="28">mdi-account-group</v-icon>
                        </v-avatar>
                        <div class="text-caption text-grey-darken-1 text-uppercase font-weight-medium mb-1">
                            Total Usuarios
                        </div>
                        <div class="text-h4 font-weight-bold">{{ stats.totalUsuarios }}</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" lg="3">
                <v-card class="stat-card" elevation="4" rounded="lg">
                    <v-card-text class="text-center pa-5">
                        <v-avatar color="red-lighten-5" size="56" class="mb-3">
                            <v-icon color="red" size="28">mdi-check-circle</v-icon>
                        </v-avatar>
                        <div class="text-caption text-grey-darken-1 text-uppercase font-weight-medium mb-1">
                            Clientes Activos
                        </div>
                        <div class="text-h4 font-weight-bold">{{ stats.despachosActivos }}</div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" lg="3">
                <v-card class="stat-card" elevation="4" rounded="lg">
                    <v-card-text class="text-center pa-5">
                        <v-avatar color="red-lighten-5" size="56" class="mb-3">
                            <v-icon color="red" size="28">mdi-chart-line</v-icon>
                        </v-avatar>
                        <div class="text-caption text-grey-darken-1 text-uppercase font-weight-medium mb-1">
                            Actividad Mensual
                        </div>
                        <div class="text-h4 font-weight-bold">{{ stats.actividadMensual }}</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- ── Sección secundaria ── -->
        <v-row class="mt-2 mt-md-4">
            <v-col cols="12" lg="6">
                <v-card elevation="4" rounded="lg">
                    <v-card-title class="bg-grey-darken-2 d-flex align-center py-3 px-4">
                        <v-icon class="mr-2" color="red" size="20">mdi-clock-outline</v-icon>
                        <span class="text-body-1 font-weight-bold">Actividad Reciente</span>
                    </v-card-title>
                    <v-card-text class="pa-0">
                        <v-list lines="two" bg-color="transparent">
                            <v-list-item
                                v-for="(activity, i) in recentActivity"
                                :key="i"
                                :prepend-icon="activity.icon"
                            >
                                <v-list-item-title>{{ activity.title }}</v-list-item-title>
                                <v-list-item-subtitle>{{ activity.subtitle }}</v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" lg="6">
                <v-card elevation="4" rounded="lg">
                    <v-card-title class="bg-grey-darken-2 d-flex align-center py-3 px-4">
                        <v-icon class="mr-2" color="red" size="20">mdi-lightning-bolt</v-icon>
                        <span class="text-body-1 font-weight-bold">Accesos Rápidos</span>
                    </v-card-title>
                    <v-card-text class="pa-0">
                        <v-list bg-color="transparent">
                            <v-list-item
                                v-for="(action, i) in quickActions"
                                :key="i"
                                :to="action.to"
                                :prepend-icon="action.icon"
                                rounded="lg"
                                color="red"
                                class="my-1 mx-2"
                            >
                                <v-list-item-title>{{ action.title }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

    </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageContainer from '@/components/pageContainer.vue'

const stats = ref({
    totalDespachos: 2,
    totalUsuarios: 7,
    despachosActivos: 2,
    actividadMensual: 156
})

const recentActivity = ref([
    { icon: 'mdi-account-plus',  title: 'Nuevo usuario registrado', subtitle: 'Hace 2 horas' },
    { icon: 'mdi-dumbbell',      title: 'Maquinaria actualizada',   subtitle: 'Hace 5 horas' },
    { icon: 'mdi-file-document', title: 'Reporte generado',         subtitle: 'Hace 1 día'   },
])

const quickActions = ref([
    { icon: 'mdi-package-variant',   title: 'Gestionar inventario', to: '/core/despachos'     },
    { icon: 'mdi-account-group',     title: 'Administrar clientes', to: '/core/clientes'      },
    { icon: 'mdi-clipboard-outline', title: 'Ver membresías',       to: '/core/membresias'        },
    { icon: 'mdi-account-check',     title: 'Ver suscripciones',    to: '/core/suscripciones' },
])

onMounted(async () => {
    // TODO: conectar a la API
    // stats.value = await masterStore.fetchDashboardStats()
})
</script>

<style scoped>
.stat-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2) !important;
}
</style>
