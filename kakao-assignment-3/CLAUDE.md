# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 안내서입니다.

## ⚠️ 중요: Next.js 버전

이 프로젝트는 **Next.js 16.2**, **React 19**, **Tailwind CSS v4**를 사용합니다. 대부분의 학습 데이터보다 최신 버전이라 API, 관례, 파일 구조에 깨지는 변경(breaking change)이 있습니다. `frontend/AGENTS.md`에 따라, **Next.js 코드를 작성하기 전에 반드시 `frontend/node_modules/next/dist/docs/`의 관련 문서를 먼저 읽고**, 폐기 예정(deprecation) 안내를 따르세요. 옛날 Next.js / React / Tailwind 패턴을 그대로 가정하지 마세요.

## 디렉터리 구조

이 디렉터리(`kakao-assignment-3`)는 카카오 테크 캠퍼스 과제 모노레포의 3주차입니다 (형제 폴더: `../kakao-assignment-1` 순수 HTML/JS, `../kakao-assignment-2` Vite). git 저장소는 모노레포 상위 폴더에 하나만 있습니다. 두 부분으로 구성됩니다:

- `frontend/` — Next.js 16 App Router 앱 (실제 작업 중인 코드).
- `backend/` — 비어 있는 자리표시자 폴더. 과제 루트에 Python 3.14 가상환경(`.venv/`, uv로 관리)이 준비되어 있지만 아직 어떤 코드와도 연결되어 있지 않습니다.

## 명령어

모든 프론트엔드 명령어는 `frontend/` 안에서 실행합니다:

```bash
npm run dev      # 개발 서버 (Turbopack), http://localhost:3000
npm run build    # 프로덕션 빌드
npm run start    # 빌드된 결과물 서빙
npm run lint     # ESLint (eslint-config-next: core-web-vitals + typescript)
```

아직 테스트 러너는 설정되어 있지 않습니다.

## 관례

- **Tailwind v4**: `tailwind.config.js` 파일이 없습니다. 테마 토큰은 `app/globals.css`에서 `@import "tailwindcss"`와 `@theme inline { ... }`로 CSS 안에 정의합니다. PostCSS는 `@tailwindcss/postcss`를 사용합니다.
- **경로 별칭(alias)**: `@/*`는 `frontend/` 루트를 가리킵니다 (`tsconfig.json` 참고).
- TypeScript `strict` 모드가 켜져 있습니다.
- `frontend/CLAUDE.md`는 단순히 `frontend/AGENTS.md`(위의 Next.js 버전 경고)를 다시 불러옵니다.
