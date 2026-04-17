module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Log what we're sending for debugging
    console.log('Request body keys:', Object.keys(body || {}));
    console.log('Model:', body?.model);
    console.log('Messages count:', body?.messages?.length);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    // Log error detail if not ok
    if (!response.ok) {
      console.error('Anthropic error:', response.status, JSON.stringify(data));
    }

    return res.status(response.status).json(data);
  } catch (e) {
    console.error('Proxy exception:', e.message);
    return res.status(500).json({ error: e.message });
  }
};
