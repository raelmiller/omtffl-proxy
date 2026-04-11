module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { id, endpoint, gw } = req.query;

  const resolvedEndpoint = endpoint || 'league';

  const urls = {
    'league':    `https://draft.premierleague.com/api/league/${id}/details`,
    'elements':  `https://draft.premierleague.com/api/league/${id}/element-status`,
    'bootstrap': `https://draft.premierleague.com/api/bootstrap-static`,
    'fixtures':  `https://fantasy.premierleague.com/api/fixtures/`,
    'player':    `https://fantasy.premierleague.com/api/element-summary/${id}/`,
    'live':      `https://draft.premierleague.com/api/event/${id}/live`,
    'picks':     `https://draft.premierleague.com/api/entry/${id}/event/${gw}`,
  };

  const url = urls[resolvedEndpoint];
  if (!url) return res.status(400).json({ error: `Unknown endpoint. Use: ${Object.keys(urls).join(', ')}` });

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
    });
    if (!response.ok) return res.status(response.status).json({ error: `FPL API returned ${response.status}` });
    const data = await response.json();
    const ttl = resolvedEndpoint === 'live' ? 30 : 300;
    res.setHeader('Cache-Control', `s-maxage=${ttl}, stale-while-revalidate`);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
