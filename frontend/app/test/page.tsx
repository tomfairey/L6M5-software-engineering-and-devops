import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Page",
  description: "Testing adding a new page",
};

export default function Test() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1>Test Page</h1>
        <ul className="list-inside list-disc text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">Seems good to me</li>
          <li className="mb-2">I like it...</li>
          <li className="mb-2">What&apos;s next?</li>
          <li className="mb-2">
            <Link href="/" className="underline">Go back</Link> (&lt;--)
          </li>
          <a href="/">a[href] to /</a>
        </ul>
      </main>
    </div>
  );
}
