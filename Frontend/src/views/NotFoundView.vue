<template>
    <div class="error-view">
        <h1>404 - Página No Encontrada</h1>
        <p>La página que buscas no existe</p>
        <router-link to="/dashboard">Volver al Dashboard</router-link>
    </div>
</template>

<style scoped>
.error-view {
    text-align: center;
    padding: 3rem;
}
</style>