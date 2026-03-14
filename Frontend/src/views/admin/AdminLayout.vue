<template>
    <div class="main-container">
        <!-- Sidebar Principal -->
        <aside class="main-sidebar">
            <div class="logo">Panel Maestro</div>
            <nav>
                <router-link to="/dashboard">Dashboard</router-link>
                <router-link to="/despachos">Despachos</router-link>
            </nav>
        </aside>

        <!-- Contenido Principal -->
        <main class="main-content">
            <header class="top-bar">
                <span>Admin Master</span>
                <button class="btn-logout">Cerrar Sesión</button>
            </header>

            <div class="content-wrapper">
                <router-view />
            </div>
        </main>
    </div>
</template>

<style scoped>
.main-container {
    display: flex;
    min-height: 100vh;
    background: #0f172a;
    /* Fondo oscuro */
}

.main-sidebar {
    width: 210px;
    background: #1e293b;
    padding: 1rem;
    flex-shrink: 0;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #0f172a;
}

.top-bar {
    background: #1e293b;
    padding: 1rem 2rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
}

.content-wrapper {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
}
</style>