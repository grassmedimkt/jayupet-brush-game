const json = (res, status, body) => res.status(status).json(body);

function supabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase environment variables are missing.');
  return { url, key };
}

async function supabase(path, options = {}) {
  const { url, key } = supabaseConfig();
  return fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

async function rankFor(score) {
  const response = await supabase(`scores?select=id&score=gt.${score}`, {
    headers: { Prefer: 'count=exact', Range: '0-0' },
  });
  if (!response.ok) throw new Error(await response.text());
  const total = Number(response.headers.get('content-range')?.split('/')[1] || 0);
  return total + 1;
}

async function submitScore(req, res) {
  const name = String(req.body?.name || '').trim().slice(0, 14);
  const score = Number(req.body?.score);
  const runId = String(req.body?.runId || '').trim();
  if (!name) return json(res, 400, { error: 'YOUR NAME is required.' });
  if (!Number.isInteger(score) || score < 0 || score > 1000000) {
    return json(res, 400, { error: 'Invalid score.' });
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(runId)) {
    return json(res, 400, { error: 'Invalid run ID.' });
  }

  const insert = await supabase('scores?on_conflict=run_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
    body: JSON.stringify({ run_id: runId, player_name: name, score }),
  });
  if (!insert.ok) throw new Error(await insert.text());
  let rows = await insert.json();

  if (!rows.length) {
    const existing = await supabase(`scores?run_id=eq.${encodeURIComponent(runId)}&select=player_name,score&limit=1`);
    if (!existing.ok) throw new Error(await existing.text());
    rows = await existing.json();
  }

  const saved = rows[0];
  const rank = await rankFor(saved.score);
  return json(res, 200, { name: saved.player_name, score: saved.score, rank });
}

async function leaderboard(req, res) {
  const limit = Math.min(50, Math.max(1, Number(req.query?.limit) || 10));
  const response = await supabase(`scores?select=player_name,score,created_at&order=score.desc,created_at.asc&limit=${limit}`);
  if (!response.ok) throw new Error(await response.text());
  const rows = await response.json();
  return json(res, 200, {
    scores: rows.map((row, index) => ({ rank: index + 1, name: row.player_name, score: row.score })),
  });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'POST') return await submitScore(req, res);
    if (req.method === 'GET') return await leaderboard(req, res);
    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { error: 'Method not allowed.' });
  } catch (error) {
    console.error('scores API error', error);
    return json(res, 500, { error: 'Unable to reach the ranking server.' });
  }
}
