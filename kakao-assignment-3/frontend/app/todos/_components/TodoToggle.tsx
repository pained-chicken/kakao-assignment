"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

// 완료 여부 체크박스 — Client Component.
// 변경 시 /api/todos/[id] route handler(프록시)로 PUT 요청을 보낸다.
export default function TodoToggle({
  id,
  isCompleted,
}: {
  id: number;
  isCompleted: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.checked;

    startTransition(async () => {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: next }),
      });

      if (!res.ok) {
        alert(`완료 상태 변경에 실패했습니다 (status ${res.status}).`);
        return;
      }

      router.refresh();
    });
  }

  return (
    <input
      type="checkbox"
      checked={isCompleted}
      disabled={isPending}
      onChange={handleChange}
      className="size-5 cursor-pointer accent-blue-600 disabled:opacity-50"
      aria-label="완료 여부"
    />
  );
}
