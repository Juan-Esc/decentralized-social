import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import * as fl from 'remix-flat-routes'
import { installGlobals } from "@remix-run/node";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [
        remix({
            ignoredRouteFiles: ["**/.*"],
            // appDirectory: "app",
            // assetsBuildDirectory: "public/build",
            // publicPath: "/build/",
            // serverBuildPath: "build/index.js",
            routes: async defineRoutes => {
                return fl.flatRoutes('routes', defineRoutes)
            },
        }),
        tsconfigPaths()
    ],
});
