import { generate, unwrapDirection } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  try {
    const { currentResult, locks = {}, refinementText = '', ...brief } = req.body || {};
    if (!currentResult) throw new Error('currentResult is required.');
    const lockInstruction = `CURRENT RESULT:\n${JSON.stringify(currentResult)}\nLOCKS:\n${JSON.stringify(locks)}\nReturn locked fields byte-identical to CURRENT RESULT and regenerate only unlocked fields. ${refinementText}`;
    const direction = unwrapDirection(await generate(brief, lockInstruction));
    if (locks.imageryLocked) direction.images = currentResult.images;
    console.log('/api/refineMoodboard response:', JSON.stringify(direction));
    return res.status(200).json(direction);
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
}