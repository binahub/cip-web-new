import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-text-muted">This page could not be found.</p>
      <Link
        href="/"
        className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
      >
        Go home
      </Link>
    </div>
  );
}
