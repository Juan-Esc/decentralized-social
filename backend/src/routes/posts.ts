import { Hono } from "hono";
import { getHotFeedPosts, getPostById, getPostsByUser } from "../services/deso/posts";
import { users } from "../models/user.model";
import { eq } from "drizzle-orm";
import { getDesoAddress } from "../services/blockchain";
import { PostsService } from "../services/posts";
import { FeedService } from "../services/feed";

const postsRouter = new Hono<{ Variables: Variables }>()

postsRouter.use(async (c, next) => {
    const postsService = PostsService.getInstance(c.var.db, c.env);
    const feedsService = FeedService.getInstance(c.var.db, c.env);
    c.set('postsService', postsService);
    c.set('feedsService', feedsService);
    await next()
})

postsRouter.get('/trending', async (c) => {
    let response : any;
    const DesoReaderHashHex = c.req.query('DesoReaderHashHex')
    if (DesoReaderHashHex) {
        response = await getHotFeedPosts(DesoReaderHashHex)
    } else {
        response = await getHotFeedPosts()
    }
    return c.json(response)
})

postsRouter.get('/feed/recent', async (c) => {
    let response : any;
    const DesoReaderHashHex = c.req.query('DesoReaderHashHex')
    if (DesoReaderHashHex) {
      response = await c.get('feedsService').getDSocialRecentFeed(DesoReaderHashHex)
    } else {
        response = await c.get('feedsService').getDSocialRecentFeed()
    }
    console.log(response)
    return c.json(response)
})

postsRouter.get('/by-user/:username', async (c) => {
    let username = c.req.param('username')
    if (!username) return c.json({ message: "Username is required" }, 401)

    let response : any;
    const DesoReaderHashHex = c.req.query('DesoReaderHashHex')
    if (username.endsWith(".deso")) {
        response = await getPostsByUser(username, null, DesoReaderHashHex)

    } else {
        let user = await c.get('db').select().from(users).where(eq(users.username, username)).get();
        if (user) response = await getPostsByUser(username, user.desoPubKey, DesoReaderHashHex)
        else {
            let desoAddress = await getDesoAddress(username, c.env.API_URL, c.env.CONTRACT_ADDRESS);
            if (desoAddress) response = await getPostsByUser(username, desoAddress, DesoReaderHashHex)
        }
    }
 
    return c.json(response)
})

postsRouter.get('/get/:id', async (c) => {
    let id = c.req.param('id')
    if (!id) return c.json({ message: "ID is required" }, 401)

    let response : any;
    const DesoReaderHashHex = c.req.query('DesoReaderHashHex')
    if (DesoReaderHashHex) {
        response = await c.get('postsService')?.getPostById(id, DesoReaderHashHex)
    } else {
        response = await c.get('postsService')?.getPostById(id)
    }
    return c.json(response)
})

postsRouter.get('/get/:username/:id', async (c) => {
    let id = c.req.param('id')
    if (!id) return c.json({ message: "ID is required" }, 401)
    let username = c.req.param('username')
    if (!username) return c.json({ message: "Username is required" }, 401)
    let response = await getPostById(id, username)
    return c.json(response)
})

export default postsRouter

type Variables = {
}