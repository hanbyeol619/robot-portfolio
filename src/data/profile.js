// ─────────────────────────────────────────────
//  나의 소개 정보 — 이 파일만 고치면 사이트 글이 바뀌어요
// ─────────────────────────────────────────────
export const profile = {
  name: '한별',                 // ← 한글 이름
  nameEn: 'HANBYEOL',           // ← 영문 이름 (첫 화면 위쪽에 표시)
  role: 'Robot Engineer · Lv.1',
  year: '2026',

  // 첫 화면 아래쪽 한 줄 소개
  intro: '물류 현장에서 출발해, 지금은 로봇팔과 대화하는 법을 배우고 있어요. 매일 조금씩 경험치를 쌓는 중이에요.',

  // 첫 화면에서 스크롤할 때 한 줄씩 나타나는 '나의 원칙' (개수는 자유롭게)
  beliefs: [
    '처음이라서, 더 많이 묻고 더 빨리 배웁니다',
    '실패한 동작 하나하나가 다음 동작의 데이터가 됩니다',
    '보고, 따라 하고, 결국 스스로 해내는 로봇처럼 자랍니다',
  ],

  // 소개 섹션 문단
  about: [
    '물류센터와 사무실에서 일하며 매일 같은 동작, 같은 서류를 반복했습니다. 그때마다 "이건 더 쉬워질 수 있지 않을까?"를 생각했어요.',
    'AI를 활용한 웹 개발로 코딩을 처음 시작했고, 화면 속 코드를 넘어 현실에서 움직이는 것을 만들고 싶어 로봇 엔지니어의 길에 들어섰습니다. 묘목 이식 로봇팔과 자율주행 프로젝트로 기초를 다지고 있고, 다음 목표는 사람의 시연을 보고 배우는 로봇팔을 만드는 것이에요.',
    '아직 초보지만 배운 것을 바로 만들어 보고, 막히면 끝까지 파고듭니다. 제 목표는 함께 일하는 사람들의 하루가 조금 덜 고단해지는 것입니다.',
  ],

  strengths: ['물류 현장 경험', '사무 업무 개선', 'AI 활용 웹 개발', 'ROS 2', '로봇 제어', '문제 발견 → 개선'],

  // 연락처 (비워 두면 화면에 나오지 않아요)
  email: 'hb052532@gmail.com',
  github: '',     // 예: 'https://github.com/아이디'
  blog: '',       // 예: 'https://blog.naver.com/아이디'
  notion: 'https://app.notion.com/p/Robotics-Study-Wiki-3f99d1547a5380f5a5bfe05609e4f95e',
  notionLabel: 'Robotics Study Wiki',   // 화면에 보이는 이름

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
      desc: '로봇 엔지니어를 향해 막 첫발을 뗀 지금, 로봇 조작 기술의 최전선을 직접 보고 싶어 찾아갔어요. 묘목 이식 로봇팔을 만들며 관절 하나를 움직이는 것부터 배우고 있는 저에게, 시뮬레이션에서 학습한 로봇팔이 실제 현장에서 일하는 모습은 앞으로 걸어갈 길을 선명하게 보여줬어요.',
      highlights: [
        'Isaac Sim에서 산업용 로봇팔을 원격조작하는 시연을 보며, 제가 각도를 하나씩 맞추던 로봇팔도 시뮬레이션에서 먼저 연습시킬 수 있다는 걸 알게 됐어요.',
        '차량 도어를 샌딩하는 로봇팔은 힘과 압력까지 조절하며 일했어요. "집고 놓기" 다음에 도전할 목표가 생겼어요.',
        '사람이 원격조작으로 시연하고 모방학습으로 로봇을 가르치는 흐름(GR00T)은, 다음에 도전할 OMX 모방학습 프로젝트의 로드맵이 됐어요.',
        '물류 현장에서 일해 본 덕분에, 재활용품을 분류하는 로봇팔 데모가 어떤 현장 문제를 푸는지 바로 와닿았어요.',
      ],
      // 활동을 마치며 남기는 한 마디 (강조되어 보여요)
      takeaway: '아직 초보지만, 배운 만큼 바로 만들어 보는 속도와 끝까지 파고드는 끈기는 자신 있어요. 로봇을 다루는 엔지니어로 성장하는 과정을 이 포트폴리오에 계속 기록해 나갈게요.',
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
