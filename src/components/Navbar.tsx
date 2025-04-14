import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex items-center h-16 border-b border-neutral-200 px-3 gap-4">
      <p className="font-bold text-lg">PROVES Kit Deployment Testing</p>
      <Link href="/">Home</Link>
    </div>
  );
}
