"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

// 생성/수정 공용 폼 — Client Component.
// 제출 시 /api/todos route handler(프록시)로 fetch한다.
// todoId가 있으면 수정(PUT), 없으면 생성(POST).
type Props = {
  submitLabel: string;
  todoId?: number;
  defaultValues?: { text: string; date: string | null };
};

export default function TodoForm({ submitLabel, todoId, defaultValues }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const text = (formData.get("text") as string)?.trim();
    const date = (formData.get("date") as string)?.trim() || null;

    if (!text) {
      setError("할 일 내용을 입력해 주세요.");
      return;
    }

    const url = todoId ? `/api/todos/${todoId}` : "/api/todos";
    const method = todoId ? "PUT" : "POST";

    startTransition(async () => {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, date }),
      });

      if (!res.ok) {
        setError(
          `${todoId ? "수정" : "생성"}에 실패했습니다 (status ${res.status}).`,
        );
        return;
      }

      router.push("/");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">할 일</span>
        <input
          name="text"
          type="text"
          required
          defaultValue={defaultValues?.text ?? ""}
          placeholder="무엇을 해야 하나요?"
          className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">날짜 (선택)</span>
        <input
          name="date"
          type="date"
          defaultValue={defaultValues?.date ?? ""}
          className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </label>

      {error && (
        <p className="text-sm text-red-600" aria-live="polite">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "저장 중…" : submitLabel}
        </button>
        <Link
          href="/"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
