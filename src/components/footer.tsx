import Link from "next/link";

export function Footer() {
  return (
    <footer className="text-center mt-8">
      <p>
        &copy; 2024 Lite &middot; Built with Nextjs and WordPress &middot;{" "}
        <Link href={"/sitemap.xml"}>Sitemap</Link>
      </p>
    </footer>
  );
}
