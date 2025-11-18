// Japanese translations
import { TranslationKeys } from './ko';

export const ja: TranslationKeys = {
  // 共通
  common: {
    save: '保存',
    cancel: 'キャンセル',
    confirm: '確認',
    delete: '削除',
    edit: '編集',
    close: '閉じる',
    back: '戻る',
    next: '次へ',
    loading: '読み込み中...',
    error: 'エラーが発生しました',
    success: '成功しました',
  },

  // ナビゲーション
  nav: {
    home: 'ホーム',
    restaurants: 'レストラン',
    events: 'イベント',
    notices: 'お知らせ',
    profile: 'プロフィール',
    login: 'ログイン',
    logout: 'ログアウト',
    settings: '設定',
  },

  // プロフィールページ
  profile: {
    title: 'プロフィール',
    myFavorites: 'お気に入り',
    myReviews: 'レビュー',
    settings: '設定',
    editProfile: 'プロフィール編集',

    // プロフィール情報
    profileInfo: 'プロフィール情報',
    name: '名前',
    email: 'メール',
    phone: '電話番号',
    uploadImage: '画像アップロード',
    saveProfile: 'プロフィール保存',

    // 設定
    languageSettings: '言語設定',
    themeSettings: 'テーマ設定',
    notificationSettings: '通知設定',

    // 言語
    korean: '한국어',
    english: 'English',
    japanese: '日本語',
    chinese: '中文',

    // テーマ
    lightMode: 'ライトモード',
    darkMode: 'ダークモード',
    autoMode: 'システム設定に従う',

    // 通知
    pushNotifications: 'プッシュ通知',
    emailNotifications: 'メール通知',

    // アカウント
    accountManagement: 'アカウント管理',
    deleteAccount: 'アカウント削除',
    cancelDeletion: '削除キャンセル',

    // メッセージ
    profileUpdated: 'プロフィールが更新されました。',
    languageChanged: '言語設定が変更されました。',
    themeChanged: 'テーマ設定が変更されました。',
    notificationsChanged: '通知設定が更新されました。',
  },

  // レストラン
  restaurant: {
    viewDetails: '詳細を見る',
    addReview: 'レビューを書く',
    favorite: 'お気に入りに追加',
    unfavorite: 'お気に入りから削除',
    rating: '評価',
    reviews: 'レビュー',
    location: '場所',
    hours: '営業時間',
    contact: '連絡先',
  },

  // レビュー
  review: {
    writeReview: 'レビューを書く',
    editReview: 'レビューを編集',
    deleteReview: 'レビューを削除',
    title: 'タイトル',
    content: '内容',
    rating: '評価',
    anonymous: '匿名で投稿',
    submit: '投稿',
    minLength: 'レビューは10文字以上で入力してください。',
  },
};
