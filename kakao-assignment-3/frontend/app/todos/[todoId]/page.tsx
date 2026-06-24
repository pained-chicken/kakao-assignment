import { getTodo } from "@/app/todos/actions";
import TodoForm from "@/app/todos/_components/TodoForm";

// 수정 페이지 — Server Component 쉘.
// Next 16에서 params는 Promise이므로 await로 푼다.
export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;
  const todo = await getTodo(Number(todoId));

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">할 일 수정</h1>
      <TodoForm
        submitLabel="수정"
        todoId={todo.id}
        defaultValues={{ text: todo.text, date: todo.date }}
      />
    </main>
  );
}
