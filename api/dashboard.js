import mysql from 'mysql2/promise';

const db = () => mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const conn = await db();

  try {
    const [[{ total_bookings }]] = await conn.execute('SELECT COUNT(*) as total_bookings FROM bookings');
    const [[{ total_clients }]] = await conn.execute('SELECT COUNT(*) as total_clients FROM clients');
    const [[{ total_services }]] = await conn.execute('SELECT COUNT(*) as total_services FROM services');
    const [[{ revenue }]] = await conn.execute("SELECT SUM(price) as revenue FROM bookings WHERE statut='confirme'");

    res.status(200).json({
      total_bookings,
      total_clients,
      total_services,
      revenue: revenue || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await conn.end();
  }
}
