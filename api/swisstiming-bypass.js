export default async function handler(req, res) {
  try {
    // Fetch the original JavaScript file from Swiss Timing
    const remoteRes = await fetch('https://racing.liveresults.swisstiming.com/index.js', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!remoteRes.ok) {
      return res.status(remoteRes.status).send('Failed to fetch from upstream');
    }

    let data = await remoteRes.text();
    
    // Rewrite the iframeIntegration requirement from true (!0) to false (!1)
    // This perfectly bypasses the client-side domain whitelist security check!
    const modified = data.replace('iframeIntegration:{required:!0', 'iframeIntegration:{required:!1');
    
    res.setHeader('Content-Type', 'application/javascript');
    // Set a cache control header to avoid unnecessary repeated fetching
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).send(modified);
    
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send('Internal Server Error');
  }
}
