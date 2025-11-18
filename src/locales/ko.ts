// 한국어 번역
export const ko = {
  // 공통
  common: {
    save: '저장',
    cancel: '취소',
    confirm: '확인',
    delete: '삭제',
    edit: '수정',
    close: '닫기',
    back: '뒤로',
    next: '다음',
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    success: '성공했습니다',
  },

  // 네비게이션
  nav: {
    home: '홈',
    restaurants: '맛집',
    events: '이벤트',
    notices: '공지사항',
    profile: '프로필',
    login: '로그인',
    logout: '로그아웃',
    settings: '설정',
  },

  // 프로필 페이지
  profile: {
    title: '프로필',
    myFavorites: '찜한 맛집',
    myReviews: '내 리뷰',
    settings: '설정',
    editProfile: '프로필 수정',

    // 프로필 정보
    profileInfo: '프로필 정보',
    name: '이름',
    email: '이메일',
    phone: '전화번호',
    uploadImage: '이미지 업로드',
    saveProfile: '프로필 저장',

    // 설정
    languageSettings: '언어 설정',
    themeSettings: '테마 설정',
    notificationSettings: '알림 설정',

    // 언어
    korean: '한국어',
    english: 'English',
    japanese: '日本語',
    chinese: '中文',

    // 테마
    lightMode: '라이트 모드',
    darkMode: '다크 모드',
    autoMode: '시스템 설정 따르기',

    // 알림
    pushNotifications: '푸시 알림',
    emailNotifications: '이메일 알림',

    // 계정
    accountManagement: '계정 관리',
    deleteAccount: '회원 탈퇴',
    cancelDeletion: '탈퇴 취소',

    // 메시지
    profileUpdated: '프로필이 수정되었습니다.',
    languageChanged: '언어 설정이 변경되었습니다.',
    themeChanged: '테마 설정이 변경되었습니다.',
    notificationsChanged: '알림 설정이 변경되었습니다.',
  },

  // 맛집
  restaurant: {
    viewDetails: '상세보기',
    addReview: '리뷰 작성',
    favorite: '찜하기',
    unfavorite: '찜 해제',
    rating: '평점',
    reviews: '리뷰',
    location: '위치',
    hours: '영업시간',
    contact: '연락처',
  },

  // 리뷰
  review: {
    writeReview: '리뷰 작성',
    editReview: '리뷰 수정',
    deleteReview: '리뷰 삭제',
    title: '제목',
    content: '내용',
    rating: '평점',
    anonymous: '익명으로 작성',
    submit: '등록',
    minLength: '리뷰 내용은 최소 10자 이상 작성해주세요.',
  },
};

export type TranslationKeys = typeof ko;
