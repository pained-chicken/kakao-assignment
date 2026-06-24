"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

// 삭제 버튼 — Client Component.
// 클릭 시 /api/todos/[id] route handler(프록시)로 DELETE 요청을 보낸다.
export default function TodoDeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });

      if (!res.ok) {
        alert(`삭제에 실패했습니다 (status ${res.status}).`);
        return;
      }

      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="shrink-0 rounded-md px-3 py-1 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      삭제
    </button>
  );
}
