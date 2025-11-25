import dotenv from "dotenv"
dotenv.config()

interface EnvConfig {
    NODE_ENV: 'development' | 'production' | 'staging';
    PORT: number;
    DATABASE_URL: string;
    DATABASE_HOST: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    DATABASE_PORT: number;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    ENCRYPTION_KEY: string;
    FRONTEND_URL: string;
    LOG_LEVEL: string;
    ELASTICSEARCH_URL: string;
    LOGSTASH_HOST: string;
    LOGSTASH_PORT: number;
}


function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

function getEnvNumber(key: string, defaultValue?: number): number {
    const value = process.env[key];
    if (!value && defaultValue === undefined) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value ? parseInt(value, 10) : defaultValue!;
}

function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = process.env[key];
    if (!value) {
        return defaultValue;
    }
    return value.toLowerCase() === 'true';
}

export const env: EnvConfig = {
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    PORT: getEnvNumber('PORT', 3000),
    DATABASE_URL: getEnvVar('DATABASE_URL'),
    DATABASE_HOST: getEnvVar('DATABASE_HOST', 'localhost'),
    DATABASE_USER: getEnvVar('DATABASE_USER', 'root'),
    DATABASE_PASSWORD: getEnvVar('DATABASE_PASSWORD', ''),
    DATABASE_NAME: getEnvVar('DATABASE_NAME', 'senz_db'),
    DATABASE_PORT: getEnvNumber('DATABASE_PORT', 3306),
    GOOGLE_CLIENT_ID: getEnvVar('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: getEnvVar('GOOGLE_CLIENT_SECRET'),
    GOOGLE_CALLBACK_URL: getEnvVar('GOOGLE_CALLBACK_URL'),
    JWT_SECRET: getEnvVar('JWT_SECRET'),
    JWT_REFRESH_SECRET: getEnvVar('JWT_REFRESH_SECRET'),
    ENCRYPTION_KEY: getEnvVar('ENCRYPTION_KEY'),
    FRONTEND_URL: getEnvVar('FRONTEND_URL', 'http://localhost:5173'),
    LOG_LEVEL: getEnvVar('LOG_LEVEL', 'info'),
    ELASTICSEARCH_URL: getEnvVar('ELASTICSEARCH_URL', 'http://elasticsearch:9200'),
    LOGSTASH_HOST: getEnvVar('LOGSTASH_HOST', 'logstash'),
    LOGSTASH_PORT: getEnvNumber('LOGSTASH_PORT', 5044),
};