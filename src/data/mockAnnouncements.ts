import type { Announcement, SemesterInfo } from '@/types/announcement';

export const CURRENT_SEMESTER: SemesterInfo = {
  name: '115學年度第1學期',
  registrationStart: '2026-08-01',
  registrationEnd: '2026-09-15',
  semesterStart: '2026-09-07',
  semesterEnd: '2027-01-16',
};

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  // ── 全平台 ──
  {
    id: 'all_001',
    school: 'all',
    type: 'registration',
    title: '115學年度第1學期報名即將開始',
    content: '各校 115 學年度第 1 學期課程報名將於 2026 年 8 月 1 日（週六）上午 9:00 同步開放。熱門課程名額有限，建議提早登入各校系統完成報名。本平台課程資料同步更新中，最終資訊以各校官方系統為準。',
    date: '2026-07-15',
    important: true,
  },
  {
    id: 'all_002',
    school: 'all',
    type: 'general',
    title: '平台資料更新公告',
    content: '本平台課程資料已完成 115 學年度第 1 學期同步更新，共收錄南港、文山、松山三所社大共 18 門課程。如發現資料有誤，歡迎透過 GitHub Issue 回報，感謝您的協助。',
    date: '2026-06-20',
  },

  // ── 南港社大 ──
  {
    id: 'ng_ann_001',
    school: 'nangang',
    type: 'registration',
    title: '南港社大 115-1 學期報名時程公告',
    content: '南港社大 115 學年度第 1 學期選課報名時程如下：\n\n• 網路報名：2026/08/01（六）09:00 起\n• 現場報名：2026/08/04（二）至 2026/08/08（六）09:00–17:00\n• 退費申請截止：2026/09/21（一）\n\n報名請至南港社大課務系統（nangang.frog.tw），如有問題請致電 02-2783-5808。',
    date: '2026-07-01',
    important: true,
    link: 'https://nangang.frog.tw/',
  },
  {
    id: 'ng_ann_002',
    school: 'nangang',
    type: 'venue',
    title: '烹飪實習室設備更新完成通知',
    content: '南港社大烹飪實習室設備更新工程已順利完工，新增六組雙口爐台及排油煙系統，烹飪類課程上課環境大幅改善。相關課程自 115 學年度起於新設備空間授課，敬請期待。',
    date: '2026-06-10',
  },
  {
    id: 'ng_ann_003',
    school: 'nangang',
    type: 'general',
    title: '「硬筆書法入門」為本學期新開課程',
    content: '本學期新開設「硬筆書法入門」課程（週一晚間），由林文彬老師授課。此課程為南港社大首次開設書法類課程，名額尚有餘裕，歡迎有興趣的學員把握機會報名。',
    date: '2026-06-05',
  },

  // ── 文山社大 ──
  {
    id: 'ws_ann_001',
    school: 'wenshan',
    type: 'schedule',
    title: '文山社大開學說明會',
    content: '文山社大將於 2026 年 9 月 1 日（二）舉辦 115 學年度第 1 學期開學說明會，地點為文山社大多功能活動廳（B1 層），時間為上午 10:00–12:00。說明會將介紹課程資源、圖書館使用方式及學員活動，歡迎新舊學員踴躍參加。',
    date: '2026-08-01',
    important: true,
  },
  {
    id: 'ws_ann_002',
    school: 'wenshan',
    type: 'cancel',
    title: '「手縫布包入門」本學期停辦通知',
    content: '因謝淑婷老師健康因素，「手縫布包入門」課程（週六上午）本學期（115-1）暫停開設，預計 115 學年度第 2 學期（2027 年 2 月）恢復。已完成報名者將由教務組逐一致電通知退費事宜，造成不便敬請見諒。',
    date: '2026-06-15',
    important: true,
  },
  {
    id: 'ws_ann_003',
    school: 'wenshan',
    type: 'general',
    title: '文山社大學員圖書館服務升級',
    content: '文山社大圖書館自 115 學年度起開放全時段自助借還書服務（7:00–22:00），並新增電子書借閱平台（台灣雲端書庫），學員可持校卡登入借閱超過 60 萬冊電子書，歡迎多加利用。',
    date: '2026-05-20',
  },

  // ── 松山社大 ──
  {
    id: 'ss_ann_001',
    school: 'songshan',
    type: 'registration',
    title: '松山社大 115-1 選課系統開放時程',
    content: '松山社大 115 學年度第 1 學期選課系統將於 2026 年 8 月 1 日 09:00 起開放，可至 sscollege.org.tw 線上完成選課。本學期新增三門課程，包含「法語零基礎入門」及「馬克杯手拉坯體驗」（混成課程），歡迎有興趣的學員把握報名機會。',
    date: '2026-07-10',
    important: true,
    link: 'https://www.sscollege.org.tw/',
  },
  {
    id: 'ss_ann_002',
    school: 'songshan',
    type: 'venue',
    title: '陶藝教室整修完工通知',
    content: '松山社大陶藝教室整修工程於 2026 年 6 月底完工，新增兩座電窯及排氣系統，作品燒製品質大幅提升。本學期「馬克杯手拉坯體驗」課程將首先於全新設備環境中授課。',
    date: '2026-06-20',
  },
  {
    id: 'ss_ann_003',
    school: 'songshan',
    type: 'general',
    title: '「世界電影賞析」課程熱門預警',
    content: '「世界電影賞析」（週六晚間）為本學期最受歡迎課程之一，目前報名人數已達核定名額 80%，預計報名開始後數日內額滿。對此課程有興趣的學員請盡速於 8 月 1 日起完成報名，以免向隅。',
    date: '2026-07-18',
  },
];
