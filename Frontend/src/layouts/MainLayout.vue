<template>
    <div class="layout-wrapper">
        <!-- TOPBAR -->
        <div class="layout-topbar">
            <div class="topbar-left">
                <button class="menu-toggle" @click="toggleSidebar">
                    <i class="pi pi-bars"></i>
                </button>
                <h2>GO FIT</h2>
            </div>
            <div class="topbar-right">
                <span class="user-name">{{ user?.name || 'Usuario' }}</span>
                <button @click="handleLogout" class="logout-btn">
                    <i class="pi pi-sign-out"></i>
                    <span class="logout-text">Cerrar Sesión</span>
                </button>
            </div>
        </div>

        <!-- SIDEBAR -->
        <div class="layout-sidebar" :class="{ 'sidebar-collapsed': !sidebarOpen, 'sidebar-expanded': sidebarOpen }">
            <nav class="sidebar-content">
                <ul class="menu-list">
                    <!-- Dashboard -->
                    <li>
                        <router-link to="/dashboard" class="menu-item" @click="handleMenuClick">
                            <i class="pi pi-home"></i>
                            <span class="menu-text">Dashboard</span>
                        </router-link>
                    </li>

                    <!-- Punto de Venta -->
                    <li>
                        <a @click="toggleMenu('pos')" class="menu-item" :class="{ active: activeMenu === 'pos' }">
                            <i class="pi pi-shopping-cart"></i>
                            <span class="menu-text">Punto de Venta</span>
                            <i class="pi pi-chevron-down arrow" :class="{ rotated: activeMenu === 'pos' }"
                                v-if="sidebarOpen"></i>
                        </a>
                        <ul class="submenu" :class="{ open: activeMenu === 'pos' && sidebarOpen }">
                            <li>
                                <router-link to="/pos" @click="handleMenuClick">
                                    <i class="pi pi-circle-fill"></i>
                                    <span class="menu-text">Realizar Venta</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/pos/cash-register" @click="handleMenuClick">
                                    <i class="pi pi-circle-fill"></i>
                                    <span class="menu-text">Caja Registradora</span>
                                </router-link>
                            </li>
                        </ul>
                    </li>

                    <!-- Inventario -->
                    <li>
                        <a @click="toggleMenu('inventory')" class="menu-item"
                            :class="{ active: activeMenu === 'inventory' }">
                            <i class="pi pi-box"></i>
                            <span class="menu-text">Inventario</span>
                            <i class="pi pi-chevron-down arrow" :class="{ rotated: activeMenu === 'inventory' }"
                                v-if="sidebarOpen"></i>
                        </a>
                        <ul class="submenu" :class="{ open: activeMenu === 'inventory' && sidebarOpen }">
                            <li>
                                <router-link to="/inventory/products" @click="handleMenuClick">
                                    <i class="pi pi-circle-fill"></i>
                                    <span class="menu-text">Productos</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/inventory/batches" @click="handleMenuClick">
                                    <i class="pi pi-circle-fill"></i>
                                    <span class="menu-text">Lotes</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/inventory/stock-movements" @click="handleMenuClick">
                                    <i class="pi pi-circle-fill"></i>
                                    <span class="menu-text">Movimientos</span>
                                </router-link>
                            </li>
                        </ul>
                    </li>

                    <!-- Ventas -->
                    <li>
                        <router-link to="/sales" class="menu-item" @click="handleMenuClick">
                            <i class="pi pi-chart-line"></i>
                            <span class="menu-text">Ventas</span>
                        </router-link>
                    </li>

                    <!-- Reportes -->
                    <li>
                        <router-link to="/reports" class="menu-item" @click="handleMenuClick">
                            <i class="pi pi-file-pdf"></i>
                            <span class="menu-text">Reportes</span>
                        </router-link>
                    </li>

                    <!-- Administración -->
                    <li>
                        <a @click="toggleMenu('admin')" class="menu-item" :class="{ active: activeMenu === 'admin' }">
                            <i class="pi pi-cog"></i>
                            <span class="menu-text">Administración</span>
                            <i class="pi pi-chevron-down arrow" :class="{ rotated: activeMenu === 'admin' }"
                                v-if="sidebarOpen"></i>
                        </a>
                        <ul class="submenu" :class="{ open: activeMenu === 'admin' && sidebarOpen }">
                            <li>
                                <router-link to="/admin/users" @click="handleMenuClick">
                                    <i class="pi pi-circle-fill"></i>
                                    <span class="menu-text">Usuarios</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/admin/branches" @click="handleMenuClick">
                                    <i class="pi pi-circle-fill"></i>
                                    <span class="menu-text">Sucursales</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/admin/settings" @click="handleMenuClick">
                                    <i class="pi pi-circle-fill"></i>
                                    <span class="menu-text">Configuración</span>
                                </router-link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>

        <div class="layout-main" :class="{ 'main-collapsed': !sidebarOpen, 'main-expanded': sidebarOpen }">
            <router-view />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const sidebarOpen = ref(window.innerWidth >= 1024)
