// 로딩 UI — Server Component. getTodos() await 동안 자동으로 <Suspense> fallback으로 표시된다.
// (Next가 page.tsx를 loading.tsx로 자동 래핑)
export default function Loading() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-9 w-24 animate-pulse rounded bg-gray-200" />
      </div>
      <ul className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3"
          >
            <div className="size-5 animate-pulse rounded bg-gray-200" />
            <div className="h-5 flex-1 animate-pulse rounded bg-gray-200" />
          </li>
        ))}
      </ul>
    </main>
  );
}
