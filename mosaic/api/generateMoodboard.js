import { generate } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  try {
    return res.status(200).json(await generate(req.body || {}));
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
}