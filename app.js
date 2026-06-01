// ===== DOM 요소 참조 =====
const todoForm = document.getElementById("todo-form");       // 입력 폼
const todoInput = document.getElementById("todo-input");     // 텍스트 입력창
const formMessage = document.getElementById("form-message"); // 안내 메시지 영역
const todoList = document.getElementById("todo-list");       // Todo 목록(ul)
const todoFilters = document.getElementById("todo-filters"); // 필터 탭 영역
const prevDayButton = document.getElementById("prev-day");   // 이전 날짜 버튼
const nextDayButton = document.getElementById("next-day");   // 다음 날짜 버튼
const currentDateLabel = document.getElementById("current-date"); // 현재 날짜 표시

// 날짜 선택기(드롭다운) 관련 요소
const datePicker = document.getElementById("date-picker");           // 선택기 전체 컨테이너
const pickerYearTrigger = document.getElementById("picker-year-trigger");   // 연도 트리거
const pickerMonthTrigger = document.getElementById("picker-month-trigger"); // 월 트리거
const pickerDayTrigger = document.getElementById("picker-day-trigger");     // 일 트리거
const pickerYearMenu = document.getElementById("picker-year-menu");   // 연도 메뉴
const pickerMonthMenu = document.getElementById("picker-month-menu"); // 월 메뉴
const pickerDayMenu = document.getElementById("picker-day-menu");     // 일 메뉴

// ===== 상태(데이터) =====
// 모든 Todo를 객체 배열로 관리한다.
// 각 Todo는 { id, text, date, isStarted, isCompleted } 형태를 가진다.
// date는 "YYYY-MM-DD" 형식의 날짜 문자열로, 어느 날짜의 할 일인지 구분한다.
let todos = [];

// 각 Todo를 구분하기 위한 고유 id 생성용 카운터
let nextTodoId = 1;

// 현재 선택된 필터 상태("all" | "none" | "active" | "completed")
let currentFilter = "all";

// 현재 선택된 날짜(일간 뷰의 기준). 처음에는 오늘로 설정한다.
let selectedDate = new Date();

// 요일 이름(0=일요일 ~ 6=토요일). 날짜 표시에 사용한다.
const WEEKDAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

