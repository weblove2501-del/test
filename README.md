# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## Local development (this project)

This repository includes a small mock auth server for local testing and the usual Vite dev server.

- Start the mock auth API server (listens on port 4000):

```bash
pnpm run start:api
```

- Start the front-end dev server:

```bash
pnpm dev
```

- Build for production:

```bash
pnpm build
```

Login test (mock server):

```bash
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

Notes:

- The mock API will return a token and user for `admin@example.com` with password `password`.
- `AppContext` first tries to call `/api/login`. If the endpoint is not available it falls back to local mock users.

---

## Admin System (MDI Layout Framework)

이 리포지토리는 엔터프라이즈용 MDI 레이아웃 프레임워크 샘플입니다. 주요 특징:

- GNB / LNB / MDI 탭 구조로 화면 구성
- 디자인과 로직의 엄격한 분리 (CSS Modules + tokens)
- 데이터 드리븐 테이블과 필터 구성
- API 주소는 `VITE_API_BASE`로 한 줄만 변경하면 전체가 전환됩니다

개발자 가이드:

- API 변경: `.env`에 `VITE_API_BASE`를 설정하세요.
- 더미 데이터: `public/mock` 폴더 내부의 json 파일을 확인하세요.
- 전역 상태: `src/context/AppContext.tsx`에서 탭/유저/로그인 로직을 확인하세요.

테스트 및 빌드:

```bash
pnpm install
pnpm dev    # 개발 서버: http://localhost:5173 (또는 다른 포트)
pnpm test   # Vitest
pnpm build  # 프로덕션 빌드
```

원하시면 이 README에 아키텍처 다이어그램, 컴포넌트 사용 예시, 또는 API 스펙 예시를 추가해드리겠습니다.

