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
    events: '活动',
    notices: '公告',
    profile: '个人资料',
    login: '登录',
    logout: '退出',
    settings: '设置',
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

    // 设置
    languageSettings: '语言设置',
    themeSettings: '主题设置',
    notificationSettings: '通知设置',

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

    // 账户
    accountManagement: '账户管理',
    deleteAccount: '删除账户',
    cancelDeletion: '取消删除',

    // 消息
    profileUpdated: '个人资料已更新。',
    languageChanged: '语言设置已更改。',
    themeChanged: '主题设置已更改。',
    notificationsChanged: '通知设置已更新。',
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
};
