import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Dev-only: run the Vercel-style /api functions under `npm run dev`. In production
// Vercel serves the files in /api natively; this plugin gives the same routes locally
// by adapting Node's req/res to the Vercel handler shape (req.query/req.body, res.status/json).
function devApi() {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      const handlers = {
        '/api/lead': () => import('./api/lead.js'),
        '/api/log': () => import('./api/log.js'),
      };
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        const load = handlers[url.pathname];
        if (!load) return next();

        // Adapt to the Vercel handler contract.
        req.query = Object.fromEntries(url.searchParams);
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (obj) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(obj));
          return res;
        };

        try {
          if (req.method === 'POST') {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            const raw = Buffer.concat(chunks).toString('utf8');
            req.body = raw ? JSON.parse(raw) : {};
          }
          const mod = await load();
          await mod.default(req, res);
        } catch (err) {
          res.status(500).json({ error: err.message || 'Dev API error' });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Expose MONDAY_API_KEY (and friends) to the dev API handlers via process.env.
  const env = loadEnv(mode, process.cwd(), '');
  if (env.MONDAY_API_KEY) process.env.MONDAY_API_KEY = env.MONDAY_API_KEY;

  return {
    plugins: [react(), devApi()],
  };
});
