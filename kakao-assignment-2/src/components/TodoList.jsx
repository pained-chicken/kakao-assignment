import TodoItem from './TodoItem'

// ===== Todo 목록 =====
// 생성된 Todo들을 목록 형태로 화면에 표시한다.
// 항목이 하나도 없으면 안내 문구를 보여준다.
function TodoList({ todos, onStart, onToggle, onEdit, onDelete }) {
  if (todos.length === 0) {
    return (
      <p className="py-8 text-center text-gray-400">등록된 할 일이 없습니다.</p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onStart={onStart}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default TodoList
