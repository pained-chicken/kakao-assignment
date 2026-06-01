// ===== DOM 요소 참조 =====
const todoForm = document.getElementById("todo-form");       // 입력 폼
const todoInput = document.getElementById("todo-input");     // 텍스트 입력창
const formMessage = document.getElementById("form-message"); // 안내 메시지 영역
const todoList = document.getElementById("todo-list");       // Todo 목록(ul)
const todoFilters = document.getElementById("todo-filters"); // 필터 탭 영역

// ===== 상태(데이터) =====
// 모든 Todo를 객체 배열로 관리한다.
// 각 Todo는 { id, text, isCompleted } 형태를 가진다.
let todos = [];

// 각 Todo를 구분하기 위한 고유 id 생성용 카운터
let nextTodoId = 1;

// 현재 선택된 필터 상태("all" | "active" | "completed")
let currentFilter = "all";

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
  const newTodo = {
    id: nextTodoId++,
    text: trimmedText,
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

// ===== 현재 필터에 맞는 Todo만 추려서 반환 =====
// currentFilter 값에 따라 보여줄 Todo 목록을 걸러낸다.
function getFilteredTodos() {
  switch (currentFilter) {
    case "none": // 진행 전: 시작되지 않은 항목만
      return todos.filter((todo) => !todo.isStarted);
    case "active": // 진행 중: 시작되었지만 완료되지 않은 항목만
      return todos.filter((todo) => todo.isStarted && !todo.isCompleted);
    case "completed": // 완료: 완료된 항목만
      return todos.filter((todo) => todo.isCompleted);
    default: // 전체: 모든 항목
      return todos;
  }
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

// 첫 화면 렌더링
renderTodos();
