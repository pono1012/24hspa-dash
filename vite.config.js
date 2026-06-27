import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'https'

// Custom plugin to strip security headers for iframes
const frameBypassPlugin = () => {
  return {
    name: 'frame-bypass',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const originalSetHeader = res.setHeader;
        res.setHeader = function(name, value) {
          if (name.toLowerCase() === 'x-frame-options' || name.toLowerCase() === 'content-security-policy') {
            return;
          }
          originalSetHeader.call(this, name, value);
        };
        next();
      });
    }
  }
}

// Custom plugin to bypass Swiss Timing client-side iframe restrictions
const swissTimingBypassPlugin = () => {
  return {
    name: 'swisstiming-bypass',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/swisstiming/index.js')) {
          https.get('https://racing.liveresults.swisstiming.com/index.js', (remoteRes) => {
            let data = '';
            remoteRes.on('data', chunk => data += chunk);
            remoteRes.on('end', () => {
              // Rewrite the iframeIntegration requirement from true (!0) to false (!1)
              const modified = data.replace('iframeIntegration:{required:!0', 'iframeIntegration:{required:!1');
              res.setHeader('Content-Type', 'application/javascript');
              res.end(modified);
            });
          }).on('error', (e) => {
            console.error(e);
            next();
          });
          return;
        }
        next();
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), frameBypassPlugin(), swissTimingBypassPlugin()],
  define: {
    'process.env': process.env
  },
  server: {
    proxy: {
      // Proxy Alkamel Live Timing routes and assets to bypass X-Frame-Options
      '^/(gtworldchallengeeurope|sockjs/.*|packages/.*|[a-f0-9]{40}\\.js|[a-f0-9]{40}\\.css|favicon\\.ico)': {
        target: 'https://livetiming.alkamelsystems.com',
        changeOrigin: true,
        secure: false,
        ws: true
      },
      // Proxy Swiss Timing
      '/swisstiming': {
        target: 'https://racing.liveresults.swisstiming.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/swisstiming/, '')
      },
      // Proxy Yr.no exactly as requested by user
      '/api/yr': {
        target: 'https://www.yr.no/api/v0',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yr/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      },
      '/api/weather': {
        target: 'https://api.met.no',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/weather/, ''),
        headers: {
          'User-Agent': '24hSpaDash/1.0 (github.com)'
        }
      }
    }
  }
})
