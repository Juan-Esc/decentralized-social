import {} from 'hono'
import { DrizzleD1Database } from "drizzle-orm/d1";
import type { UsersService } from './services/users';

type Head = {
  title?: string
}

declare module 'hono' {
  interface Env {
    Variables: {
      db: DrizzleD1Database<Record<string, never>>,
      usersService?: UsersService,
      postsService?: PostsService,
      feedsService?: FeedService
    }
    Bindings: EnvBindings
  }
  interface ContextRenderer {
    (content: string | Promise<string>, head?: Head): Response | Promise<Response>
  }
}

export interface Env {
  Variables: {
    db: DrizzleD1Database<Record<string, never>>,
    usersService?: UsersService,
    postsService?: PostsService,
    feedsService?: FeedService
  }
  Bindings: EnvBindings
}

export interface ContextRenderer {
  (content: string | Promise<string>, head?: Head): Response | Promise<Response>
}

export interface EnvBindings {
  DB: D1Database,
  API_URL: string,
  CONTRACT_ADDRESS: string,
  SPONSOR_PRIVATE_KEY: string,
  DESO_API_URL,
  DESO_SPONSOR_PRIVATE_KEY: string,
  DESO_SPONSOR_PUBLIC_KEY
}