// ===== 날짜 유틸 함수 =====
// Date 객체를 "YYYY-MM-DD" 형식의 문자열로 변환한다.
// Todo의 날짜 비교 및 저장에 이 키를 사용한다.
function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Date 객체를 사용자에게 보여줄 라벨로 변환한다.
// 예: "2026년 6월 1일 (월)", 오늘이면 뒤에 " · 오늘"을 붙인다.
function formatDateLabel(date) {
  const weekday = WEEKDAY_NAMES[date.getDay()];
  let label = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`;
  // 선택된 날짜가 오늘과 같으면 '오늘' 표시를 덧붙인다.
  if (getDateKey(date) === getDateKey(new Date())) {
    label += " · 오늘";
  }
  return label;
}

// start부터 end까지의 정수 배열을 만든다(드롭다운 숫자 목록 생성용).
function range(start, end) {
  const numbers = [];
  for (let value = start; value <= end; value++) {
    numbers.push(value);
  }
  return numbers;
}

// 특정 연/월(month는 1~12)의 마지막 일자(=그 달의 일수)를 구한다.
// new Date(year, month, 0)은 'month달의 0일' = 전월의 마지막 날을 의미한다.
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

// 드롭다운에 보여줄 연도 범위(선택된 연도 기준 ±5년).
function getSelectableYears() {
  const baseYear = selectedDate.getFullYear();
  return range(baseYear - 5, baseYear + 5);
}

// ===== 안내 메시지 표시 함수 =====
// 빈 입력 등 사용자에게 피드백이 필요할 때 메시지를 보여준다.
function showMessage(message) {
  formMessage.textContent = message;
}

// 안내 메시지를 지운다(정상 동작 시 호출).
function clearMessage() {
  formMessage.textContent = "";
}

// ===== Todo 생성(Create) =====
// 입력값을 검증한 뒤 새로운 Todo를 배열에 추가한다.
function addTodo(text) {
  // 앞뒤 공백을 제거한 실제 내용
  const trimmedText = text.trim();

  // 입력값이 비어 있으면 생성하지 않고 안내 메시지를 표시한다.
  if (trimmedText === "") {
    showMessage("할 일을 입력해주세요.");
    return;
  }

  // 새 Todo 객체를 만들어 배열에 추가한다.
  // date에 현재 선택된 날짜를 저장해 어느 날짜의 할 일인지 기록한다.
  const newTodo = {
    id: nextTodoId++,
    text: trimmedText,
    date: getDateKey(selectedDate), // 생성 시점에 선택된 날짜
    isStarted: false, // 진행 여부 추가
    isCompleted: false, // 완료 여부
  };
  todos.push(newTodo);

  // 입력창 초기화 및 안내 메시지 제거
  todoInput.value = "";
  clearMessage();

  // 변경된 상태를 화면에 다시 그린다.
  renderTodos();
}

// ===== Todo 진행 토글(Update) =====
// 해당 id의 Todo 진행 여부를 반전시킨다.
function toggleTodoStarted(id) {
  todos = todos.map((todo) =>
    todo.id === id && !todo.isStarted ? { ...todo, isStarted: !todo.isStarted } : todo
  );
  renderTodos();
}


// ===== Todo 완료 토글(Update) =====
// 해당 id의 Todo 완료 여부를 반전시킨다.
function toggleTodoCompleted(id) {
  todos = todos.map((todo) =>
    todo.id === id && todo.isStarted ? { ...todo, isCompleted: !todo.isCompleted } : todo
  );
  renderTodos();
}

// ===== Todo 텍스트 수정(Update) =====
// 해당 id의 Todo 텍스트를 새 값으로 교체한다.
function editTodoText(id, newText) {
  const trimmedText = newText.trim();

  // 수정값이 비어 있으면 변경하지 않고 안내 메시지를 표시한다.
  if (trimmedText === "") {
    showMessage("수정할 내용을 입력해주세요.");
    renderTodos(); // 원래 텍스트로 되돌려 다시 그린다.
    return;
  }


  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, text: trimmedText } : todo
  );
  clearMessage();
  renderTodos();
}

// ===== Todo 삭제(Delete) =====
// 해당 id의 Todo를 배열에서 제거한다.
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  renderTodos();
}

// ===== 수정 모드 전환 =====
// 텍스트를 입력창으로 바꿔 인라인 수정이 가능하게 한다.
function enterEditMode(todoItemElement, todo) {
  // 기존 텍스트 요소를 찾아 입력창으로 교체한다.
  const textElement = todoItemElement.querySelector(".todo-item__text");

  // 수정용 입력창 생성 및 현재 텍스트로 초기화
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "todo-item__edit-input";
  editInput.value = todo.text;

  // 텍스트 요소를 입력창으로 교체하고 포커스를 준다.
  textElement.replaceWith(editInput);
  editInput.focus();

  // Enter 키를 누르면 수정 내용을 확정한다.
  editInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      editTodoText(todo.id, editInput.value);
    }
  });

  // 입력창에서 포커스가 벗어나면 수정 내용을 확정한다.
  editInput.addEventListener("blur", () => {
    editTodoText(todo.id, editInput.value);
  });
}

// ===== 단일 Todo 항목 DOM 생성 =====
// Todo 객체 하나를 받아 <li> 요소로 만들어 반환한다.
function createTodoElement(todo) {
  // 항목 컨테이너(li)
  const todoItem = document.createElement("li");
  todoItem.className = "todo-item";



  
  // 시작 상태 배경색 설정 문제 클로드로 해결
  // 시작(진행 중) 상태면 배경색 변경을 위한 클래스를 추가한다.
  if (todo.isStarted) {
    todoItem.classList.add("is-started");
  }

  // 시작 상태 배경색 설정 문제 클로드로 해결



  // 완료 상태면 취소선/배경 스타일을 위한 클래스를 추가한다.
  if (todo.isCompleted) {
    todoItem.classList.add("is-completed");
  }

  // Todo 텍스트
  const todoText = document.createElement("span");
  todoText.className = "todo-item__text";
  todoText.textContent = todo.text;

  // 동작 버튼들을 담는 영역
  const actions = document.createElement("div");
  actions.className = "todo-item__actions";

  // 시작 버튼
  const startButton = document.createElement("button");
  startButton.className = "todo-item__button todo-item__button--start";
  startButton.textContent = "시작";
  startButton.addEventListener("click", () => toggleTodoStarted(todo.id));
  
  // 수정 버튼
  const editButton = document.createElement("button");
  editButton.className = "todo-item__button todo-item__button--edit";
  editButton.textContent = "수정";
  editButton.addEventListener("click", () => enterEditMode(todoItem, todo));

  // 완료 버튼(완료/취소 토글)
  const completeButton = document.createElement("button");
  completeButton.className = "todo-item__button todo-item__button--complete";
  completeButton.textContent = todo.isCompleted ? "취소" : "완료";
  completeButton.addEventListener("click", () => toggleTodoCompleted(todo.id));

  // 삭제 버튼
  const deleteButton = document.createElement("button");
  deleteButton.className = "todo-item__button todo-item__button--delete";
  deleteButton.textContent = "삭제";
  deleteButton.addEventListener("click", () => deleteTodo(todo.id));

  // 버튼들을 동작 영역에 모으고, 항목에 텍스트와 동작 영역을 붙인다.
  actions.append(editButton, startButton, completeButton, deleteButton);
  todoItem.append(todoText, actions);

  return todoItem;
}

// ===== 현재 날짜와 필터에 맞는 Todo만 추려서 반환 =====
// 1) 선택된 날짜의 Todo만 고른 뒤, 2) currentFilter 상태로 한 번 더 거른다.
function getFilteredTodos() {
  // 1) 선택된 날짜에 해당하는 Todo만 남긴다.
  const selectedDateKey = getDateKey(selectedDate);
  const todosOfDate = todos.filter((todo) => todo.date === selectedDateKey);

  // 2) 상태 필터를 적용한다.
  switch (currentFilter) {
    case "none": // 진행 전: 시작되지 않은 항목만
      return todosOfDate.filter((todo) => !todo.isStarted);
    case "active": // 진행 중: 시작되었지만 완료되지 않은 항목만
      return todosOfDate.filter((todo) => todo.isStarted && !todo.isCompleted);
    case "completed": // 완료: 완료된 항목만
      return todosOfDate.filter((todo) => todo.isCompleted);
    default: // 전체: 해당 날짜의 모든 항목
      return todosOfDate;
  }
}

// ===== 선택된 날짜 표시 갱신 =====
// 헤더의 날짜 라벨을 현재 selectedDate 기준으로 다시 그린다.
function renderDate() {
  currentDateLabel.textContent = formatDateLabel(selectedDate);
}

// ===== 선택된 날짜 이동 =====
// offsetDays 만큼 날짜를 이동(-1: 이전, +1: 다음)하고 화면을 갱신한다.
function changeSelectedDate(offsetDays) {
  selectedDate.setDate(selectedDate.getDate() + offsetDays);
  renderDate();       // 날짜 라벨 갱신
  renderDatePicker(); // 드롭다운 선택기도 같은 날짜로 동기화
  renderTodos();      // 해당 날짜의 Todo 목록 갱신
}

// ===== 날짜 선택기: 단일 메뉴(숫자 목록) 생성 =====
// menuElement에 values 배열을 항목으로 채우고, 현재 값은 활성 표시한다.
// unit("year"|"month"|"day")과 value를 dataset에 담아 클릭 시 활용한다.
function renderPickerMenu(menuElement, unit, values, activeValue, formatLabel) {
  menuElement.innerHTML = "";
  values.forEach((value) => {
    const option = document.createElement("li");
    option.className = "date-picker__option";
    // 현재 선택된 값이면 강조 클래스를 추가한다.
    if (value === activeValue) {
      option.classList.add("is-active");
    }
    option.textContent = formatLabel(value);
    option.dataset.unit = unit;
    option.dataset.value = value;
    menuElement.appendChild(option);
  });
}

// ===== 날짜 선택기 전체 갱신 =====
// 트리거 라벨(연/월/일·요일)과 세 메뉴를 현재 selectedDate 기준으로 다시 그린다.
function renderDatePicker() {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1; // 0~11 → 1~12
  const day = selectedDate.getDate();
  const weekday = WEEKDAY_NAMES[selectedDate.getDay()];

  // 각 트리거에 현재 값을 표시한다.
  pickerYearTrigger.textContent = `${year}년`;
  pickerMonthTrigger.textContent = `${month}월`;
  pickerDayTrigger.textContent = `${day}일 (${weekday})`;

  // 메뉴(숫자 목록)를 다시 생성한다. 일 메뉴는 해당 연/월의 일수에 맞춘다.
  renderPickerMenu(pickerYearMenu, "year", getSelectableYears(), year, (v) => `${v}년`);
  renderPickerMenu(pickerMonthMenu, "month", range(1, 12), month, (v) => `${v}월`);
  renderPickerMenu(pickerDayMenu, "day", range(1, getDaysInMonth(year, month)), day, (v) => `${v}일`);
}

// ===== 열려 있는 모든 드롭다운 메뉴 닫기 =====
function closeAllPickerMenus() {
  datePicker
    .querySelectorAll(".date-picker__field.is-open")
    .forEach((field) => field.classList.remove("is-open"));
}

// ===== 드롭다운에서 연/월/일 값을 선택했을 때 처리 =====
// 선택한 단위에 맞춰 selectedDate를 갱신하고 화면 전체를 다시 그린다.
function selectDatePart(unit, value) {
  if (unit === "year") {
    // 연도 변경 시, 바뀐 연도의 해당 월 일수를 넘지 않도록 일자를 먼저 보정한다.
    const maxDay = getDaysInMonth(value, selectedDate.getMonth() + 1);
    selectedDate.setDate(Math.min(selectedDate.getDate(), maxDay));
    selectedDate.setFullYear(value);
  } else if (unit === "month") {
    // 월 변경 시, 바뀐 월의 일수를 넘지 않도록 일자를 먼저 보정한다.
    const maxDay = getDaysInMonth(selectedDate.getFullYear(), value);
    selectedDate.setDate(Math.min(selectedDate.getDate(), maxDay));
    selectedDate.setMonth(value - 1); // 1~12 → 0~11
  } else if (unit === "day") {
    selectedDate.setDate(value);
  }

  closeAllPickerMenus();
  renderDate();       // 헤더 날짜 라벨 갱신
  renderDatePicker(); // 선택기 라벨/메뉴 갱신
  renderTodos();      // 해당 날짜의 Todo 목록 갱신
}

// ===== 전체 Todo 목록 렌더링(Read) =====
// 현재 필터에 맞는 Todo를 기반으로 화면을 다시 그린다.
function renderTodos() {
  // 기존 목록을 비운 뒤 필터링된 상태로 새로 그린다.
  todoList.innerHTML = "";
  getFilteredTodos().forEach((todo) => {
    const todoElement = createTodoElement(todo);
    todoList.appendChild(todoElement);
  });
}

// ===== 이벤트 등록 =====
// 폼 제출(추가 버튼 클릭 또는 Enter) 시 Todo를 추가한다.
todoForm.addEventListener("submit", (event) => {
  event.preventDefault(); // 폼 기본 동작(새로고침) 방지
  addTodo(todoInput.value);
});

// 필터 탭 클릭 처리(이벤트 위임: 부모에 한 번만 등록)
todoFilters.addEventListener("click", (event) => {
  // 클릭 대상이 필터 버튼이 아니면 무시한다.
  const clickedButton = event.target.closest(".todo-filters__button");
  if (!clickedButton) return;

  // 선택된 필터 값으로 상태를 갱신한다.
  currentFilter = clickedButton.dataset.filter;

  // 모든 탭에서 활성 표시를 제거하고, 클릭한 탭에만 다시 추가한다.
  todoFilters
    .querySelectorAll(".todo-filters__button")
    .forEach((button) => button.classList.remove("is-active"));
  clickedButton.classList.add("is-active");

  // 변경된 필터 기준으로 목록을 다시 그린다.
  renderTodos();
});

// 이전/다음 날짜 버튼: 클릭 시 선택된 날짜를 하루씩 이동한다.
prevDayButton.addEventListener("click", () => changeSelectedDate(-1));
nextDayButton.addEventListener("click", () => changeSelectedDate(1));

// 날짜 선택기 클릭 처리(이벤트 위임: 컨테이너에 한 번만 등록)
datePicker.addEventListener("click", (event) => {
  // 1) 트리거를 눌렀으면 해당 메뉴를 토글한다(다른 메뉴는 닫음).
  const trigger = event.target.closest(".date-picker__trigger");
  if (trigger) {
    const field = trigger.closest(".date-picker__field");
    const willOpen = !field.classList.contains("is-open");
    closeAllPickerMenus();
    if (willOpen) {
      field.classList.add("is-open");
      // 현재 선택된 항목이 보이도록 메뉴를 스크롤한다.
      const activeOption = field.querySelector(".date-picker__option.is-active");
      if (activeOption) activeOption.scrollIntoView({ block: "nearest" });
    }
    return;
  }

  // 2) 메뉴의 숫자 항목을 눌렀으면 해당 값으로 날짜를 변경한다.
  const option = event.target.closest(".date-picker__option");
  if (option) {
    selectDatePart(option.dataset.unit, parseInt(option.dataset.value, 10));
  }
});

// 선택기 바깥을 클릭하면 열려 있는 메뉴를 닫는다.
document.addEventListener("click", (event) => {
  if (!event.target.closest(".date-picker")) {
    closeAllPickerMenus();
  }
});

// 첫 화면 렌더링(날짜 라벨 + 선택기 + 목록)
renderDate();
renderDatePicker();
renderTodos();
