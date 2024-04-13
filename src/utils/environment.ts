import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing');
}

if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error('SMTP configuration is missing');
}

export const HOST = process.env.HOST || 'http://localhost';
export const PORT = process.env.PORT || 3000;
export const PUBLIC_DIR = process.env.PUBLIC_DIR || 'public';
export const IMAGE_HOST = process.env.IMAGE_HOST || 'http://localhost:3000/';
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clickviral';
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_ACCESS_LIFETIME = process.env.JWT_ACCESS_LIFETIME || '1d';
export const JWT_REFRESH_LIFETIME = process.env.JWT_REFRESH_LIFETIME || '7d';
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
export const ADMIN_ACCESS_CODES = process.env.ADMIN_ACCESS_CODES || 'admin';
export const PASSWORD_SALT_ROUNDS = process.env.SALT_ROUNDS || 10;