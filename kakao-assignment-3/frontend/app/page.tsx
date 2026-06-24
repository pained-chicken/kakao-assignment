import Link from "next/link";
import { getTodos } from "@/app/todos/actions";
import TodoToggle from "@/app/todos/_components/TodoToggle";
import TodoDeleteButton from "@/app/todos/_components/TodoDeleteButton";

// 홈(목록) 페이지 — Server Component. 서버에서 직접 데이터를 패칭하므로
// 초기 HTML에 목록이 담겨 나가고, 로딩/에러는 loading.tsx/error.tsx가 처리한다.
export default async function HomePage() {
  const todos = await getTodos();

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">할 일 목록</h1>
        <Link
          href="/todos/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + 새 할 일
        </Link>
      </div>

      {todos.length === 0 ? (
        <p className="py-16 text-center text-gray-500">
          아직 할 일이 없습니다. 새로 추가해 보세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3"
            >
              {/* 완료 토글: 인터랙티브 잎 → Client Component */}
              <TodoToggle id={todo.id} isCompleted={todo.is_completed} />

              <div className="min-w-0 flex-1">
                <p
                  className={
                    todo.is_completed
                      ? "truncate text-gray-400 line-through"
                      : "truncate"
                  }
                >
                  {todo.text}
                </p>
                {todo.date && (
                  <p className="text-xs text-gray-400">{todo.date}</p>
                )}
              </div>

              <Link
                href={`/todos/${todo.id}`}
                className="shrink-0 rounded-md px-3 py-1 text-sm text-blue-600 hover:bg-blue-50"
              >
                수정
              </Link>

              {/* 삭제: 클라이언트에서 /api/todos/[id] 프록시로 DELETE 요청 */}
              <TodoDeleteButton id={todo.id} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
