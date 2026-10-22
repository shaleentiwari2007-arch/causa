import { defineConfig, loadEnv } from 'vite' 
import react from '@vitejs/plugin-react' 

// Serves api/trace.js inside the Vite dev server, so `npm run dev` 
// behaves exactly like the deployed Vercel function. 
function causaDevApi() { 
  return { 
    name: 'causa-dev-api', 
    configureServer(server) { 
      server.middlewares.use('/api/trace', async (req, res) => { 
        if (req.method !== 'POST') { 
          res.statusCode = 405 
          res.setHeader('Content-Type', 'application/json') 
          res.end(JSON.stringify({ error: 'method_not_allowed' })) 
          return 
        } 
        const chunks = [] 
        for await (const chunk of req) chunks.push(chunk) 
        try { 
          req.body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') 
        } catch { 
          req.body = {} 
        } 
        res.status = (code) => { 
          res.statusCode = code 
          return res 
        } 
        res.json = (payload) => { 
          res.setHeader('Content-Type', 'application/json') 
          res.end(JSON.stringify(payload)) 
        } 
        try { 
          const mod = await server.ssrLoadModule('/api/trace.js') 
          await mod.default(req, res) 
        } catch (error) { 
          console.error('[api/trace]', error) 
          if (!res.headersSent) res.status(500).json({ error: 'server_error' }) 
        } 
      }) 
    }, 
  } 
} 

export default defineConfig(({ mode }) => { 
  const env = loadEnv(mode, process.cwd(), '') 
  for (const name of ['OPENROUTER_API_KEY', 'CAUSA_MODEL', 'CAUSA_REASONING_EFFORT']) { 
    if (env[name]) process.env[name] = env[name] 
  } 
  return { 
    plugins: [react(), causaDevApi()], 
  } 
})
