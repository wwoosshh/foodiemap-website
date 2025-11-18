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
    restaurantSearch: 'レストランを探す',
    events: 'イベント',
    notices: 'お知らせ',
    profile: 'プロフィール',
    myProfile: 'マイプロフィール',
    login: 'ログイン',
    logout: 'ログアウト',
    settings: '設定',
    menu: 'メニュー',
    search: '検索',
    searchPlaceholder: 'レストランを検索...',
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
    profilePhoto: 'プロフィール写真',
    fileTypeInfo: 'JPG、PNG ファイル (最大 5MB)',
    phonePlaceholder: '010-1234-5678',
    emailReadOnly: 'メールアドレスは変更できません',
    verified: '認証済み',
    saving: '保存中...',

    // 設定
    languageSettings: '言語設定',
    themeSettings: 'テーマ設定',
    notificationSettings: '通知設定',
    language: '言語',
    theme: 'テーマ',

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
    pushNotificationDesc: '新しいイベント、コメントなどの通知を受け取ります',
    emailNotificationDesc: '重要なお知らせをメールで受け取ります',

    // アカウント
    accountManagement: 'アカウント管理',
    deleteAccount: 'アカウント削除',
    cancelDeletion: '削除キャンセル',
    recoverAccount: 'アカウント復元',
    recoverAccountButton: 'アカウントを復元する',
    deletionPending: 'アカウント削除待ち',
    recoveryPeriodInfo: '30日以内にアカウントを復元できます。復元後は正常にサービスをご利用いただけます。',
    deletionWarningTitle: 'アカウント削除時の注意事項',
    deletionWarning1: '削除リクエスト後、30日間の猶予期間が提供されます。',
    deletionWarning2: '猶予期間中はログインできませんが、アカウント復元をリクエストできます。',
    deletionWarning3: '30日経過後、すべてのデータが完全に削除され、復元できません。',
    deletionWarning4: '作成したレビュー、お気に入りなど、すべての活動履歴が削除されます。',
    deletionDialogTitle: '本当に退会しますか？',
    deletionReason: '退会理由（任意）',
    deletionReasonPlaceholder: '退会理由を教えていただけると、サービス改善に役立ちます。',
    processing: '処理中...',
    withdraw: '退会する',

    // メッセージ
    profileUpdated: 'プロフィールが更新されました。',
    languageChanged: '言語設定が変更されました。',
    themeChanged: 'テーマ設定が変更されました。',
    notificationsChanged: '通知設定が更新されました。',
    imageSizeError: '画像サイズは5MB以下である必要があります。',
    imageTypeError: '画像ファイルのみアップロード可能です。',
    imageUploaded: '画像がアップロードされました。',
    imageUploadFailed: '画像のアップロードに失敗しました。',
    profileUpdateFailed: 'プロフィールの更新に失敗しました。',
    languageChangeFailed: '言語設定の変更に失敗しました。',
    themeChangeFailed: 'テーマ設定の変更に失敗しました。',
    notificationChangeFailed: '通知設定の更新に失敗しました。',
    deletionRequestComplete: 'アカウント削除がリクエストされました。30日以内に復元できます。',
    deletionRequestFailed: 'アカウント削除リクエスト中にエラーが発生しました。',
    accountRecovered: 'アカウントが正常に復元されました。',
    accountRecoveryFailed: 'アカウント復元中にエラーが発生しました。',
    memoUpdateFailed: 'メモの更新に失敗しました。',
    reviewDeleteFailed: 'レビューの削除に失敗しました。',
    reviewEditComingSoon: 'レビュー編集機能は準備中です。',
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

  // フッター
  footer: {
    companyName: 'フーディーキューブ',
    description: '全国の隠れた名店をご紹介します。\nあなたの美味しい瞬間を共有しましょう。',
    quickLinks: 'クイックリンク',
    policies: 'ポリシー',
    terms: '利用規約',
    privacy: 'プライバシーポリシー',
    copyright: '© 2025 フーディーキューブ. All rights reserved.',
  },
};
