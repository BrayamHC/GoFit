-- Usuario global de Delta ERP (crea BDs y usuarios tenant)
CREATE USER user_global WITH PASSWORD 'system_global_admin';
CREATE DATABASE go_fit_global OWNER user_global;
GRANT ALL PRIVILEGES ON DATABASE go_fit_global TO user_global;
ALTER USER user_global CREATEDB CREATEROLE INHERIT;

-- Usuario para todos los tenants (contraseña fija)
CREATE USER delta_user_tenant WITH PASSWORD 'delta_password_tenant';
ALTER USER delta_user_tenant CREATEDB;

-- Permitir que delta_user_global asigne delta_user_tenant como owner
GRANT delta_user_tenant TO user_global;
