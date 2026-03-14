<template>
    <div class="dashboard-view">
        <div class="dashboard-header">
            <h1>Dashboard</h1>
            <p>Bienvenido al sistema FarmaERP</p>
        </div>


    </div>
</template>

<style scoped>
/* .dashboard-view {
    width: 100%;
    height: 100%;
} */
s .dashboard-header {
    margin-bottom: 2rem;
}

.dashboard-header h1 {
    color: #1e293b;
    margin: 0 0 0.5rem 0;
    font-size: 1.875rem;
}

.dashboard-header p {
    color: #64748b;
    margin: 0;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    width: 100%;
}

.card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #1e3a5f;
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
    margin-bottom: 1rem;
}

.card-title {
    color: #64748b;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stat {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e3a5f;
    margin: 0;
    line-height: 1;
}

@media (max-width: 640px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }

    .dashboard-header h1 {
        font-size: 1.5rem;
    }

    .stat {
        font-size: 2rem;
    }
}
</style>