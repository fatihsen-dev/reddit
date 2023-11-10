import Link from "next/link";

export default function NotFound() {
  return (
    <div className="absolute inset-0 z-40 flex h-full w-full flex-col items-center justify-center gap-3 bg-background">
      <h1 className="text-7xl font-normal">404</h1>
      <p className="font-light">
        Page not found back to{" "}
        <Link className="font-medium text-pink-500 hover:underline" href="/">
          Home
        </Link>{" "}
        page
      </p>
    </div>
  );
}
