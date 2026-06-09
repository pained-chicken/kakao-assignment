import { useEffect, useRef, useState } from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import FilterTabs from './components/FilterTabs'
import DateNavigator from './components/DateNavigator'
import WeekView from './components/WeekView'
import DatePicker from './components/DatePicker'
import {
  addDays,
  getDateKey,
  getWeekDays,
  getWeekStart,
  parseDateKey,
} from './utils/date'

// localStorage 저장 키
const STORAGE_KEY = 'todos'
const WEEK_KEY = 'weekStartDate'

// localStorage에 저장된 Todo를 불러온다. 저장된 값이 없으면 빈 배열을 반환한다.
// useState의 지연 초기화로 넘겨, 마운트 시 딱 한 번만 실행되게 한다.
function loadTodos() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

// 주간 뷰가 보여줄 주의 시작일(월요일)을 불러온다.
// 저장된 값이 있으면 복원하고, 없으면 '이번 주' 월요일로 시작한다.
function loadWeekStart() {
  const stored = localStorage.getItem(WEEK_KEY)
  return stored ? parseDateKey(stored) : getWeekStart(new Date())
}

function App() {
  // ===== 상태(데이터) =====
  // 모든 Todo를 객체 배열로 관리한다.
  // 각 Todo는 { id, text, date, isStarted, isCompleted } 형태.
  // date는 "YYYY-MM-DD" 문자열로, 어느 날짜의 할 일인지 구분한다.
  // 지연 초기화(loadTodos)로 새로고침 후에도 기존 데이터를 복원한다.
  const [todos, setTodos] = useState(loadTodos)
  // 현재 선택된 필터("all" | "none" | "active" | "completed")
  const [filter, setFilter] = useState('all')
  // 현재 선택된 날짜(일간 뷰의 기준). 처음에는 오늘로 설정한다.
  const [selectedDate, setSelectedDate] = useState(new Date())
  // 주간 뷰가 보여주는 주의 시작일(월요일). 새로고침 후에도 유지되도록 복원한다.
  const [weekStartDate, setWeekStartDate] = useState(loadWeekStart)
  // '주 전체 보기' 여부. true이면 선택된 하루 대신 보여주는 주 전체의 Todo를 표시한다.
  const [showWholeWeek, setShowWholeWeek] = useState(false)
  // 각 Todo를 구분하기 위한 고유 id 생성용 카운터(렌더와 무관하므로 ref로 둔다)
  // 복원한 Todo들의 최대 id + 1로 맞춰 id 충돌을 방지한다(최초 렌더에 한 번만 계산).
  const nextId = useRef(null)
  if (nextId.current === null) {
    nextId.current = todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1
  }

  // ===== 저장(영속화) =====
  // todos가 바뀔 때마다 자동으로 localStorage에 저장한다.
  // 추가/수정/삭제 등 어느 핸들러가 바꿨든 이 한 곳에서 저장이 일어난다.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  // 주간 뷰 시작일도 바뀔 때마다 저장한다("YYYY-MM-DD" 문자열로 직렬화).
  useEffect(() => {
    localStorage.setItem(WEEK_KEY, getDateKey(weekStartDate))
  }, [weekStartDate])

  // ===== 생성(Create) =====
  // 검증을 통과한 텍스트를 받아 새 Todo를 목록 끝에 추가한다(처음에는 '진행 전' 상태).
  // 생성 시점에 선택된 날짜를 함께 저장해 어느 날짜의 할 일인지 기록한다.
  const addTodo = (text) => {
    const newTodo = {
      id: nextId.current++,
      text,
      date: getDateKey(selectedDate),
      isStarted: false,
      isCompleted: false,
    }
    setTodos((prev) => [...prev, newTodo])
  }

  // ===== 진행 시작(Update) =====
  // '진행 전' 항목을 '진행 중'으로 바꾼다. 시작은 한 방향이라 이미 시작된 항목은 그대로 둔다.
  const startTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id && !todo.isStarted ? { ...todo, isStarted: true } : todo,
      ),
    )
  }

  // ===== 완료 토글(Update) =====
  // 시작된 항목에 한해 완료 여부를 반전시킨다(진행 전 항목은 완료할 수 없다).
  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id && todo.isStarted
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo,
      ),
    )
  }

  // ===== 텍스트 수정(Update) =====
  // 해당 id의 Todo 텍스트를 새 값으로 교체한다.
  const editTodo = (id, text) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text } : todo)),
    )
  }

  // ===== 삭제(Delete) =====
  // 해당 id의 Todo를 목록에서 제거한다.
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  // ===== 날짜 선택(드롭다운/일 이동 공용) =====
  // 특정 날짜를 선택한다. 그 날짜가 속한 주로 주간 뷰도 맞추고, 주 전체 보기는 해제한다.
  const selectDate = (date) => {
    setSelectedDate(date)
    setWeekStartDate(getWeekStart(date))
    setShowWholeWeek(false)
  }

  // ===== 주간 뷰 날짜 칸 클릭 =====
  // 이미 선택된 날짜를 다시 누르면 '주 전체 보기'로 전환하고, 그 외에는 해당 날짜를 선택한다.
  const handleSelectDay = (date) => {
    const clickedKey = getDateKey(date)
    if (!showWholeWeek && clickedKey === getDateKey(selectedDate)) {
      setShowWholeWeek(true)
      return
    }
    selectDate(date)
  }

  // ===== 주차 이동 =====
  // 주의 시작일과 선택 날짜를 함께 7일씩 옮겨, 선택한 요일이 다음/이전 주에서도 보이게 한다.
  const goPrevWeek = () => {
    setWeekStartDate((prev) => addDays(prev, -7))
    setSelectedDate((prev) => addDays(prev, -7))
  }
  const goNextWeek = () => {
    setWeekStartDate((prev) => addDays(prev, 7))
    setSelectedDate((prev) => addDays(prev, 7))
  }

  // ===== 파생 상태: 화면에 보여줄 목록 =====
  // todos(원본)는 그대로 두고, 날짜 범위 → 상태 필터 순으로 거른 결과만 "계산"한다.
  // DOM을 숨기는 게 아니라, 이 배열에 없는 항목은 애초에 렌더되지 않는다.
  const selectedKey = getDateKey(selectedDate)
  const weekKeys = getWeekDays(weekStartDate).map(getDateKey)
  const visibleTodos = todos
    // 1) 날짜 범위로 거른다: 주 전체 보기면 그 주 전체, 아니면 선택된 하루.
    .filter((todo) =>
      showWholeWeek ? weekKeys.includes(todo.date) : todo.date === selectedKey,
    )
    // 2) 상태 필터를 적용한다.
    .filter((todo) => {
      switch (filter) {
        case 'none': // 진행 전: 시작되지 않은 항목만
          return !todo.isStarted
        case 'active': // 진행 중: 시작했지만 완료되지 않은 항목만
          return todo.isStarted && !todo.isCompleted
        case 'completed': // 완료: 완료된 항목만
          return todo.isCompleted
        default: // 전체
          return true
      }
    })

  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">할 일 목록</h1>

      <div className="mb-4">
        <WeekView
          weekStartDate={weekStartDate}
          selectedDate={selectedDate}
          showWholeWeek={showWholeWeek}
          todos={todos}
          onSelectDate={handleSelectDay}
          onPrevWeek={goPrevWeek}
          onNextWeek={goNextWeek}
        />
      </div>

      <div className="mb-4">
        <DatePicker selectedDate={selectedDate} onChange={selectDate} />
      </div>

      <div className="mb-4">
        <DateNavigator
          selectedDate={selectedDate}
          weekStartDate={weekStartDate}
          showWholeWeek={showWholeWeek}
          onChange={selectDate}
        />
      </div>

      <div className="mb-6">
        <TodoForm onAdd={addTodo} />
      </div>

      <div className="mb-4">
        <FilterTabs current={filter} onChange={setFilter} />
      </div>

      <TodoList
        todos={visibleTodos}
        onStart={startTodo}
        onToggle={toggleTodo}
        onEdit={editTodo}
        onDelete={deleteTodo}
      />
    </main>
  )
}

export default App
