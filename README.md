# 한별 로봇 포트폴리오

스크롤하면 3D 로봇팔이 움직이고, 4개 프로젝트 구역을 누르면 작업 내용, 사진, 영상이 열리는 포트폴리오 사이트예요.
React와 react-three-fiber로 만들었어요.

## 내용 고치기: 이 3개 파일만 보면 돼요

| 파일 | 들어 있는 것 |
|---|---|
| `src/data/profile.js` | 이름, 소개, 연락처, 활동(NVIDIA AI Day Seoul), 첫 화면 영상 |
| `src/data/projects.js` | 프로젝트 4개의 글, 태그, 사진, 영상, 링크 |
| `public/media/…` | 사진·영상 파일을 넣는 폴더 |

### 사진 넣기
1. 사진을 `public/media/arm/01.jpg`처럼 프로젝트 폴더에 넣어요. 폴더는 `main`, `arm`, `driving`, `omx`, `activity`가 있어요.
2. `projects.js`의 `photos`에 아래 한 줄을 추가해요.
   ```js
   photos: [{ src: '/media/arm/01.jpg', caption: '그리퍼 테스트' }],
   ```

### 영상 넣기
- **유튜브** (추천: 사이트가 가벼워요)
  ```js
  videos: [{ type: 'youtube', id: 'dQw4w9WgXcQ', title: '시연 영상' }],
  ```
  `id`는 유튜브 주소에서 `watch?v=` 뒤의 글자예요.
- **영상 파일** (20MB 이하 권장)
  ```js
  videos: [{ type: 'file', src: '/media/arm/demo.mp4', title: '시연 영상' }],
  ```

### 힉스필드 영상 넣기
- **카드와 상세 패널 맨 위**: `projects.js`에서 해당 프로젝트의 `cover: '/media/arm/cover.mp4'`를 채워요. 그러면 3D 대신 이 영상이 반복 재생돼요.
- **첫 화면 전체**: `profile.js`에서 `heroVideo: '/media/hero.mp4'`를 채워요. 그러면 3D 로봇팔 대신 이 영상이 스크롤에 맞춰 앞뒤로 재생돼요.

## 내 컴퓨터에서 실행하기
```bash
npm install
```
```bash
npm run dev
```
화면에 나온 주소(보통 http://localhost:5173)를 브라우저에서 열어요.

## Vercel로 배포하기
1. 이 폴더를 GitHub 저장소에 올려요.
2. [vercel.com](https://vercel.com)에 GitHub 계정으로 로그인해요.
3. **Add New → Project**를 누르고 저장소를 골라 **Import**해요.
4. Framework Preset이 **Vite**로 자동 선택된 걸 확인하고 **Deploy**를 눌러요.
5. 1~2분 뒤 `프로젝트이름.vercel.app` 주소가 생겨요.

그다음부터는 GitHub에 수정한 파일을 올릴 때마다 Vercel이 자동으로 다시 배포해요.

## 폴더 구조
```
src/
  App.jsx                  화면 구성 (첫 화면 · 프로젝트 · 활동 · 소개 · 연락)
  components/ProjectPanel  프로젝트 상세 패널
  three/scenes.jsx         3D 장면 5개 (첫 화면 로봇팔, 메인, 로봇팔, 자율주행, OMX)
  three/parts.jsx          로봇 부품 (로봇팔, 주행 로봇, 모종, 조명)
  data/                    글과 사진 목록
```
