import { NextResponse, type NextRequest } from "next/server";

// /api/todos/[id] 단건 프록시 — 수정(PUT)/토글/삭제(DELETE)를 FastAPI로 전달한다.
const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("환경변수 BACKEND_URL이 설정되지 않았습니다 (.env.local 확인).");
}

/**
 * 수정/토글 프록시. 부분 본문({ text, date } 또는 { is_completed })을 그대로 전달한다.
 * Next 16에서 동적 세그먼트 params는 Promise이므로 await로 푼다.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

/**
 * 삭제 프록시. 백엔드는 204(빈 본문)를 반환하므로 본문 없이 그대로 전달한다.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const res = await fetch(`${BACKEND_URL}/todos/${id}`, { method: "DELETE" });

  if (!res.ok) {
    // 실패 시(예: 404) 백엔드 에러 본문을 그대로 전달
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  return new NextResponse(null, { status: 204 });
}
