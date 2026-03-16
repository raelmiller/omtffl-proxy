export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing league id' });

  try {
    const response = await fetch(`https://draft.premierleague.com/api/league/${id}/details`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });
    if (!response.ok) return res.status(response.status).json({ error: `FPL API returned ${response.status}` });
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
```

4. Click **"Commit new file"**

**Step 2 — Delete the old league.js at root**

1. Click the old `league.js` at the root level
2. Click the **"..."** menu (or trash icon) → **"Delete file"** → Commit

**Step 3 — Vercel will auto-redeploy** (takes ~30 seconds), then test:
```
https://omtffl-proxy.vercel.app/api/league?id=39004
