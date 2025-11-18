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

  // 餐厅
  restaurant: {
    viewDetails: '查看详情',
    addReview: '写评论',
    favorite: '添加收藏',
    unfavorite: '取消收藏',
    rating: '评分',
    reviews: '评论',
    location: '位置',
    hours: '营业时间',
    contact: '联系方式',
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
    terms: '服务条款',
    privacy: '隐私政策',
    copyright: '© 2025 MZCube. 保留所有权利。',
  },
};
