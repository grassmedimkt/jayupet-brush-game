const ALLOWED_EVENTS = new Set([
  'LandingView',
  'GameReady',
  'GameStart',
  'FirstBrushContact',
  'FirstZoneCleaned',
  'FirstPhaseComplete',
  'Play10Seconds',
  'Play30Seconds',
  'Play60Seconds',
  'GameOver',
  'ResultViewed',
  'AmazonCtaViewed',
  'AmazonOutboundClick',
  'ShareResult',
]);

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const json = (res, status, body) => res.status(status).json(body);

function supabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase environment variables are missing.');
  return { url, key };
}

function cleanText(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function cleanInteger(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(max, Math.max(min, Math.round(number)));
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  try {
    const eventName = cleanText(req.body?.eventName, 40);
    const sessionId = cleanText(req.body?.sessionId, 36);
    const runId = cleanText(req.body?.runId, 36);
    if (!ALLOWED_EVENTS.has(eventName)) return json(res, 400, { error: 'Invalid analytics event.' });
    if (!UUID_V4.test(sessionId) || !UUID_V4.test(runId)) return json(res, 400, { error: 'Invalid analytics ID.' });

    const { url, key } = supabaseConfig();
    const payload = {
      session_id: sessionId,
      run_id: runId,
      event_name: eventName,
      elapsed_ms: cleanInteger(req.body?.elapsedMs, 0, 86400000),
      play_time_ms: cleanInteger(req.body?.playTimeMs, 0, 86400000),
      score: cleanInteger(req.body?.score, 0, 1000000),
      phase: cleanInteger(req.body?.phase, 1, 100000),
      zones_cleaned: cleanInteger(req.body?.zonesCleaned, 0, 1000000),
      device_type: cleanText(req.body?.deviceType, 16) || 'unknown',
      ready_time_ms: cleanInteger(req.body?.readyTimeMs, 0, 600000),
      utm_source: cleanText(req.body?.utmSource, 120),
      utm_medium: cleanText(req.body?.utmMedium, 120),
      utm_campaign: cleanText(req.body?.utmCampaign, 160),
      utm_content: cleanText(req.body?.utmContent, 160),
    };

    const response = await fetch(`${url}/rest/v1/analytics_events?on_conflict=session_id,event_name`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=ignore-duplicates,return=minimal',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(await response.text());
    return json(res, 204, null);
  } catch (error) {
    console.error('analytics API error', error);
    return json(res, 500, { error: 'Unable to store analytics event.' });
  }
}
