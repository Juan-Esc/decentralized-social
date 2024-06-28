import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ThemeToggle } from "./resources.theme-toggle";

export default function Index() {
  return (
    <section className="w-full min-h-dvh flex flex-col">
      <nav className="flex items-center justify-between p-4 w-full">
        <Link to="/" className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold">DSocial</h1>
        </Link>
        {/*<ThemeToggle />*/}
      </nav>
      <div className="container flex justify-center items-center px-4 md:px-6 flex-1">
        <div className="flex flex-col items-center space-y-4 text-center p-4 md:w-1/2">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
            A{' '}
            <span className="font-extrabold bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text bg-300% animate-gradient">
              Decentralized
            </span>{' '}
            Open Social Network 😊
          </h1>

          <p className="text-muted-foreground mt-2">
            Powered by{' '}
            <span className="text-blue-700 font-bold mt-2">Polygon</span> and{' '}
            <span className="text-green-700 font-bold mt-2">Deso</span>
          </p>

          <div className="flex gap-3">
            <Button asChild>
              <Link to="/auth/register">Join the Community</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/auth/login">Login</Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}