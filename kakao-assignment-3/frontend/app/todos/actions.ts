"use server";

import { notFound } from "next/navigation";
import type { Todo } from "@/lib/todos";

// 읽기(조회) 경로 — Server Component에서 직접 호출하는 서버 함수.
// FastAPI를 직접 호출한다(쓰기는 /api/todos route handler를 거친다).
const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("환경변수 BACKEND_URL이 설정되지 않았습니다 (.env.local 확인).");
}

/**
 * 전체 Todo 목록 조회.
 * fetch는 Next 16에서 기본 캐시하지 않지만, 변경이 바로 반영되도록 no-store를 명시한다.
 * 실패 시 throw → app/todos/error.tsx 에러 바운더리로 전파된다.
 */
export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(`${BACKEND_URL}/todos`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Todo 목록을 불러오지 못했습니다 (status ${res.status}).`);
  }
  return res.json();
}

/**
 * 단건 Todo 조회.
 * 백엔드에 GET /todos/{id}가 없으므로 목록을 받아 find로 찾는다.
 * 없으면 notFound() → not-found UI.
 */
export async function getTodo(id: number): Promise<Todo> {
  const todos = await getTodos();
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    notFound();
  }
  return todo;
}
