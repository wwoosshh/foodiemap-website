// Chinese translations
import { TranslationKeys } from './ko';

export const zh: TranslationKeys = {
  // 通用
  common: {
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    close: '关闭',
    back: '返回',
    next: '下一步',
    loading: '加载中...',
    error: '发生错误',
    success: '成功',
  },

  // 导航
  nav: {
    home: '首页',
    restaurants: '餐厅',
    restaurantSearch: '查找餐厅',
    events: '活动',
    notices: '公告',
    profile: '个人资料',
    myProfile: '我的资料',
    login: '登录',
    logout: '退出',
    settings: '设置',
    menu: '菜单',
    search: '搜索',
    searchPlaceholder: '搜索餐厅...',
  },

  // 个人资料页面
  profile: {
    title: '个人资料',
    myFavorites: '我的收藏',
    myReviews: '我的评论',
    settings: '设置',
    editProfile: '编辑个人资料',

    // 个人信息
    profileInfo: '个人信息',
    name: '姓名',
    email: '邮箱',
    phone: '电话',
    uploadImage: '上传图片',
    saveProfile: '保存个人资料',
    profilePhoto: '个人照片',
    fileTypeInfo: 'JPG、PNG 文件（最大 5MB）',
    phonePlaceholder: '010-1234-5678',
    emailReadOnly: '邮箱不能更改',
    verified: '已验证',
    saving: '保存中...',

    // 设置
    languageSettings: '语言设置',
    themeSettings: '主题设置',
    notificationSettings: '通知设置',
    language: '语言',
    theme: '主题',

    // 语言
    korean: '한국어',
    english: 'English',
    japanese: '日本語',
    chinese: '中文',

    // 主题
    lightMode: '浅色模式',
    darkMode: '深色模式',
    autoMode: '跟随系统',

    // 通知
    pushNotifications: '推送通知',
    emailNotifications: '邮件通知',
    pushNotificationDesc: '接收有关新活动、评论等的通知',
    emailNotificationDesc: '通过电子邮件接收重要公告',

    // 账户
    accountManagement: '账户管理',
    deleteAccount: '删除账户',
    cancelDeletion: '取消删除',
    recoverAccount: '恢复账户',
    recoverAccountButton: '恢复账户',
    deletionPending: '账户删除待处理',
    recoveryPeriodInfo: '您可以在 30 天内恢复账户。恢复后，您可以正常使用服务。',
    deletionWarningTitle: '账户删除注意事项',
    deletionWarning1: '删除请求后将提供 30 天的宽限期。',
    deletionWarning2: '宽限期内无法登录，但可以请求恢复账户。',
    deletionWarning3: '30 天后，所有数据将被永久删除且无法恢复。',
    deletionWarning4: '包括评论和收藏在内的所有活动都将被删除。',
    deletionDialogTitle: '确定要删除账户吗？',
    deletionReason: '删除原因（可选）',
    deletionReasonPlaceholder: '请告诉我们您离开的原因，以帮助我们改进服务。',
    processing: '处理中...',
    withdraw: '删除账户',

    // 消息
    profileUpdated: '个人资料已更新。',
    languageChanged: '语言设置已更改。',
    themeChanged: '主题设置已更改。',
    notificationsChanged: '通知设置已更新。',
    imageSizeError: '图片大小必须小于或等于 5MB。',
    imageTypeError: '只能上传图片文件。',
    imageUploaded: '图片上传成功。',
    imageUploadFailed: '图片上传失败。',
    profileUpdateFailed: '个人资料更新失败。',
    languageChangeFailed: '语言更改失败。',
    themeChangeFailed: '主题更改失败。',
    notificationChangeFailed: '通知设置更新失败。',
    deletionRequestComplete: '账户删除请求已完成。您可以在 30 天内恢复。',
    deletionRequestFailed: '请求删除账户时出错。',
    accountRecovered: '账户恢复成功。',
    accountRecoveryFailed: '恢复账户时出错。',
    memoUpdateFailed: '备注更新失败。',
    reviewDeleteFailed: '评论删除失败。',
    reviewEditComingSoon: '评论编辑功能即将推出。',
  },

  // 主页
  home: {
    heroTitle: '您的美味时刻',
    heroSubtitle: '发现全国各地的隐藏美食',
    categories: '分类',
    allCategories: '全部',
    highRatedRestaurants: '高评分餐厅',
    popularRestaurants: '热门餐厅',
    newRestaurants: '新开餐厅',
    featuredRestaurants: '推荐餐厅',
    mostReviewedRestaurants: '评论最多餐厅',
    mostViewedRestaurants: '浏览最多餐厅',
    mostLikedRestaurants: '收藏最多餐厅',
    featuredTitle: '现在必去餐厅',
    exploreRestaurants: '探索餐厅',
    selectedCategory: '已选分类',
    viewAll: '查看全部',
    viewMore: '查看更多',
    registeredRestaurants: '注册餐厅',
    writtenReviews: '撰写评论',
    activeUsers: '活跃用户',
  },

  // 餐厅
  restaurant: {
    // 餐厅列表页面
    findTitle: '查找餐厅',
    findSubtitle: '搜索和探索全国各地的餐厅',
    searchPlaceholder: '搜索餐厅...',
    allCategories: '全部分类',
    sort: '排序',
    sortByNewest: '最新',
    sortByRating: '评分最高',
    sortByReviews: '评论最多',
    sortByViews: '浏览最多',
    totalCount: '共{{count}}家餐厅',
    noResults: '未找到结果。请尝试其他搜索词。',

    // 餐厅详情页面
    reviews: '评论',
    tags: '标签',
    info: '信息',
    address: '地址',
    phone: '电话',
    website: '网站',
    hours: '营业时间',
    facilities: '设施',
    services: '服务',
    menu: '菜单',
    photos: '照片',
    rating: '评分',
    reviewCount: '评论',
    viewCount: '浏览',
    priceRange: '价格区间',
    avgPrice: '人均',
    parking: '停车',
    reservation: '预订',
    delivery: '外卖',
    takeout: '打包',
    contact: '联系方式',
    operations: '营业信息',
    copyAddress: '复制地址',
    showOnMap: '在地图上查看',
    share: '分享',
    favorite: '添加收藏',
    unfavorite: '取消收藏',
    addReview: '写评论',
    map: '地图',

    // SNS / 链接
    blog: '博客',
    instagram: 'Instagram',
    facebook: 'Facebook',
    youtube: 'YouTube',
    kakao: 'KakaoTalk',
    naverPlace: 'Naver Place',
    booking: '预订',
    naverBooking: 'Naver预订',

    // 营业时间
    noHoursInfo: '无营业时间信息。',
    mon: '周一',
    tue: '周二',
    wed: '周三',
    thu: '周四',
    fri: '周五',
    sat: '周六',
    sun: '周日',
    noInfo: '无信息',
    closed: '休息',
    breakTime: '休息时间',
    lastOrder: '最后点单',
    regularHolidays: '定期休息',
    holidayNotice: '休息通知',

    // 设施 / 服务
    parkingFacilities: '停车设施',
    amenities: '便利设施',
    seatingInfo: '座位信息',
    reservationService: '预订服务',
    kidsMenu: '儿童菜单',
    reservationPhone: '预订电话',

    // 菜单类型
    signatureMenu: '招牌菜',
    popularMenu: '人气菜',
    allMenu: '全部菜单',
    newMenu: '新菜',
    seasonalMenu: '季节限定',
    signature: '招牌',
    noMenuInfo: '无菜单信息。',

    // 评论
    firstReview: '成为第一个写评论的人！',
  },

  // 活动
  event: {
    title: '活动',
    ongoing: '进行中',
    ended: '已结束',
    viewDetail: '查看详情',
    period: '期间',
    noEvents: '暂无进行中的活动',
  },

  // 公告
  notice: {
    title: '公告',
    important: '重要',
    viewDetail: '查看详情',
    noNotices: '暂无公告',
    postedAt: '发布日期',
  },

  // 服务条款
  terms: {
    title: '服务条款',
    legalNotice: '法律效力说明',
    legalNoticeContent: '本服务条款仅韩语版本具有法律效力。其他语言的翻译仅供参考，如有差异，以韩语原文为准。',
  },

  // 隐私政策
  privacy: {
    title: '隐私政策',
    legalNotice: '法律效力说明',
    legalNoticeContent: '本隐私政策仅韩语版本具有法律效力。其他语言的翻译仅供参考，如有差异，以韩语原文为准。',
  },

  // 评论
  review: {
    writeReview: '写评论',
    editReview: '编辑评论',
    deleteReview: '删除评论',
    title: '标题',
    content: '内容',
    rating: '评分',
    anonymous: '匿名发布',
    submit: '提交',
    minLength: '评论内容至少需要10个字符。',
  },

  // 页脚
  footer: {
    companyName: 'MZCube',
    description: '发现全国各地的隐藏美食。\n与我们分享您的美味时刻。',
    quickLinks: '快速链接',
    policies: '政策',
    companyInfo: '公司信息',
    terms: '服务条款',
    privacy: '隐私政策',
    contact: '联系我们',
    businessName: '商号',
    businessNumber: '营业执照号',
    address: '地址',
    adminEmail: '管理员邮箱',
    notYetRegistered: '未登记（即将登记）',
    copyright: '© 2025 MZCube. 保留所有权利。',
  },

  // 联系我们页面
  contactPage: {
    title: '联系我们',
    subtitle: '有疑问或问题吗？随时联系我们。',
    quickContact: '快速联系',
    emailContact: '邮件联系',
    kakaoContact: 'KakaoTalk联系',
    emailContactDescription: '直接通过邮件联系管理员',
    kakaoContactDescription: '通过KakaoTalk频道联系',
    sendEmail: '发送邮件',
    openKakao: '打开KakaoTalk',
    directContact: '网站内咨询',
    directContactDescription: '填写下面的表单，管理员将快速确认并回复。',
    name: '姓名',
    namePlaceholder: '请输入姓名',
    email: '邮箱',
    emailPlaceholder: '请输入接收回复的邮箱',
    subject: '主题',
    subjectPlaceholder: '请输入咨询主题',
    message: '咨询内容',
    messagePlaceholder: '请详细说明您的咨询内容',
    submit: '提交咨询',
    sending: '发送中...',
    successMessage: '咨询已成功发送。我们将尽快回复。',
    errorMessage: '咨询发送失败。请重试。',
    requiredField: '必填项',
    invalidEmail: '请输入有效的邮箱地址',
  },
};
