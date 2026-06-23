// GET /api/lead?email=...
// Looks up a lead on the Monday "Management Leads" board by the Email column and
// returns its item id + name. The Monday API key stays server-side (MONDAY_API_KEY)
// and is never exposed to the browser.

const MONDAY_API = 'https://api.monday.com/v2';
const BOARD_ID = 5891626711;
const EMAIL_COLUMN = 'text_mkygb5xx'; // "Email" (text column on board 5891626711)

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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.MONDAY_API_KEY) {
    return res.status(500).json({ error: 'MONDAY_API_KEY is not configured' });
  }

  const email = String(req.query?.email || '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }

  const query = `
    query ($boardId: ID!, $column: String!, $value: String!) {
      items_page_by_column_values(
        board_id: $boardId
        columns: [{ column_id: $column, column_values: [$value] }]
        limit: 1
      ) {
        items { id name }
      }
    }`;

  try {
    const data = await mondayQuery(query, {
      boardId: String(BOARD_ID),
      column: EMAIL_COLUMN,
      value: email,
    });
    const item = data?.items_page_by_column_values?.items?.[0];
    if (!item) return res.status(200).json({ found: false });
    return res.status(200).json({ found: true, item: { id: item.id, name: item.name } });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Monday lookup failed' });
  }
}
