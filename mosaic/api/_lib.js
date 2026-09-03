const paletteRoles = ['Background', 'Surface', 'Accent', 'Text'];
const colorAccessibilityInstruction = 'CRITICAL COLOR ACCESSIBILITY INSTRUCTION: Strictly follow WCAG AA accessibility standards with a minimum 4.5:1 contrast ratio for all UI elements. Rule of opposites: if Background or Surface is dark, Text, Input Borders, and Icons MUST be extremely light or near-white; if Background is light, Text and Controls MUST be near-black. Never use medium-grey UI text on dark backgrounds. Accent colors used for buttons or badges must contrast strongly against Background, and text inside badges/buttons must contrast strongly against Accent.';

function stripFences(value) {
  return String(value).replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
}

function isHex(value) {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value.trim());
}

function isEasingCurve(value) {
  return typeof value === 'string' && /^cubic-bezier\(\s*-?\d*\.?\d+\s*,\s*-?\d*\.?\d+\s*,\s*-?\d*\.?\d+\s*,\s*-?\d*\.?\d+\s*\)$/.test(value.trim());
}

function directionPrompt({ description = '', feelings = [], filenames = [], refinementText = '' }) {
  return `You are Mosaik, an AI visual-direction engine for moodboards. Read the project context below and produce ONE cohesive visual direction as strict JSON. Be specific to this exact brief; avoid generic default answers.

PROJECT DESCRIPTION:
"""${description}"""

DESIRED FEELING TAGS: ${feelings.length ? feelings.join(', ') : 'unspecified'}
ATTACHED SOURCE FILES (names only, for context): ${filenames.length ? filenames.join(', ') : 'none'}
${refinementText ? `REFINEMENT REQUEST: ${refinementText}` : ''}

CRITICAL INSTRUCTION FOR COLOR GENERATION:
You must strictly adhere to WCAG AA accessibility standards (minimum 4.5:1 contrast ratio) for all UI elements.

Rule of Opposites: If you generate a dark Background or Surface color, your Text, Input Borders, and Icons MUST be extremely light (e.g., near-white). If the Background is light, Text and Controls MUST be near-black.

No Mid-tones for UI Text: Never use medium-greys for text on dark backgrounds.

Accent Colors: Accent colors (used for buttons or badges) must have high contrast against the Background, AND the text inside those badges must contrast heavily against the Accent color (e.g., if Accent is bright red, badge text should be stark white).

Format Output: When returning the palette, briefly explain how the Surface, Text, and Accent colors maintain high visibility against the Background. Keep this explanation in the paletteContrastExplanation field.

IMAGERY SPLIT: Return imagery.pexelsQueries with 2 to 4 queries focused on real-world subjects, human elements, objects, or environments matching this brief (stock photography). Return imagery.pollinationsPrompts with 1 to 2 detailed prompts strictly describing tactile surfaces, raw materials, patterns, gradients, or ambient backgrounds. Do not put human faces or complex scenes in pollinationsPrompts. Use distinct, brief-specific imagery rather than generic defaults.

Return ONLY a JSON object with this exact shape, no markdown fences or commentary. All string fields must be plain single-line text with no embedded line breaks or literal \n sequences. Palette must contain exactly four entries in this order and use these exact role values: Background, Surface, Accent, Text. Choose hex values that satisfy the stated contrast requirements; calculate or carefully approximate relative luminance and contrast before returning them.
{
  "projectName": "short 1-2 word project or brand name inferred from the brief",
  "title": "a 2-4 word evocative name for this visual direction",
  "rationale": "one sentence, under 30 words, explaining the direction and what it avoids",
  "imageryLabel": "one short sentence describing lighting, materials and textures",
  "imagery": {"pexelsQueries":["2-4 short, distinct queries for real-world subjects, people, objects, or environments"],"pollinationsPrompts":["1-2 detailed prompts for abstract tactile textures, materials, patterns, gradients, or ambient surfaces only"]},
  "imageryQueries": ["legacy compatibility alias for imagery.pexelsQueries"],
  "palette": [{"role":"Background","hex":"#RRGGBB"},{"role":"Surface","hex":"#RRGGBB"},{"role":"Accent","hex":"#RRGGBB"},{"role":"Text","hex":"#RRGGBB"}],
  "paletteContrastExplanation": "briefly explain how Surface, Text, and Accent maintain high visibility against Background",
  "principles": [{"title":"1-3 word principle name","copy":"under 16 words explaining it"}],
  "headingFont": "specific real Google Fonts family name selected for this brief's vibe; do not default to Bebas Neue",
  "bodyFont": "specific real Google Fonts family name selected for this brief's vibe; do not default to Inter unless the brief clearly requires it",
  "headingFontWeight": 400,
  "bodyFontWeight": 400,
  "headingLetterSpacing": "0em",
  "bodyLetterSpacing": "0em",
  "cssEasingCurve": "valid cubic-bezier string; calm uses smooth/slow curves, energetic uses snappy/bouncy curves",
  "headingSpecimen": "short evocative phrase, under 6 words",
  "bodySpecimen": "one sentence, under 18 words",
  "uiLanguage": {"layout":"short phrase","componentStyle":"short phrase","shapeLanguage":"short phrase","spacing":"short phrase"},
  "productPreview": {"appName":"brief-specific product name","navItems":["short label","short label","short label"],"screenTitle":"brief-specific screen title","primaryMetric":{"label":"specific metric","value":"specific value"},"secondaryMetrics":[{"label":"specific metric","value":"specific value"}],"listItems":[{"title":"specific item","subtitle":"short supporting detail"}],"primaryCta":"brief-specific action"}
}`;
}

