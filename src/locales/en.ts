// English translations
import { TranslationKeys } from './ko';

export const en: TranslationKeys = {
  // Common
  common: {
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
  },

  // Navigation
  nav: {
    home: 'Home',
    restaurants: 'Restaurants',
    restaurantSearch: 'Find Restaurants',
    events: 'Events',
    notices: 'Notices',
    profile: 'Profile',
    myProfile: 'My Profile',
    login: 'Login',
    logout: 'Logout',
    settings: 'Settings',
    menu: 'Menu',
    search: 'Search',
    searchPlaceholder: 'Search restaurants...',
  },

  // Profile Page
  profile: {
    title: 'Profile',
    myFavorites: 'My Favorites',
    myReviews: 'My Reviews',
    settings: 'Settings',
    editProfile: 'Edit Profile',

    // Profile Info
    profileInfo: 'Profile Information',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    uploadImage: 'Upload Image',
    saveProfile: 'Save Profile',
    profilePhoto: 'Profile Photo',
    fileTypeInfo: 'JPG, PNG files (max 5MB)',
    phonePlaceholder: '010-1234-5678',
    emailReadOnly: 'Email cannot be changed',
    verified: 'Verified',
    saving: 'Saving...',

    // Settings
    languageSettings: 'Language Settings',
    themeSettings: 'Theme Settings',
    notificationSettings: 'Notification Settings',
    language: 'Language',
    theme: 'Theme',

    // Languages
    korean: '한국어',
    english: 'English',
    japanese: '日本語',
    chinese: '中文',

    // Theme
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    autoMode: 'Auto (System)',

    // Notifications
    pushNotifications: 'Push Notifications',
    emailNotifications: 'Email Notifications',
    pushNotificationDesc: 'Receive notifications about new events, comments, etc.',
    emailNotificationDesc: 'Receive important announcements via email',

    // Account
    accountManagement: 'Account Management',
    deleteAccount: 'Delete Account',
    cancelDeletion: 'Cancel Deletion',
    recoverAccount: 'Recover Account',
    recoverAccountButton: 'Recover Account',
    deletionPending: 'Account deletion pending',
    recoveryPeriodInfo: 'You can recover your account within 30 days. After recovery, you can use the service normally.',
    deletionWarningTitle: 'Important Notes About Account Deletion',
    deletionWarning1: 'A 30-day grace period is provided after deletion request.',
    deletionWarning2: 'You cannot log in during the grace period, but you can request account recovery.',
    deletionWarning3: 'After 30 days, all data will be permanently deleted and cannot be recovered.',
    deletionWarning4: 'All your activity including reviews and favorites will be deleted.',
    deletionDialogTitle: 'Are you sure you want to delete your account?',
    deletionReason: 'Reason for deletion (optional)',
    deletionReasonPlaceholder: 'Let us know why you are leaving to help us improve our service.',
    processing: 'Processing...',
    withdraw: 'Delete Account',

    // Messages
    profileUpdated: 'Profile updated successfully.',
    languageChanged: 'Language changed successfully.',
    themeChanged: 'Theme changed successfully.',
    notificationsChanged: 'Notification settings updated.',
    imageSizeError: 'Image size must be 5MB or less.',
    imageTypeError: 'Only image files can be uploaded.',
    imageUploaded: 'Image uploaded successfully.',
    imageUploadFailed: 'Failed to upload image.',
    profileUpdateFailed: 'Failed to update profile.',
    languageChangeFailed: 'Failed to change language.',
    themeChangeFailed: 'Failed to change theme.',
    notificationChangeFailed: 'Failed to update notification settings.',
    deletionRequestComplete: 'Account deletion requested. You can recover within 30 days.',
    deletionRequestFailed: 'An error occurred while requesting account deletion.',
    accountRecovered: 'Account recovered successfully.',
    accountRecoveryFailed: 'An error occurred while recovering account.',
    memoUpdateFailed: 'Failed to update memo.',
    reviewDeleteFailed: 'Failed to delete review.',
    reviewEditComingSoon: 'Review editing feature is coming soon.',
  },

  // Restaurant
  restaurant: {
    viewDetails: 'View Details',
    addReview: 'Write Review',
    favorite: 'Add to Favorites',
    unfavorite: 'Remove from Favorites',
    rating: 'Rating',
    reviews: 'Reviews',
    location: 'Location',
    hours: 'Hours',
    contact: 'Contact',
  },

  // Review
  review: {
    writeReview: 'Write Review',
    editReview: 'Edit Review',
    deleteReview: 'Delete Review',
    title: 'Title',
    content: 'Content',
    rating: 'Rating',
    anonymous: 'Post Anonymously',
    submit: 'Submit',
    minLength: 'Review must be at least 10 characters long.',
  },

  // Footer
  footer: {
    companyName: 'FoodieCube',
    description: 'Discover hidden gem restaurants across the country.\nShare your delicious moments with us.',
    quickLinks: 'Quick Links',
    policies: 'Policies',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    copyright: '© 2025 FoodieCube. All rights reserved.',
  },
};
