import { Link } from "@remix-run/react";

export function loader() {
  return new Response("Not Found", {
    status: 404,
  });
}

export default function NotFoundPage() {
  return (
    <div className="flex">
      <h1>404 - Not Found</h1>
      <p>Lo sentimos, la página que busca no existe.</p>
    </div>
  );
}
