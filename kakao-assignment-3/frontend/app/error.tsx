"use client"; // 에러 바운더리는 반드시 Client Component여야 한다.

import { useEffect } from "react";

// getTodos() 등이 throw하면 이 화면이 fallback으로 표시된다.
// (예: 백엔드가 꺼져 있어 fetch 실패)
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 실제 서비스라면 로깅 서비스로 보냄
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-20 text-center">
      <h2 className="mb-2 text-xl font-bold text-red-600">
        문제가 발생했습니다
      </h2>
      <p className="mb-6 text-sm text-gray-500">{error.message}</p>
      <button
        onClick={() => reset()}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        다시 시도
      </button>
    </main>
  );
}
