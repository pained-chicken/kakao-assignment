// 요일 이름(0=일요일 ~ 6=토요일). 날짜 표시에 사용한다.
export const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

// Date 객체를 "YYYY-MM-DD" 형식의 문자열로 변환한다.
// Todo의 날짜 비교 및 저장에 이 키를 사용한다.
export function getDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Date 객체를 사용자에게 보여줄 라벨로 변환한다.
// 예: "2026년 6월 9일 (화)", 오늘이면 뒤에 " · 오늘"을 붙인다.
export function formatDateLabel(date) {
  const weekday = WEEKDAY_NAMES[date.getDay()]
  let label = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`
  if (getDateKey(date) === getDateKey(new Date())) {
    label += ' · 오늘'
  }
  return label
}

// 주어진 날짜에 amount일을 더한 '새 Date'를 반환한다(원본은 변경하지 않는다).
// React에서는 상태를 직접 변경(mutate)하지 않고 새 객체로 교체해야 하므로 복사 후 계산한다.
export function addDays(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

// 특정 연/월(month는 1~12)의 마지막 일자(=그 달의 일수)를 구한다.
// new Date(year, month, 0)은 'month달의 0일' = 전월의 마지막 날을 의미한다.
export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

// "YYYY-MM-DD" 문자열을 Date 객체로 되돌린다(localStorage에서 주차 상태 복원에 사용).
export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// 주어진 날짜가 속한 주의 '월요일' Date를 구한다(원본은 변경하지 않는다).
export function getWeekStart(date) {
  const start = new Date(date)
  const dayOfWeek = start.getDay() // 0(일)~6(토)
  const offsetToMonday = (dayOfWeek + 6) % 7 // 월요일까지 거슬러 갈 일수
  start.setDate(start.getDate() - offsetToMonday)
  return start
}

// 주 시작일(월요일)부터 월~일 7개 Date 배열을 만든다.
export function getWeekDays(weekStartDate) {
  return Array.from({ length: 7 }, (_, offset) => addDays(weekStartDate, offset))
}

// 주의 범위 라벨을 만든다. 예: "2026년 6월 8일 ~ 6월 14일"
export function formatWeekRange(weekStartDate) {
  const end = addDays(weekStartDate, 6)
  return `${weekStartDate.getFullYear()}년 ${weekStartDate.getMonth() + 1}월 ${weekStartDate.getDate()}일 ~ ${end.getMonth() + 1}월 ${end.getDate()}일`
}
