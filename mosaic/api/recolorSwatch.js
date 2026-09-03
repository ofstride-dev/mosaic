import { callAzureJson, isHex, paletteRoles } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  try {
    const { currentResult, role } = req.body || {};
    if (!currentResult || !paletteRoles.includes(role)) throw new Error('currentResult and a valid palette role are required.');
    const prompt = `Current moodboard:\n${JSON.stringify(currentResult)}\nCRITICAL COLOR ACCESSIBILITY INSTRUCTION: Maintain WCAG AA accessibility standards with a minimum 4.5:1 contrast ratio for all UI elements. Follow the rule of opposites: dark Background or Surface requires extremely light Text, Input Borders, and Icons; light Background requires near-black Text and Controls. Never use medium-grey UI text on dark backgrounds. If replacing Accent, it must contrast strongly against Background and badge/button text must contrast strongly against Accent. Return ONLY {"hex":"#RRGGBB"}. Choose a harmonious replacement for the ${role} palette color; keep the other three unchanged and preserve their accessibility relationships.`;
    const value = await callAzureJson(prompt, (candidate) => isHex(candidate?.hex));
    const responseBody = { hex: value.hex.toUpperCase() };
    console.log('/api/recolorSwatch response:', JSON.stringify(responseBody));
    return res.status(200).json(responseBody);
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
}