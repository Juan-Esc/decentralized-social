import { Hono, type Context, type Env } from "hono";
import type { Variables } from "hono/types";
import { getEthAddress } from "../services/blockchain";
import { users } from "../models/user.model";
import { eq } from "drizzle-orm";
import { UsersService } from "../services/users";
import { sponsorRegistration } from "../services/eth/feesSponsor";
import { sponsorDesoRegistration } from "../services/deso/feesSponsor";
import { getProfile } from "../services/profile";

const userRouter = new Hono<{ Variables: { usersService: UsersService } }>()

userRouter.use(async (c, next) => {
    const usersService = UsersService.getInstance(c.var.db, c.env);
    c.set('usersService', usersService);
    await next()
})

userRouter.get('/', async (c) => {
    return c.json({ message: "Hello from the user router" }, 200)
})

userRouter.get('/usernameInUse/:username', async (c) => {
    const username = c.req.param('username')
    if (!username) return c.json({ message: "No username provided" }, 400)
    // Check if username is in DB
    let user = await c.get('db').select().from(users).where(eq(users.username, username)).get();
    console.log(user)
    if (user) return c.json({ message: "Username is in use" }, 400)

    let userInBlockchain = await getEthAddress(username, c.env.API_URL, c.env.CONTRACT_ADDRESS);
    if (userInBlockchain && Number(userInBlockchain) !== 0) return c.json({ message: "Username is in use" }, 400)

    return c.json({ message: "Username is available" }, 200)
})

userRouter.get('/u/:username', async (c) => {
    const username = c.req.param('username')
    if (!username) return c.json({ message: "No username provided" }, 400)

    // Look for profile
    let user = await c.get('usersService')?.getProfile(username);
    return c.json(user, 200)
})

userRouter.get('/getData/:ethPubAddress/:desoPubKey', async (c) => {
    const ethPubAddress = c.req.param('ethPubAddress')
    if (!ethPubAddress) return c.json({ message: "No address provided" }, 400)

    const desoPubKey = c.req.param('desoPubKey')
    if (!desoPubKey) return c.json({ message: "No address provided" }, 400)

    // Look for profile
    let authData = await c.get('usersService')?.getLoginDataWithEthPubKey(ethPubAddress, desoPubKey);
    return c.json(authData, 200)
})

/*  !!! WARNING !!!
    A proper method for sponsoring gas fees should be implemented. NEVER use this in production.
    This is just a simple implementation, given it will be used in testnet only for an educational project
*/
userRouter.post('/reg-sponsor', async (c) => {
    const body = await c.req.json()
    const { pubAddress, desoPubAddress } = body
    if (!pubAddress) return c.json({ message: "Missing parameters" }, 400)

    console.log("Sponsoring registration for ETH", pubAddress)
    console.log('Sponsoring registration for Deso', desoPubAddress)

    let receipt = await sponsorRegistration(pubAddress, c.env.SPONSOR_PRIVATE_KEY, c.env.API_URL)
    if (!receipt) return c.json({ message: "Error sponsoring registration" }, 400)

    let receiptDeso = await sponsorDesoRegistration(desoPubAddress, c.env.DESO_SPONSOR_PRIVATE_KEY, c.env.DESO_API_URL, c.env.DESO_SPONSOR_PUBLIC_KEY);
    if (!receiptDeso) return c.json({ message: "Error sponsoring registration" }, 400)

    return c.json({ message: "Sponsored ETH sent!" }, 200)
})

userRouter.post('/register', async (c) => {
    const body = await c.req.json()
    const { username, ethPubKey, desoPubKey } = body
    if (!username || !ethPubKey || !desoPubKey) return c.json({ message: "Missing parameters" }, 400)

    console.log("registering")

    let user = await c.get('usersService')?.createUser(username, ethPubKey, desoPubKey);
    if (!user) return c.json({ message: "Error creating user" }, 400)

    return c.json({ message: "User created" }, 200)
})

export default userRouter