import { getDaysInMonth } from '../utils/date'

// start부터 end까지의 정수 배열을 만든다(드롭다운 옵션 생성용).
function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

// ===== 날짜 드롭다운 선택기 =====
// 연/월/일을 제어 컴포넌트(<select>)로 고른다. 값이 바뀌면 새 Date를 만들어 onChange로 전달한다.
// 연/월이 바뀔 때는 그 달의 일수를 넘지 않도록 일자를 보정(clamp)한다.
function DatePicker({ selectedDate, onChange }) {
  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth() + 1 // 0~11 → 1~12
  const day = selectedDate.getDate()

  // 선택 가능한 값들: 연도는 현재 기준 ±5년, 일은 해당 연/월의 일수에 맞춘다.
  const years = range(year - 5, year + 5)
  const months = range(1, 12)
  const days = range(1, getDaysInMonth(year, month))

  const handleYear = (value) => {
    const maxDay = getDaysInMonth(value, month)
    onChange(new Date(value, month - 1, Math.min(day, maxDay)))
  }
  const handleMonth = (value) => {
    const maxDay = getDaysInMonth(year, value)
    onChange(new Date(year, value - 1, Math.min(day, maxDay)))
  }
  const handleDay = (value) => {
    onChange(new Date(year, month - 1, value))
  }

  const selectClass =
    'rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 outline-none focus:border-violet-500'

  return (
    <div className="flex gap-2">
      <select
        value={year}
        onChange={(event) => handleYear(Number(event.target.value))}
        className={selectClass}
        aria-label="연도 선택"
      >
        {years.map((value) => (
          <option key={value} value={value}>
            {value}년
          </option>
        ))}
      </select>
      <select
        value={month}
        onChange={(event) => handleMonth(Number(event.target.value))}
        className={selectClass}
        aria-label="월 선택"
      >
        {months.map((value) => (
          <option key={value} value={value}>
            {value}월
          </option>
        ))}
      </select>
      <select
        value={day}
        onChange={(event) => handleDay(Number(event.target.value))}
        className={selectClass}
        aria-label="일 선택"
      >
        {days.map((value) => (
          <option key={value} value={value}>
            {value}일
          </option>
        ))}
      </select>
    </div>
  )
}

export default DatePicker
