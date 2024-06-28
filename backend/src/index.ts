import { Hono } from 'hono'
import { cache } from 'hono/cache'
import postsRouter from './routes/posts'
import profileRouter from './routes/profile'
import userRouter from './routes/users'
import { DrizzleDB } from './utils/drizzle'

const app = new Hono()

app.use(async (c, next) => {
    // Configure CORS when not behind a reverse proxy that already sets them up
    if (!c.req.header('Access-Control-Allow-Origin')) {
        c.res.headers.set('Access-Control-Allow-Origin', '*')
        c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }
    await next()
})

// @ts-ignore
/*if (typeof caches !== 'undefined' && typeof caches.default !== 'undefined') {
    // Cache for Cloudflare Workers runtime
    app.get(
        '*',
        cache({
            cacheName: 'my-app',
            cacheControl: 'max-age=600',
        })
    )
}*/

app.use(async (c, next) => {
    c.set("db", DrizzleDB.getInstance(c.env.DB));
    await next()
})

app.use(async (c, next) => {
    console.log('Request:', c.req.method, c.req.url)
    await next()
})

app.get('/', async (c) => {
    return c.json({ message: 'Hello from' }, 200)
})

app.route('/posts', postsRouter)
app.route('/profiles', profileRouter)
app.route('/users', userRouter)

app.options('*', async (c) => {
    return c.json({}, 200)
})

export default {
    port: 3001,
    fetch: app.fetch,
}