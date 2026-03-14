<template>
    <div class="pos-container">
        <MegaMenu :model="items" class="pos-menu" />
        <div class="pos-content">
        </div>
    </div>
</template>

<script setup>
import MegaMenu from 'primevue/megamenu'
import { ref } from 'vue'

const items = ref([
    {
        label: 'Editar F8',
        icon: 'pi pi-pencil',
        command: () => { console.log('Editar') }
    },
    {
        label: 'Cantidad F5',
        icon: 'pi pi-hashtag',
        command: () => { console.log('Cantidad') }
    },
    {
        label: 'Remover F6',
        icon: 'pi pi-times',
        command: () => { console.log('Remover') }
    },
    {
        label: 'Mantener en Espera',
        icon: 'pi pi-clock',
        command: () => { console.log('En espera') }
    },
])
</script>

<style scoped>
.pos-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* Estilos para el MegaMenu */
.pos-menu {
    margin-bottom: 1rem;
}

/* Forzar estilos del MegaMenu */
:deep(.p-megamenu) {
    background: #ffffff;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    padding: 0.5rem;
}

:deep(.p-menuitem-link) {
    color: #495057 !important;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    transition: all 0.2s;
}

:deep(.p-menuitem-link:hover) {
    background: #f8f9fa !important;
    color: #1e3a5f !important;
}

:deep(.p-menuitem-text) {
    color: #495057 !important;
    font-weight: 500;
}

:deep(.p-menuitem-icon) {
    color: #6c757d !important;
    margin-right: 0.5rem;
}

:deep(.p-menuitem-link:hover .p-menuitem-text),
:deep(.p-menuitem-link:hover .p-menuitem-icon) {
    color: #1e3a5f !important;
}

.pos-content {
    flex: 1;
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>