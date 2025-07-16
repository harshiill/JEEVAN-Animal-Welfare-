'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFoundCatchAllPage() {
  const {params} = useParams()


  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-white">
       <Image
        src="/sad.png"
        alt="Sad dog behind fence"
        width={180}
        height={180}
        className="mb-6 rounded-full shadow-lg"
      />


      <h1 className="text-6xl font-extrabold text-[#00C4B4]">404</h1>
      <p className="mt-4 text-xl text-gray-800 font-semibold">Oops! That tail doesn’t wag here.</p>
      <p className="text-gray-600 mt-2">
        We couldn&#39;t find <code className="font-mono text-red-500">{params}</code>
      </p>

      <Link
        href="/"
        className="mt-6 inline-block bg-[#00C4B4] text-white px-6 py-2 rounded-full hover:bg-[#00a39a] transition"
      >
        Go Back Home 🐾
      </Link>

      <p className="mt-8 text-sm text-gray-400">
        Powered by Jeevan – rescuing lives, one paw at a time 🐕
      </p>
    </div>
  );
}