function azureConfig() {
  const { AZURE_OPENAI_ENDPOINT: endpoint, AZURE_OPENAI_API_KEY: key, AZURE_OPENAI_DEPLOYMENT: deployment = 'gpt-5-mini', AZURE_OPENAI_API_VERSION: version = '2024-10-21' } = process.env;
  if (!endpoint || !key) throw new Error('Azure OpenAI is not configured. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY.');
  return { endpoint: endpoint.replace(/\/$/, ''), key, deployment, version };
}

function normalizeStrings(value) {
  if (typeof value === 'string') return value.replace(/\\n/g, ' ').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (Array.isArray(value)) return value.map(normalizeStrings);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeStrings(item)]));
  return value;
}

function normalizeImagery(value) {
  const imagery = value?.imagery && typeof value.imagery === 'object' ? value.imagery : {};
  const legacyQueries = Array.isArray(value?.imageryQueries) ? value.imageryQueries : [];
  if (typeof value?.pexelsSearchQuery === 'string' && value.pexelsSearchQuery.trim()) legacyQueries.push(value.pexelsSearchQuery);
  const pexelsQueries = (Array.isArray(imagery.pexelsQueries) ? imagery.pexelsQueries : legacyQueries)
    .filter((item) => typeof item === 'string' && item.trim()).slice(0, 4);
  const legacyTexture = typeof value?.pollinationsImagePrompt === 'string' ? value.pollinationsImagePrompt : '';
  const pollinationsPrompts = (Array.isArray(imagery.pollinationsPrompts) ? imagery.pollinationsPrompts : [legacyTexture])
    .filter((item) => typeof item === 'string' && item.trim()).slice(0, 2);
  value.imagery = {
    pexelsQueries: pexelsQueries.length >= 2 ? pexelsQueries : ['editorial lifestyle portrait', 'textured design workspace'],
    pollinationsPrompts: pollinationsPrompts.length ? pollinationsPrompts : ['abstract tactile material surface, subtle atmospheric gradient, minimal background texture'],
  };
  value.imageryQueries = value.imagery.pexelsQueries;
  value.uiLanguage = value.uiLanguage && typeof value.uiLanguage === 'object' ? value.uiLanguage : {};
  for (const key of ['layout', 'componentStyle', 'shapeLanguage', 'spacing']) {
    if (typeof value.uiLanguage[key] !== 'string') value.uiLanguage[key] = 'Cohesive, brief-specific interface language';
  }
  const preview = value.productPreview && typeof value.productPreview === 'object' ? value.productPreview : {};
  value.productPreview = {
    appName: typeof preview.appName === 'string' ? preview.appName : value.projectName || 'Project',
    navItems: Array.isArray(preview.navItems) && preview.navItems.length ? preview.navItems : ['Overview', 'Activity', 'Settings'],
    screenTitle: typeof preview.screenTitle === 'string' ? preview.screenTitle : value.title || 'Overview',
    primaryMetric: preview.primaryMetric && typeof preview.primaryMetric === 'object' ? preview.primaryMetric : { label: 'Progress', value: 'In motion' },
    secondaryMetrics: Array.isArray(preview.secondaryMetrics) && preview.secondaryMetrics.length ? preview.secondaryMetrics : [{ label: 'Status', value: 'Active' }],
    listItems: Array.isArray(preview.listItems) && preview.listItems.length ? preview.listItems : [{ title: 'Next step', subtitle: 'Continue shaping the direction' }],
    primaryCta: typeof preview.primaryCta === 'string' ? preview.primaryCta : 'Open project',
  };
  return value;
}

