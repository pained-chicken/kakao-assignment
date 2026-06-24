// 백엔드 Todo 모델과 1:1 대응 (backend/main.py의 TodoResponse 참고).
// 읽기 함수는 app/todos/actions.ts, 쓰기는 app/api/todos route handler에 있다.
export type Todo = {
  id: number;
  text: string;
  date: string | null;
  is_started: boolean;
  is_completed: boolean;
};
