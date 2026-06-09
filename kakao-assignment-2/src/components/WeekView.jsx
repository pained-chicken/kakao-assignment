import {
  WEEKDAY_NAMES,
  getDateKey,
  getWeekDays,
  formatWeekRange,
} from '../utils/date'

// 날짜 셀의 상태별 스타일(선택됨 > 오늘 > 기본 순으로 우선 적용)
function getCellStyle(isSelected, isToday) {
  if (isSelected) {
    // 선택된 날짜: 채워진 보라색
    return 'border-violet-600 bg-violet-600 text-white'
  }
  if (isToday) {
    // 오늘: 보라색 테두리 + 글자로 강조
    return 'border-violet-400 text-violet-700'
  }
  // 기본
  return 'border-gray-200 text-gray-700 hover:bg-gray-50'
}

// ===== 주간 뷰 =====
// 한 주(월~일)의 날짜를 표시하고, 날짜를 클릭하면 onSelectDate로 부모에 알린다.
// 어느 주를 보여줄지는 weekStartDate(부모 상태)가, 어떤 날짜가 선택됐는지는
// selectedDate(부모 상태)가 결정한다. 두 상태 모두 부모(App)가 단일하게 소유한다.
function WeekView({
  weekStartDate,
  selectedDate,
  showWholeWeek,
  todos,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
}) {
  const todayKey = getDateKey(new Date())
  const selectedKey = getDateKey(selectedDate)
  const days = getWeekDays(weekStartDate)

  return (
    <div
      className={
        'rounded-lg border bg-white p-3 ' +
        // 주 전체 보기일 때는 주 전체를 보라색 테두리로 강조한다.
        (showWholeWeek ? 'border-violet-400 ring-1 ring-violet-300' : 'border-gray-200')
      }
    >
      {/* 주차 이동 헤더 */}
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevWeek}
          className="rounded px-2 py-1 text-gray-600 transition hover:bg-gray-100"
          aria-label="이전 주"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {formatWeekRange(weekStartDate)}
        </span>
        <button
          type="button"
          onClick={onNextWeek}
          className="rounded px-2 py-1 text-gray-600 transition hover:bg-gray-100"
          aria-label="다음 주"
        >
          ›
        </button>
      </div>

      {/* 월~일 7칸 */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const dayKey = getDateKey(day)
          const isToday = dayKey === todayKey
          // 주 전체 보기 중에는 특정 날짜를 선택 강조하지 않는다.
          const isSelected = !showWholeWeek && dayKey === selectedKey
          // 해당 날짜의 Todo 개수(원본 todos에서 직접 센다)
          const count = todos.filter((todo) => todo.date === dayKey).length

          return (
            <button
              key={dayKey}
              type="button"
              onClick={() => onSelectDate(day)}
              className={
                'flex flex-col items-center gap-1 rounded-lg border px-1 py-2 transition ' +
                getCellStyle(isSelected, isToday)
              }
            >
              <span className="text-xs">{WEEKDAY_NAMES[day.getDay()]}</span>
              <span className="text-base font-semibold">{day.getDate()}</span>
              <span
                className={
                  'text-[11px] ' +
                  (isSelected
                    ? 'text-violet-100'
                    : count === 0
                      ? 'text-gray-300'
                      : 'text-violet-500')
                }
              >
                {count}개
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default WeekView
