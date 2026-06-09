import { useState } from 'react'

// ===== Todo 입력 폼 =====
// 텍스트 입력창과 추가 버튼으로 새로운 Todo를 생성한다.
// 입력값이 비어 있으면 생성하지 않고 안내 메시지를 표시한다.
function TodoForm({ onAdd }) {
  // 입력창의 현재 값(제어 컴포넌트)
  const [text, setText] = useState('')
  // 빈 입력 등 사용자에게 보여줄 안내 메시지
  const [message, setMessage] = useState('')

  // 폼 제출(추가 버튼 클릭 또는 Enter) 처리
  const handleSubmit = (event) => {
    event.preventDefault() // 폼 기본 동작(새로고침) 방지

    const trimmedText = text.trim()

    // 입력값이 비어 있으면 생성하지 않고 안내 메시지를 표시한다.
    if (trimmedText === '') {
      setMessage('할 일을 입력해주세요.')
      return
    }

    // 부모로 새 Todo 텍스트를 전달하고 입력창/메시지를 초기화한다.
    onAdd(trimmedText)
    setText('')
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="할 일을 입력하세요"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        />
        <button
          type="submit"
          className="rounded-lg bg-violet-600 px-5 py-2 font-medium text-white transition hover:bg-violet-700"
        >
          추가
        </button>
      </div>

      {/* 안내 메시지: 내용이 있을 때만 노출 */}
      {message && <p className="text-sm text-red-500">{message}</p>}
    </form>
  )
}

export default TodoForm
