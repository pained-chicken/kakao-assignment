import { NextResponse, type NextRequest } from "next/server";

// /api/todos 컬렉션 프록시 — 브라우저(클라이언트)의 HTTP 요청을 받아 FastAPI로 전달한다.
// 서버에서 실행되므로 BACKEND_URL(서버 전용 env)을 직접 읽고 CORS 영향도 받지 않는다.
const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("환경변수 BACKEND_URL이 설정되지 않았습니다 (.env.local 확인).");
}

/**
 * 목록 조회 프록시. UI 읽기 경로는 Server Action(getTodos)이지만,
 * 외부/테스트용으로 완전한 프록시를 제공하기 위해 GET도 둔다.
 */
export async function GET() {
  const res = await fetch(`${BACKEND_URL}/todos`, { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

/**
 * 생성 프록시. 클라이언트가 보낸 { text, date } 본문을 그대로 FastAPI로 전달하고,
 * 백엔드 응답(201 + 생성된 Todo)을 status까지 그대로 반환한다.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
