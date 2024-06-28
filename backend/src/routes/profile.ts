import { Hono } from "hono";
import { getProfile } from "../services/profile";
import { eq } from "drizzle-orm";
import { users } from "../models/user.model";
import { UsersService } from "../services/users";
import type { GetProfileByUsername } from "@/interfaces/queries/profiles";

const profileRouter = new Hono<{ Variables: Variables }>()

profileRouter.get('/by-user/:username', async (c) => {
    const username = c.req.param('username')
    if (!username) return c.json({ message: "No username provided" }, 400)

    let response : GetProfileByUsername | null = null;
    if (username.endsWith(".deso")) {
        response = await getProfile(username, null)
    } else {
        const usersService = UsersService.getInstance(c.var.db, c.env);
        response = await usersService.getProfile(username)        
    }

    return c.json(response)
})

profileRouter.get('/profile-image/:username', async (c) => {
    // return base 64 image
    const username = c.req.param('username')
    if (!username) return c.json({ message: "No username provided" }, 400)

    let response : GetProfileByUsername | null = null;
    if (username.endsWith(".deso")) {
        response = await getProfile(username, null)
    } else {
        const usersService = UsersService.getInstance(c.var.db, c.env);
        response = await usersService.getProfile(username)        
    }

    // download and convert to base64  response.profileImageUrl 
    if (response && response.profileImageUrl) {
        const imageResponse = await fetch(response.profileImageUrl);
        const imageArrayBuffer = await imageResponse.arrayBuffer();
        const imageUint8Array = new Uint8Array(imageArrayBuffer);
        const base64Image = btoa(String.fromCharCode(...imageUint8Array));
        response.profileImageUrl = `data:image/png;base64,${base64Image}`;
    }

    return c.json(response)
})

export default profileRouter


type Variables = {
}