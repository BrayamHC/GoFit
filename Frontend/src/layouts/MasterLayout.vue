<template>
    <v-app>
        <!-- App Bar Superior -->
        <v-app-bar color="grey-darken-4" elevation="0" density="comfortable">
            <v-app-bar-nav-icon 
                @click="drawer = !drawer" 
                class="d-lg-none"
            />

            <v-toolbar-title class="d-flex align-center">
                <v-icon color="red" class="mr-2">mdi-weight-lifter</v-icon>
                <span class="font-weight-bold">Go Fit</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <div class="d-flex align-center ga-2">
                <v-avatar color="red" size="36">
                    <span class="text-white font-weight-bold">
                        {{ userInitial }}
                    </span>
                </v-avatar>
            </div>
        </v-app-bar>

        <!-- Navigation Drawer -->
        <v-navigation-drawer
            v-model="drawer"
            :rail="rail"
            :permanent="!mobile"
            color="grey-darken-4"
            theme="dark"
        >
            <!-- Toggle Desktop -->
            <template #prepend>
                <div class="d-flex justify-end pa-2" v-if="!mobile">
                    <v-btn
                        variant="text"
                        :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
                        @click.stop="rail = !rail"
                        size="small"
                    />
                </div>
                <v-divider v-if="!mobile" />
            </template>

            <!-- MENU ITEMS -->
            <v-list density="compact" nav class="flex-grow-1">
                <v-tooltip
                    v-for="item in menuItems"
                    :key="item.to"
                    :text="item.title"
                    location="end"
                    :disabled="!rail"
                >
                    <template #activator="{ props }">
                        <v-list-item
                            :to="item.to"
                            :prepend-icon="item.icon"
                            :title="!rail ? item.title : ''"
                            :value="item.value"
                            color="red"
                            rounded="xl"
                            class="my-1"
                            v-bind="props"
                        />
                    </template>
                </v-tooltip>
            </v-list>

            <!-- CONFIG + LOGOUT -->
            <!-- CONFIG + LOGOUT -->
<div class="pa-2 mt-auto">
    <v-divider class="mb-2" />

    <!-- Configuración -->
    <v-tooltip
        text="Configuración"
        location="end"
        :disabled="!rail"
    >
        <template #activator="{ props }">
            <v-list-item
                class="my-1"
                rounded="xl"
                v-bind="props"
            >
                <template #prepend>
                    <v-icon color="white">mdi-cog</v-icon>
                </template>

                <v-list-item-title v-if="!rail">
                    Configuración
                </v-list-item-title>
            </v-list-item>
        </template>
    </v-tooltip>

    <!-- Cerrar Sesión -->
    <v-tooltip
        text="Cerrar sesión"
        location="end"
        :disabled="!rail"
    >
        <template #activator="{ props }">
            <v-list-item
                class="my-1"
                rounded="xl"
                @click="handleLogout"
                v-bind="props"
            >
                <template #prepend>
                    <v-icon color="orange">mdi-logout</v-icon>
                </template>

                <v-list-item-title v-if="!rail">
                    Cerrar sesión
                </v-list-item-title>
            </v-list-item>
        </template>
    </v-tooltip>

</div>

        </v-navigation-drawer>

        <!-- Main -->
        <v-main class="bg-grey-darken-3">
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useMasterAuthStore } from '@/stores/masterAuthStore'

const router = useRouter()
const masterAuthStore = useMasterAuthStore()
const { mobile } = useDisplay()

const drawer = ref(true)
const rail = ref(false)

const userName = computed(() => masterAuthStore.user?.name || 'Admin Master')

const userInitial = computed(() => {
    return userName.value.charAt(0).toUpperCase()
})

const menuItems = ref([
    { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/core/dashboard', value: 'dashboard' },
    { title: 'Inventario', icon: 'mdi-package-variant', to: '/core/despachos', value: 'inventario' },
    { title: 'Clientes', icon: 'mdi-account-plus', to: '/core/usuarios', value: 'clientes' },
    { title: 'Membresías', icon: 'mdi-clipboard-outline', to: '/core/planes', value: 'planes' },
    { title: 'Suscripciones', icon: 'mdi-account-check', to: '/core/suscripciones', value: 'suscripciones' },
    { title: 'Usuarios', icon: 'mdi-account-plus', to: '/core/usuarios', value: 'usuarios' },
])

const handleLogout = async () => {
    await masterAuthStore.logout()
    router.push('/core/login')
}
</script>

<style scoped>
:deep(.v-navigation-drawer__content) {
    display: flex;
    flex-direction: column;
    height: 100%;
}
</style>