const activeMenu = ref(null)

// Detectar la sección activa basada en la ruta
const detectActiveMenu = () => {
    const path = route.path
    if (path.startsWith('/pos')) {
        activeMenu.value = 'pos'
    } else if (path.startsWith('/inventory')) {
        activeMenu.value = 'inventory'
    } else if (path.startsWith('/admin')) {
        activeMenu.value = 'admin'
    } else {
        activeMenu.value = null
    }
}

// Toggle sidebar
const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
}

// Toggle menú desplegable
const toggleMenu = (menu) => {
    if (activeMenu.value === menu) {
        activeMenu.value = null
    } else {
        activeMenu.value = menu
    }

    // Si el sidebar está colapsado, lo abrimos al hacer click en un menú
    if (!sidebarOpen.value) {
        sidebarOpen.value = true
    }
}

// Manejar click en items del menú (solo en móvil cierra el sidebar)
const handleMenuClick = () => {
    if (window.innerWidth < 1024) {
        sidebarOpen.value = false
    }
}

// Logout
const handleLogout = async () => {
    await authStore.logout()
    router.push('/login')
}

watch(() => route.path, () => {
    detectActiveMenu()
})

onMounted(() => {
    detectActiveMenu()
})
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.layout-wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    width: 100vw;
}

.layout-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem;
    background: #1e3a5f;
    color: white;
    height: 60px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.topbar-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.topbar-left h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
}

.menu-toggle {
    background: transparent;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background 0.2s;
}

.menu-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
}

.topbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.user-name {
    font-size: 0.9rem;
}

.logout-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
}

.logout-btn:hover {
    background: #991b1b;
}

.layout-sidebar {
    position: fixed;
    left: 0;
    top: 60px;
    height: calc(100vh - 60px);
    background: #f8f9fa;
    border-right: 1px solid #dee2e6;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 999;
    transition: width 0.3s ease;
}

.layout-sidebar.sidebar-expanded {
    width: 260px;
}

.layout-sidebar.sidebar-collapsed {
    width: 70px;
}

.sidebar-content {
    padding: 1rem 0;
}

.menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.menu-list>li {
    margin: 0;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    color: #495057;
    text-decoration: none;
    transition: all 0.2s;
    cursor: pointer;
    position: relative;
    white-space: nowrap;
}

.sidebar-collapsed .menu-item {
    justify-content: center;
    padding: 0.875rem 0;
}

.sidebar-collapsed .menu-text {
    display: none;
}

.sidebar-collapsed .arrow {
    display: none;
}

.menu-item:hover {
    background: #e9ecef;
}

.menu-item.router-link-active,
.menu-list>li>a.router-link-active {
    background: #1e3a5f;
    color: white;
    border-left: 4px solid #dc2626;
}

.menu-item.active {
    background: #e9ecef;
}

.menu-item i.pi {
    font-size: 1.1rem;
    min-width: 1.1rem;
}

.arrow {
    margin-left: auto;
    font-size: 0.75rem;
    transition: transform 0.3s ease;
}

.arrow.rotated {
    transform: rotate(180deg);
}

/* Submenú */
.submenu {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    background: #e9ecef;
}

.submenu.open {
    max-height: 500px;
}

.submenu li a {
    padding: 0.75rem 1.5rem 0.75rem 3rem;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #495057;
    text-decoration: none;
    transition: all 0.2s;
}

.submenu li a i.pi-circle-fill {
    font-size: 0.4rem;
}

.submenu li a:hover {
    background: #dee2e6;
}

.submenu li a.router-link-active {
    background: #1e3a5f;
    color: white;
    border-left: 4px solid #dc2626;
}

.layout-main {
    position: fixed;
    top: 60px;
    right: 0;
    bottom: 0;
    padding: 2rem;
    background: #f5f5f5;
    overflow-y: auto;
    transition: left 0.3s ease, width 0.3s ease;
}

.layout-main.main-expanded {
    left: 260px;
    width: calc(100% - 260px);
}

.layout-main.main-collapsed {
    left: 70px;
    width: calc(100% - 70px);
}

@media (max-width: 1023px) {
    .layout-sidebar {
        transform: translateX(-100%);
        width: 260px !important;
    }

    .layout-sidebar.sidebar-expanded {
        transform: translateX(0);
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    }

    .layout-main {
        margin-left: 0 !important;
        width: 100% !important;
        left: 0 !important;
        right: 0 !important;
    }

    .user-name {
        display: none;
    }

    .logout-text {
        display: none;
    }

    .logout-btn {
        padding: 0.5rem;
    }
}

@media (max-width: 640px) {
    .layout-topbar {
        padding: 0 1rem;
    }

    .topbar-left h2 {
        font-size: 1rem;
    }

    .layout-main {
        padding: 1rem;
    }
}

/* Scrollbar personalizado */
.layout-sidebar::-webkit-scrollbar {
    width: 6px;
}

.layout-sidebar::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.layout-sidebar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

.layout-sidebar::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>