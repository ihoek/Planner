# 📅 Planner - 일정 관리 애플리케이션

React와 Node.js를 사용한 모던한 일정 관리 웹 애플리케이션입니다.

## 🚀 프로젝트 구조

```
Planner/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/       # React 컴포넌트
│   │   │   ├── Login/        # 로그인 컴포넌트
│   │   │   ├── Signup/       # 회원가입 컴포넌트
│   │   │   └── Main/         # 메인 캘린더 컴포넌트
│   │   └── utils/            # 유틸리티 함수
│   │       └── axios.ts      # API 요청 설정
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Node.js 백엔드
│   ├── index.js             # Express 서버
│   ├── db.js                # Sequelize 데이터베이스 설정
│   └── package.json
└── README.md
```

## 🛠️ 기술 스택

### Frontend

- **React 18** - 사용자 인터페이스
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **React Router** - 라우팅
- **Axios** - HTTP 클라이언트
- **React Calendar** - 캘린더 컴포넌트
- **CSS3** - 스타일링

### Backend

- **Node.js** - 서버 런타임
- **Express.js** - 웹 프레임워크
- **Sequelize** - ORM
- **MySQL** - 데이터베이스
- **JWT** - 인증
- **CORS** - 크로스 오리진 설정

## 📦 설치 및 실행

### 1. 저장소 클론

```bash
git clone <repository-url>
cd Planner
```

### 2. Frontend 설정

```bash
cd frontend
npm install
```

### 3. Backend 설정

```bash
cd backend
npm install
```

### 4. 애플리케이션 실행

#### Backend 실행

```bash
cd backend
npm start
# 또는 개발 모드
npm run dev
```

#### Frontend 실행

```bash
cd frontend
npm run dev
```
