// src/config/database.config.ts
export interface DatabaseCredentials {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

export interface RedisCredentials {
    host: string;
    port: number;
    password: string;
    sessionTTL: number;
}

export interface DatabaseConfig {
    global: DatabaseCredentials;
    tenant: Omit<DatabaseCredentials, 'database'>;
    redis: RedisCredentials;
}

export const databaseConfig = (): DatabaseConfig => ({
    global: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
        user: process.env.DB_USER || 'delta_user_global',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'delta_erp_global',
    },
    tenant: {
        host: process.env.TENANT_DB_HOST || 'localhost',
        port: process.env.TENANT_DB_PORT ? Number(process.env.TENANT_DB_PORT) : 5432,
        user: process.env.TENANT_DB_USER || 'delta_user_tenant',
        password: process.env.TENANT_DB_PASSWORD || '',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
        password: process.env.REDIS_PASSWORD || '',
        sessionTTL: process.env.SESSION_TTL ? Number(process.env.SESSION_TTL) : 86400,
    },
});

// Helper para obtener config completa de tenant con database dinámica
export const getTenantConfig = (database: string): DatabaseCredentials => {
    const config = databaseConfig();
    return {
        ...config.tenant,
        database,
    };
};

//  Helper para Redis
export const getRedisConfig = (): RedisCredentials => {
    const config = databaseConfig();
    return config.redis;
};