function imageContent(images = []) {
  return images.filter((image) => image?.dataUrl && /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(image.dataUrl)).slice(0, 4).map((image) => ({ type: 'image_url', image_url: { url: image.dataUrl, detail: 'low' } }));
}

function unwrapDirection(value) {
  const candidate = value?.result && typeof value.result === 'object' ? value.result : value;
  if (!candidate || typeof candidate !== 'object') throw new Error('Azure OpenAI returned an empty direction object.');
  return candidate;
}

async function callAzure(prompt, images = []) {
  const config = azureConfig();
  const url = `${config.endpoint}/openai/deployments/${encodeURIComponent(config.deployment)}/chat/completions?api-version=${encodeURIComponent(config.version)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': config.key },
    body: JSON.stringify({ messages: [{ role: 'system', content: `Return valid JSON only. All string fields must be plain single-line text with no embedded line breaks or literal \n sequences. ${colorAccessibilityInstruction}` }, { role: 'user', content: [{ type: 'text', text: prompt }, ...imageContent(images)] }], response_format: { type: 'json_object' } }),
  });
  if (!response.ok) throw new Error(`Azure OpenAI request failed (${response.status}): ${(await response.text()).slice(0, 180)}`);
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Azure OpenAI returned an empty response.');
  return content;
}

async function callAzureJson(prompt, validator = () => true, images = []) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const parsed = JSON.parse(stripFences(await callAzure(`${prompt}\n${attempt ? 'Your previous output was invalid. Return corrected JSON only.' : ''}`, images)));
      const normalized = normalizeImagery(normalizeStrings(unwrapDirection(parsed)));
      if (!validator(normalized)) throw new Error('Azure OpenAI returned JSON with an invalid schema.');
      if (normalized.palette && !normalized.paletteContrastExplanation) normalized.paletteContrastExplanation = buildPaletteContrastExplanation(normalized.palette);
      return normalized;
    } catch (error) { lastError = error; }
  }
  throw new Error(`Could not generate valid moodboard JSON after retry: ${lastError.message}`);
}

function buildPaletteContrastExplanation(palette = []) {
  const background = palette.find((item) => item.role === 'Background')?.hex || 'the Background';
  const surface = palette.find((item) => item.role === 'Surface')?.hex || 'the Surface';
  const accent = palette.find((item) => item.role === 'Accent')?.hex || 'the Accent';
  const text = palette.find((item) => item.role === 'Text')?.hex || 'the Text';
  return `Text ${text} is paired with Background ${background}; Surface ${surface} separates content; Accent ${accent} provides a distinct high-visibility action color.`;
}

async function pexelsImages(queries = []) {
  if (!process.env.PEXELS_API_KEY) return queries.map((query) => ({ url: null, alt: query, query }));
  const used = new Set();
  return Promise.all(queries.slice(0, 6).map(async (query) => {
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`, { headers: { Authorization: process.env.PEXELS_API_KEY } });
      if (!response.ok) throw new Error('Pexels request failed');
      const photos = (await response.json())?.photos || [];
      const photo = photos.find((item) => !used.has(item.id));
      if (!photo) return { url: null, alt: query, query };
      used.add(photo.id);
      return { url: photo.src?.large2x || null, alt: photo.alt || query, credit: photo.photographer, creditUrl: photo.photographer_url || photo.url, query, source: 'Stock' };
    } catch { return { url: null, alt: query, query }; }
  }));
}

