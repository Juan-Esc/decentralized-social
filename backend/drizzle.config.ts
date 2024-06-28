import type { Config } from "drizzle-kit";

export default {
  dialect: "sqlite",
  driver: "d1",
  schema: "./src/models/*",
  out: "./migrations",
} satisfies Config;