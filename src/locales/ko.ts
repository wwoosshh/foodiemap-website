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
    restaurantSearch: '맛집 찾기',
    events: '이벤트',
    notices: '공지사항',
    profile: '프로필',
    myProfile: '내 프로필',
    login: '로그인',
    logout: '로그아웃',
    settings: '설정',
    menu: '메뉴',
    search: '검색',
    searchPlaceholder: '맛집 검색...',
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
    profilePhoto: '프로필 사진',
    fileTypeInfo: 'JPG, PNG 파일 (최대 5MB)',
    phonePlaceholder: '010-1234-5678',
    emailReadOnly: '이메일은 변경할 수 없습니다',
    verified: '인증됨',
    saving: '저장 중...',

    // 설정
    languageSettings: '언어 설정',
    themeSettings: '테마 설정',
    notificationSettings: '알림 설정',
    language: '언어',
    theme: '테마',

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
    pushNotificationDesc: '새로운 이벤트, 댓글 등에 대한 알림을 받습니다',
    emailNotificationDesc: '중요한 공지사항을 이메일로 받습니다',

    // 계정
    accountManagement: '계정 관리',
    deleteAccount: '회원 탈퇴',
    cancelDeletion: '탈퇴 취소',
    recoverAccount: '계정 복구',
    recoverAccountButton: '계정 복구하기',
    deletionPending: '탈퇴 대기 중인 계정입니다',
    recoveryPeriodInfo: '30일 이내에 계정을 복구할 수 있습니다. 복구 후에는 정상적으로 서비스를 이용하실 수 있습니다.',
    deletionWarningTitle: '회원 탈퇴 시 주의사항',
    deletionWarning1: '탈퇴 요청 후 30일간 유예기간이 제공됩니다.',
    deletionWarning2: '유예기간 동안 로그인이 불가하며, 계정 복구를 요청할 수 있습니다.',
    deletionWarning3: '30일이 지나면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.',
    deletionWarning4: '작성한 리뷰, 즐겨찾기 등 모든 활동 내역이 삭제됩니다.',
    deletionDialogTitle: '정말 탈퇴하시겠습니까?',
    deletionReason: '탈퇴 사유 (선택사항)',
    deletionReasonPlaceholder: '탈퇴하시는 이유를 알려주시면 서비스 개선에 도움이 됩니다.',
    processing: '처리 중...',
    withdraw: '탈퇴하기',

    // 메시지
    profileUpdated: '프로필이 수정되었습니다.',
    languageChanged: '언어 설정이 변경되었습니다.',
    themeChanged: '테마 설정이 변경되었습니다.',
    notificationsChanged: '알림 설정이 변경되었습니다.',
    imageSizeError: '이미지 크기는 5MB 이하여야 합니다.',
    imageTypeError: '이미지 파일만 업로드 가능합니다.',
    imageUploaded: '이미지가 업로드되었습니다.',
    imageUploadFailed: '이미지 업로드에 실패했습니다.',
    profileUpdateFailed: '프로필 수정에 실패했습니다.',
    languageChangeFailed: '언어 설정 변경에 실패했습니다.',
    themeChangeFailed: '테마 설정 변경에 실패했습니다.',
    notificationChangeFailed: '알림 설정 변경에 실패했습니다.',
    deletionRequestComplete: '회원 탈퇴 요청이 완료되었습니다. 30일 이내에 복구하실 수 있습니다.',
    deletionRequestFailed: '회원 탈퇴 요청 중 오류가 발생했습니다.',
    accountRecovered: '계정이 성공적으로 복구되었습니다.',
    accountRecoveryFailed: '계정 복구 중 오류가 발생했습니다.',
    memoUpdateFailed: '메모 수정에 실패했습니다.',
    reviewDeleteFailed: '리뷰 삭제에 실패했습니다.',
    reviewEditComingSoon: '리뷰 수정 기능은 준비 중입니다.',
  },

  // 홈페이지
  home: {
    heroTitle: '당신의 맛있는 순간',
    heroSubtitle: '전국의 숨은 맛집을 찾아보세요',
    categories: '카테고리',
    allCategories: '전체',
    highRatedRestaurants: '별점이 높은 맛집',
    popularRestaurants: '인기 맛집',
    newRestaurants: '신규 맛집',
    featuredRestaurants: '추천 맛집',
  },

  // 이벤트
  event: {
    title: '이벤트',
    ongoing: '진행중',
    ended: '종료',
    viewDetail: '자세히 보기',
    period: '기간',
    noEvents: '진행중인 이벤트가 없습니다',
  },

  // 공지사항
  notice: {
    title: '공지사항',
    important: '중요',
    viewDetail: '자세히 보기',
    noNotices: '공지사항이 없습니다',
    postedAt: '게시일',
  },

  // 약관
  terms: {
    title: '이용약관',
    legalNotice: '법적 효력 안내',
    legalNoticeContent: '본 이용약관은 한국어 버전만 법적 효력을 가집니다. 다른 언어로 번역된 내용은 참고용이며, 한국어 원문과 차이가 있을 경우 한국어 원문이 우선합니다.',
  },

  // 개인정보처리방침
  privacy: {
    title: '개인정보처리방침',
    legalNotice: '법적 효력 안내',
    legalNoticeContent: '본 개인정보처리방침은 한국어 버전만 법적 효력을 가집니다. 다른 언어로 번역된 내용은 참고용이며, 한국어 원문과 차이가 있을 경우 한국어 원문이 우선합니다.',
  },

  // 맛집
  restaurant: {
    // 맛집 찾기 페이지
    findTitle: '맛집 찾기',
    findSubtitle: '전국의 맛집을 검색하고 탐색해보세요',
    searchPlaceholder: '맛집 검색...',
    allCategories: '전체 카테고리',
    sort: '정렬',
    sortByNewest: '최신순',
    sortByRating: '평점 높은순',
    sortByReviews: '리뷰 많은순',
    sortByViews: '조회수 많은순',
    totalCount: '총 {{count}}개의 맛집',
    noResults: '검색 결과가 없습니다. 다른 검색어를 시도해보세요.',

    // 맛집 상세 페이지
    reviews: '리뷰',
    tags: '태그',
    info: '정보',
    address: '주소',
    phone: '전화번호',
    website: '웹사이트',
    hours: '영업시간',
    facilities: '편의시설',
    services: '서비스',
    menu: '메뉴',
    photos: '사진',
    rating: '평점',
    reviewCount: '리뷰',
    viewCount: '조회',
    priceRange: '가격대',
    avgPrice: '1인 평균',
    parking: '주차',
    reservation: '예약',
    delivery: '배달',
    takeout: '포장',
    contact: '연락처',
    operations: '운영정보',
    copyAddress: '주소 복사',
    showOnMap: '지도에서 보기',
    share: '공유하기',
    favorite: '찜하기',
    unfavorite: '찜 해제',
    addReview: '리뷰 작성',
    map: '지도',

    // SNS / 링크
    blog: '블로그',
    instagram: '인스타그램',
    facebook: '페이스북',
    youtube: '유튜브',
    kakao: '카카오톡',
    naverPlace: '네이버 플레이스',
    booking: '예약',
    naverBooking: '네이버 예약',

    // 영업시간
    noHoursInfo: '영업시간 정보가 없습니다.',
    mon: '월',
    tue: '화',
    wed: '수',
    thu: '목',
    fri: '금',
    sat: '토',
    sun: '일',
    noInfo: '정보 없음',
    closed: '휴무',
    breakTime: '브레이크 타임',
    lastOrder: '라스트 오더',
    regularHolidays: '정기 휴무',
    holidayNotice: '휴무 안내',

    // 시설 / 서비스
    parkingFacilities: '주차 시설',
    amenities: '편의 시설',
    seatingInfo: '좌석 정보',
    reservationService: '예약 서비스',
    kidsMenu: '키즈 메뉴',
    reservationPhone: '예약 전화',

    // 메뉴 타입
    signatureMenu: '시그니처 메뉴',
    popularMenu: '인기 메뉴',
    allMenu: '전체 메뉴',
    newMenu: '신메뉴',
    seasonalMenu: '시즌 한정',
    signature: '시그니처',
    noMenuInfo: '등록된 메뉴가 없습니다.',

    // 리뷰
    firstReview: '첫 번째 리뷰를 작성해보세요!',
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

  // 푸터
  footer: {
    companyName: '맛집큐브',
    description: '전국의 숨은 맛집을 찾아드립니다.\n당신의 맛있는 순간을 함께하세요.',
    quickLinks: '바로가기',
    policies: '정책',
    terms: '이용약관',
    privacy: '개인정보처리방침',
    copyright: '© 2025 맛집큐브. All rights reserved.',
  },
};

export type TranslationKeys = typeof ko;