function validDirection(value) {
  const preview = value?.productPreview;
  return value && Array.isArray(value.palette) && value.palette.length === 4 && value.palette.every((item, index) => item?.role === paletteRoles[index] && isHex(item.hex)) && value.imagery && Array.isArray(value.imagery.pexelsQueries) && value.imagery.pexelsQueries.length >= 2 && value.imagery.pexelsQueries.length <= 4 && value.imagery.pexelsQueries.every((item) => typeof item === 'string' && item.trim()) && Array.isArray(value.imagery.pollinationsPrompts) && value.imagery.pollinationsPrompts.length >= 1 && value.imagery.pollinationsPrompts.length <= 2 && value.imagery.pollinationsPrompts.every((item) => typeof item === 'string' && item.trim()) && value.uiLanguage && ['layout', 'componentStyle', 'shapeLanguage', 'spacing'].every((key) => typeof value.uiLanguage[key] === 'string') && preview && typeof preview.appName === 'string' && Array.isArray(preview.navItems) && preview.navItems.length >= 1 && preview.navItems.length <= 5 && typeof preview.screenTitle === 'string' && preview.primaryMetric && typeof preview.primaryMetric.label === 'string' && typeof preview.primaryMetric.value === 'string' && Array.isArray(preview.secondaryMetrics) && preview.secondaryMetrics.length <= 2 && preview.secondaryMetrics.every((item) => item?.label && item?.value) && Array.isArray(preview.listItems) && preview.listItems.length >= 1 && preview.listItems.length <= 4 && preview.listItems.every((item) => item?.title && item?.subtitle) && typeof preview.primaryCta === 'string' && (!value.cssEasingCurve || isEasingCurve(value.cssEasingCurve));
}

async function generate(body, refinementText = '') {
  const direction = await callAzureJson(directionPrompt({ ...body, refinementText }), validDirection, body.images || []);
  direction.cssEasingCurve = isEasingCurve(direction.cssEasingCurve) ? direction.cssEasingCurve : 'cubic-bezier(0.2, 0.8, 0.2, 1)';
  direction.headingFontWeight = Number.isInteger(direction.headingFontWeight) ? direction.headingFontWeight : 400;
  direction.bodyFontWeight = Number.isInteger(direction.bodyFontWeight) ? direction.bodyFontWeight : 400;
  direction.headingLetterSpacing = typeof direction.headingLetterSpacing === 'string' ? direction.headingLetterSpacing : '0em';
  direction.bodyLetterSpacing = typeof direction.bodyLetterSpacing === 'string' ? direction.bodyLetterSpacing : '0em';
  direction.imageryQueries = direction.imagery.pexelsQueries;
  direction.images = await pexelsImages(direction.imagery.pexelsQueries);
  return direction;
}

export { generate, unwrapDirection, callAzureJson, isHex, paletteRoles };
