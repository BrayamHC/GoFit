<template>
    <div class="inventory-layout">

        <h3>Inventario</h3>



    </div>
</template>

<style scoped>
.inventory-layout {
    display: flex;
    gap: 2rem;
}

.inventory-submenu {
    width: 200px;
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    height: fit-content;
}

.inventory-submenu h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #1e293b;
}

.inventory-submenu nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.inventory-submenu a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    color: #64748b;
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.2s;
}

.inventory-submenu a:hover {
    background: #f1f5f9;
    color: #1e293b;
}

.inventory-submenu a.router-link-active {
    background: #4f46e5;
    color: white;
}

.inventory-content {
    flex: 1;
}
</style>