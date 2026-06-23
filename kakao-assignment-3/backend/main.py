from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, ConfigDict

# DB 설정
DATABASE_URL = "sqlite:///./todos.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# DB 모델 (테이블 구조 정의)
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)          # 할 일 내용
    date = Column(String, nullable=True)           # 마감/표시 날짜
    is_started = Column(Boolean, default=False, nullable=False)    # 시작 여부
    is_completed = Column(Boolean, default=False, nullable=False)  # 완료 여부


# Pydantic 스키마 (요청/응답 데이터 구조 정의)
class TodoCreate(BaseModel):
    text: str
    date: str | None = None


class TodoUpdate(BaseModel):
    # PUT에서 보낸 필드만 부분 수정 (set 되지 않은 필드는 변경하지 않음)
    text: str | None = None
    date: str | None = None
    is_started: bool | None = None
    is_completed: bool | None = None


class TodoResponse(BaseModel):
    id: int
    text: str
    date: str | None
    is_started: bool
    is_completed: bool

    # ORM 객체를 그대로 응답 모델로 직렬화할 수 있게 함
    model_config = ConfigDict(from_attributes=True)


# 테이블 생성
Base.metadata.create_all(bind=engine)

# FastAPI 앱 생성
app = FastAPI(title="Todo API")

# FastAPI 앱 미들웨어 및 CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js 프론트엔드
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# DB 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 엔드포인트 구현

# 1. 전체 Todo 목록 조회
@app.get("/todos", response_model=list[TodoResponse])
def list_todos(db: Session = Depends(get_db)):
    return db.query(Todo).all()


# 2. 새로운 Todo 생성
@app.post("/todos", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    new_todo = Todo(text=todo.text, date=todo.date)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo


# 3. id별 Todo 수정
@app.put("/todos/{id}", response_model=TodoResponse)
def update_todo(id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == id).first()
    if db_todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")

    # 요청 본문에 실제로 담겨 온 필드만 반영
    for field, value in todo.model_dump(exclude_unset=True).items():
        setattr(db_todo, field, value)

    db.commit()
    db.refresh(db_todo)
    return db_todo


# 4. id별 Todo 삭제
@app.delete("/todos/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == id).first()
    if db_todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")

    db.delete(db_todo)
    db.commit()
    return None
