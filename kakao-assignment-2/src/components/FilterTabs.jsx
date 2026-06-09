// 필터 탭 정의(키 → 라벨). app.js의 currentFilter 값과 동일한 의미를 가진다.
const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'none', label: '진행 전' },
  { key: 'active', label: '진행 중' },
  { key: 'completed', label: '완료' },
]

// ===== 필터 탭 =====
// 현재 선택된 필터(current)를 강조 표시하고, 클릭 시 onChange로 부모에 알린다.
// 어떤 항목을 보여줄지 '거르는' 책임은 부모(App)에 있고, 여기서는 선택만 담당한다.
function FilterTabs({ current, onChange }) {
  return (
    <div className="flex gap-2">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={
            'rounded-full px-3 py-1 text-sm transition ' +
            (current === key
              ? 'bg-violet-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
          }
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default FilterTabs
