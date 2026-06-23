// POST /api/log  { itemId, questions: [{ question, category }] }
// Posts a single Update (a post in the lead's Updates feed) on the lead's Monday item
// listing the FAQ answers the presenter opened during the web meeting.

const MONDAY_API = 'https://api.monday.com/v2';

async function mondayQuery(query, variables) {
  const res = await fetch(MONDAY_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.MONDAY_API_KEY || '',
      'API-Version': '2024-01',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }
  return json.data;
}

// Minimal HTML escaping — update bodies accept HTML, so guard the question text.
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.MONDAY_API_KEY) {
    return res.status(500).json({ error: 'MONDAY_API_KEY is not configured' });
  }

  const body = req.body || {};
  const itemId = body.itemId;
  const questions = Array.isArray(body.questions) ? body.questions : [];

  if (!itemId) return res.status(400).json({ error: 'itemId is required' });
  if (questions.length === 0) {
    return res.status(400).json({ error: 'No questions to log' });
  }

  const date = new Date().toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const items = questions
    .map((q) => {
      const text = esc(q.question || '');
      const cat = q.category ? ` <em>(${esc(q.category)})</em>` : '';
      return `<li>${text}${cat}</li>`;
    })
    .join('');
  const updateBody =
    `<p><strong>Web meeting FAQ session — ${esc(date)}</strong></p>` +
    `<p>Questions the lead asked about (FAQ answers opened):</p>` +
    `<ul>${items}</ul>`;

  const mutation = `
    mutation ($itemId: ID!, $body: String!) {
      create_update(item_id: $itemId, body: $body) { id }
    }`;

  try {
    const data = await mondayQuery(mutation, {
      itemId: String(itemId),
      body: updateBody,
    });
    const updateId = data?.create_update?.id;
    return res.status(200).json({ ok: true, updateId });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Monday update failed' });
  }
}
