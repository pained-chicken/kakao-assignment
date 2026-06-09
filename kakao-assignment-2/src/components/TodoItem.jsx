import { useState } from 'react'

// 진행 전/진행 중/완료 3단계에 따른 항목 컨테이너 배경 스타일
function getItemStyle(todo) {
  if (todo.isCompleted) {
    // 완료: 보라색 배경
    return 'border-violet-300 bg-violet-300'
  }
  if (todo.isStarted) {
    // 진행 중: 가장 연한 보라색 배경
    return 'border-gray-200 bg-violet-50'
  }
  // 진행 전: 흰색 배경
  return 'border-gray-200 bg-white'
}

// 상태에 따른 텍스트 스타일
function getTextStyle(todo) {
  if (todo.isCompleted) {
    // 완료: 취소선 + 흐린 색
    return 'text-gray-500 line-through'
  }
  if (todo.isStarted) {
    // 진행 중: 진한 보라색 + 굵게
    return 'font-semibold text-violet-700'
  }
  // 진행 전: 기본
  return 'text-gray-800'
}

// ===== 단일 Todo 항목 =====
// 텍스트와 동작 버튼(수정 / 시작 / 완료 / 삭제)을 표시한다.
// 상태는 진행 전 → 진행 중 → 완료 순으로 진행한다.
// '수정'을 누르면 prompt() 대신 인라인 입력창으로 전환되어 텍스트를 고칠 수 있다.
function TodoItem({ todo, onStart, onToggle, onEdit, onDelete }) {
  // 인라인 수정 모드 여부
  const [isEditing, setIsEditing] = useState(false)
  // 수정 중인 임시 텍스트(확정 전까지 원본은 그대로 둔다)
  const [draft, setDraft] = useState(todo.text)

  // 수정 모드로 진입: 현재 텍스트를 입력창 초기값으로 채운다.
  const startEdit = () => {
    setDraft(todo.text)
    setIsEditing(true)
  }

  // 수정 확정: 빈 값이면 변경하지 않고 원래 텍스트로 되돌린다.
  const confirmEdit = () => {
    const trimmedText = draft.trim()
    if (trimmedText === '') {
      setDraft(todo.text)
      setIsEditing(false)
      return
    }
    onEdit(todo.id, trimmedText)
    setIsEditing(false)
  }

  // 입력창 키 처리: Enter는 확정, Escape는 취소
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      confirmEdit()
    } else if (event.key === 'Escape') {
      setDraft(todo.text)
      setIsEditing(false)
    }
  }

  return (
    <li
      className={
        'flex items-center gap-3 rounded-lg border px-4 py-3 ' +
        getItemStyle(todo)
      }
    >
      {isEditing ? (
        // ===== 인라인 수정 입력창 =====
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={confirmEdit}
          autoFocus
          className="flex-1 rounded border border-violet-400 px-2 py-1 text-gray-800 outline-none focus:ring-2 focus:ring-violet-200"
        />
      ) : (
        // ===== 텍스트 표시(상태에 따라 시각적으로 구분) =====
        <span className={'flex-1 break-all ' + getTextStyle(todo)}>
          {todo.text}
        </span>
      )}

      {/* 동작 버튼 영역: 수정 · 시작 · 완료 · 삭제 */}
      <div className="flex shrink-0 gap-1.5">
        <button
          type="button"
          onClick={startEdit}
          className="rounded px-2.5 py-1 text-sm text-gray-600 transition hover:bg-gray-100"
        >
          수정
        </button>
        {/* 시작: 진행 전 항목만 시작 가능(시작은 한 방향) */}
        <button
          type="button"
          onClick={() => onStart(todo.id)}
          disabled={todo.isStarted}
          className="rounded px-2.5 py-1 text-sm text-violet-600 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
        >
          시작
        </button>
        {/* 완료/취소: 시작된 항목만 토글 가능 */}
        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          disabled={!todo.isStarted}
          className="rounded px-2.5 py-1 text-sm text-violet-600 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
        >
          {todo.isCompleted ? '취소' : '완료'}
        </button>
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          className="rounded px-2.5 py-1 text-sm text-red-500 transition hover:bg-red-50"
        >
          삭제
        </button>
      </div>
    </li>
  )
}

export default TodoItem
