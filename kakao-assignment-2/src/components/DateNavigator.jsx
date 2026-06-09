import { addDays, formatDateLabel, formatWeekRange } from '../utils/date'

// ===== 날짜 이동 네비게이터 =====
// 현재 선택된 날짜(또는 '주 전체 보기' 범위)를 표시하고, 이전/다음 버튼으로 하루씩 이동한다.
// 날짜 상태 자체는 부모(App)가 보유하고, 여기서는 '새 날짜'를 onChange로 전달만 한다.
// 이전/다음 버튼을 누르면 특정 하루로 이동하므로 주 전체 보기는 자연히 해제된다.
function DateNavigator({ selectedDate, weekStartDate, showWholeWeek, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
      <button
        type="button"
        onClick={() => onChange(addDays(selectedDate, -1))}
        className="rounded px-3 py-1 text-gray-600 transition hover:bg-gray-100"
        aria-label="이전 날짜"
      >
        ‹ 이전
      </button>

      <span className="font-semibold text-gray-900">
        {showWholeWeek
          ? `주 전체 · ${formatWeekRange(weekStartDate)}`
          : formatDateLabel(selectedDate)}
      </span>

      <button
        type="button"
        onClick={() => onChange(addDays(selectedDate, 1))}
        className="rounded px-3 py-1 text-gray-600 transition hover:bg-gray-100"
        aria-label="다음 날짜"
      >
        다음 ›
      </button>
    </div>
  )
}

export default DateNavigator
