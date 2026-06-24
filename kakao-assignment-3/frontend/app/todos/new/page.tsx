import TodoForm from "@/app/todos/_components/TodoForm";

// 생성 페이지 — Server Component 쉘. 정적 마크업 + Client 폼.
// 폼이 /api/todos route handler로 직접 fetch하므로 액션을 내려줄 필요가 없다.
export default function NewTodoPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">새 할 일</h1>
      <TodoForm submitLabel="추가" />
    </main>
  );
}
