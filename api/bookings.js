import mysql from 'mysql2/promise';

const db = () => mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
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
      const [rows] = await conn.execute('SELECT * FROM bookings ORDER BY date ASC');
      res.status(200).json(rows);

    } else if (req.method === 'POST') {
      const { patient, service, date, price, statut } = req.body;
      const [result] = await conn.execute(
        'INSERT INTO bookings (patient, service, date, price, statut) VALUES (?, ?, ?, ?, ?)',
        [patient, service, date, price, statut]
      );
      res.status(200).json({ id: result.insertId, patient, service, date, price, statut });

    } else if (req.method === 'PUT' && id) {
      const { patient, service, date, price, statut } = req.body;
      await conn.execute(
        'UPDATE bookings SET patient=?, service=?, date=?, price=?, statut=? WHERE id=?',
        [patient, service, date, price, statut, id]
      );
      res.status(200).json({ success: true });

    } else if (req.method === 'DELETE' && id) {
      await conn.execute('DELETE FROM bookings WHERE id=?', [id]);
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
