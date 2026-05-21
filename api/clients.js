import mysql from 'mysql2/promise';

const db = () => mysql.createConnection({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const conn = await db();
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const [rows] = await conn.execute('SELECT * FROM clients ORDER BY created_at DESC');
      res.status(200).json(rows);

    } else if (req.method === 'POST') {
      const { patient, numero, ville, note, statut } = req.body;
      const [result] = await conn.execute(
        'INSERT INTO clients (patient, numero, ville, note, statut) VALUES (?, ?, ?, ?, ?)',
        [patient, numero, ville, note, statut]
      );
      res.status(200).json({ id: result.insertId, patient, numero, ville, note, statut });

    } else if (req.method === 'PUT' && id) {
      const { patient, numero, ville, note, statut } = req.body;
      await conn.execute(
        'UPDATE clients SET patient=?, numero=?, ville=?, note=?, statut=? WHERE id=?',
        [patient, numero, ville, note, statut, id]
      );
      res.status(200).json({ success: true });

    } else if (req.method === 'DELETE' && id) {
      await conn.execute('DELETE FROM clients WHERE id=?', [id]);
      res.status(200).json({ success: true });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await conn.end();
  }
}
