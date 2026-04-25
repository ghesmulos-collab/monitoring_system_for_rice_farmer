import mysql from 'mysql2/promise';

export const db = mysql.createPool({
    host: 'localhost',
    user: 'root', 
    password: '', // Enter your actual MySQL password here
    database: 'monitoring_system_for_rice_farmer',
}); 