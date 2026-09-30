export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const metaPixelId = String(process.env.META_PIXEL_ID || '').trim();
  return res.status(200).json({
    metaPixelId: /^\d{5,30}$/.test(metaPixelId) ? metaPixelId : '',
  });
}
