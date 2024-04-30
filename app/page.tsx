import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between text-brandColor5 p-6 md:p-24">
        <header className="z-10 w-full max-w-5xl flex flex-col items-center text-center space-y-4">
            <h1 className="text-2xl md:text-4xl font-bold">Welcome to the Listing Generator</h1>
            <p className="text-md md:text-lg">
                This boilerplate simplifies the process of building a E-Commerce listing with
                built-in AI features. It&apos;s designed to be easy to use and generate impressive results.
            </p>
        </header>

    </main>
  );
}
