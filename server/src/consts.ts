
const ipAddress = process.env.IP_ADDR || 'localhost';
export const dbHost = process.env.DB_HOST || 'localhost';
export const dbPort = Number(process.env.DB_PORT ?? 3306);
export const  dbUsername = process.env.DB_USERNAME || 'admin';
export const dbUserPassword = process.env.DB_PASSWORD || 'admin';
export const database = process.env.DATABASE || "abz-agency";
export const api_url = process.env.NODE_ENV !== 'production' ? 'http://localhost:4000' : `https://${ipAddress}`;
