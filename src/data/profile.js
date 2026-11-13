// ─────────────────────────────────────────────
//  나의 소개 정보 — 이 파일만 고치면 사이트 글이 바뀌어요
// ─────────────────────────────────────────────
export const profile = {
  name: '한별',                 // ← 한글 이름
  nameEn: 'HANBYEOL',           // ← 영문 이름 (첫 화면 위쪽에 표시)
  role: '로봇 · AI 프로젝트 메이커',
  year: '2026',

  // 첫 화면 아래쪽 한 줄 소개
  intro: '사람의 반복 노동을 로봇의 정확한 동작으로 바꾸는 일을 합니다.',

  // 소개 섹션 문단
  about: [
    '물류센터와 사무실에서 일하며 매일 같은 동작, 같은 서류를 반복했습니다. 그때마다 "이건 더 쉬워질 수 있지 않을까?"를 생각했어요.',
    '비개발자로 시작해 AI를 도구 삼아 로봇팔, 자율주행, 모방학습까지 직접 부딪히며 배웠습니다. 제 목표는 함께 일하는 사람들의 하루가 조금 덜 고단해지는 것입니다.',
  ],

  strengths: ['물류 현장 경험', '사무 업무 개선', 'AI 활용 개발', 'ROS 2', '로봇 제어', '문제 발견 → 개선'],

  // 연락처 (비워 두면 화면에 나오지 않아요)
  email: '',      // 예: 'hello@example.com'
  github: '',     // 예: 'https://github.com/아이디'
  blog: '',       // 예: 'https://blog.naver.com/아이디'

  // 힉스필드(Higgsfield) 등으로 만든 첫 화면 영상
  // public/media/hero.mp4 에 넣고 아래를 '/media/hero.mp4' 로 바꾸면
  // 3D 로봇팔 대신 이 영상이 스크롤에 맞춰 재생돼요.
  heroVideo: '',

  // ─────────────────────────────────────────────
  //  활동 (행사 참가, 교육, 수상 등)
  //  사진: public/media/activity/ 폴더에 넣고 groups 안의 photos 에 'media/activity/파일이름.jpg' 로 추가해요
  // ─────────────────────────────────────────────
  activities: [
    {
      title: 'NVIDIA AI Day Seoul 2026',
      date: '2026.11.09',
      place: '서울',
      desc: 'Physical AI와 로보틱스, 에이전트 AI의 최신 흐름을 현장에서 들었어요. 특히 사람이 원격조작으로 시연 데이터를 모으고 모방학습으로 로봇을 가르치는 GR00T 개발 흐름이 제 OMX 모방학습 프로젝트와 같은 방향이라 반가웠어요.',
      highlights: [
        'Physical AI: 시뮬레이션(Isaac Sim · Isaac Lab)에서 먼저 학습하고 실제 로봇으로 옮기는 흐름',
        '원격조작 → 모방학습 → 평가 → 배포로 이어지는 로봇 학습 과정',
        '여러 AI 에이전트가 함께 일하는 Agentic AI와 이를 위한 추론 인프라',
        'Sim 영상을 실사처럼 바꿔 로봇 학습 데이터를 늘리는 방법과, 작업 영상을 표준 작업서(SOP)와 비교해 단계와 누락을 채점하는 산업 현장 사례',
      ],
      // 사진 · 영상 묶음: 탭으로 나뉘어 보여요. 영상(.mp4)도 같은 방식으로 넣고 poster(미리보기 사진)를 붙일 수 있어요
      groups: [
        {
          name: '현장 · 데모',
          photos: [
            { src: 'media/activity/ai-day-01.jpg', caption: 'AI Day Seoul 2026 입장 명찰과 기념품' },
            { src: 'media/activity/humanoid.mp4', caption: '로비에서 관람객을 맞이하는 휴머노이드 로봇', poster: 'media/activity/humanoid-poster.jpg' },
            { src: 'media/activity/ai-day-booth.jpg', caption: '부스 데모: 재활용품을 분류하는 로봇팔 (멀티 에이전트 콘솔)' },
            { src: 'media/activity/ai-day-02.jpg', caption: '행사장 메인 홀' },
          ],
        },
        {
          name: '로보틱스 세션',
          photos: [
            { src: 'media/activity/ai-day-03.jpg', caption: '키노트: The State and Future of Physical AI (Deepu Talla)' },
            { src: 'media/activity/ai-day-04.jpg', caption: 'GR00T 개발 흐름: 원격조작 데이터 수집 → 모방학습 → 평가 → 배포' },
            { src: 'media/activity/ai-day-05.jpg', caption: 'Isaac Sim에서 산업용 로봇팔 원격조작 시연' },
            { src: 'media/activity/sanding.mp4', caption: '로봇 시뮬레이터에서 진행한 차량 도어 샌딩 작업 발표', poster: 'media/activity/sanding-poster.jpg' },
            { src: 'media/activity/ai-day-06.jpg', caption: 'Isaac Lab으로 시뮬레이션한 로봇팔 차량 도어 샌딩' },
            { src: 'media/activity/ai-day-07.jpg', caption: 'Cosmos 3 활용: 비전 추론, 데이터 생성, 월드 시뮬레이션' },
            { src: 'media/activity/ai-day-08.jpg', caption: 'AI로 생성한 환경에서 걷기를 배우는 소형 로봇들' },
            { src: 'media/activity/ai-day-09.jpg', caption: '세션: Agentic AI — Reasoning, NIM, Multi-Agent Orchestration (Jonathan Cohen)' },
            { src: 'media/activity/ai-day-10.jpg', caption: 'DexBench: 로봇 정책의 일반화 능력을 평가하는 벤치마크' },
            { src: 'media/activity/ai-day-11.jpg', caption: 'Sim → 실사 데이터 엔진: 구조와 라벨은 Sim, 외형은 Cosmos3' },
            { src: 'media/activity/ai-day-12.jpg', caption: 'Isaac Sim 하네스 기반 3단계 로봇 학습 데이터 생성' },
            { src: 'media/activity/ai-day-13.jpg', caption: '모범 영상 1편으로 표준 작업서를 만들고 작업 영상을 단계별로 채점' },
          ],
        },
      ],
    },
  ],
}
