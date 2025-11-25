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

  // Search
  search: {
    viewAllResults: 'View all results',
    noResults: 'No results found',
    tryDifferent: 'Try a different search term',
    recentSearches: 'Recent searches',
    clearAll: 'Clear all',
    searchSuggestions: 'Search suggestions',
    popularSearches: 'Popular searches',
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

  // Home
  home: {
    heroTitle: 'Your Delicious Moments',
    heroSubtitle: 'Discover Hidden Gem Restaurants Across the Country',
    categories: 'Categories',
    allCategories: 'All',
    highRatedRestaurants: 'Top Rated Restaurants',
    popularRestaurants: 'Popular Restaurants',
    newRestaurants: 'New Restaurants',
    featuredRestaurants: 'Featured Restaurants',
    mostReviewedRestaurants: 'Most Reviewed Restaurants',
    mostViewedRestaurants: 'Most Viewed Restaurants',
    mostLikedRestaurants: 'Most Liked Restaurants',
    featuredTitle: 'Must-Visit Restaurants Right Now',
    exploreRestaurants: 'Explore Restaurants',
    selectedCategory: 'Selected Category',
    viewAll: 'View All',
    viewMore: 'View More',
    registeredRestaurants: 'Registered Restaurants',
    writtenReviews: 'Written Reviews',
    activeUsers: 'Active Users',
  },

  // Restaurant
  restaurant: {
    // Restaurant list page
    findTitle: 'Find Restaurants',
    findSubtitle: 'Search and explore restaurants across the country',
    searchPlaceholder: 'Search restaurants...',
    allCategories: 'All Categories',
    sort: 'Sort',
    sortByNewest: 'Newest',
    sortByRating: 'Highest Rated',
    sortByReviews: 'Most Reviewed',
    sortByViews: 'Most Viewed',
    totalCount: 'Total {{count}} restaurants',
    noResults: 'No results found. Try a different search term.',

    // Restaurant detail page
    reviews: 'Reviews',
    tags: 'Tags',
    info: 'Information',
    address: 'Address',
    phone: 'Phone',
    website: 'Website',
    hours: 'Hours',
    facilities: 'Facilities',
    services: 'Services',
    menu: 'Menu',
    photos: 'Photos',
    rating: 'Rating',
    reviewCount: 'Reviews',
    viewCount: 'Views',
    priceRange: 'Price Range',
    avgPrice: 'Avg per Person',
    parking: 'Parking',
    reservation: 'Reservation',
    delivery: 'Delivery',
    takeout: 'Takeout',
    contact: 'Contact',
    operations: 'Operations',
    copyAddress: 'Copy Address',
    showOnMap: 'Show on Map',
    share: 'Share',
    favorite: 'Add to Favorites',
    unfavorite: 'Remove from Favorites',
    addReview: 'Write Review',
    map: 'Map',

    // SNS / Links
    blog: 'Blog',
    instagram: 'Instagram',
    facebook: 'Facebook',
    youtube: 'YouTube',
    kakao: 'KakaoTalk',
    naverPlace: 'Naver Place',
    booking: 'Booking',
    naverBooking: 'Naver Booking',

    // Business Hours
    noHoursInfo: 'No business hours information available.',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun',
    noInfo: 'No information',
    closed: 'Closed',
    breakTime: 'Break Time',
    lastOrder: 'Last Order',
    regularHolidays: 'Regular Holidays',
    holidayNotice: 'Holiday Notice',

    // Facilities / Services
    parkingFacilities: 'Parking Facilities',
    amenities: 'Amenities',
    seatingInfo: 'Seating Information',
    reservationService: 'Reservation Service',
    kidsMenu: 'Kids Menu',
    reservationPhone: 'Reservation Phone',

    // Menu Types
    signatureMenu: 'Signature Menu',
    popularMenu: 'Popular Menu',
    allMenu: 'All Menu',
    newMenu: 'New',
    seasonalMenu: 'Seasonal',
    signature: 'Signature',
    noMenuInfo: 'No menu information available.',

    // Reviews
    firstReview: 'Be the first to write a review!',
  },

  // Event
  event: {
    title: 'Events',
    ongoing: 'Ongoing',
    ended: 'Ended',
    viewDetail: 'View Details',
    period: 'Period',
    noEvents: 'No ongoing events',
  },

  // Notice
  notice: {
    title: 'Notices',
    important: 'Important',
    viewDetail: 'View Details',
    noNotices: 'No notices available',
    postedAt: 'Posted',
  },

  // Terms
  terms: {
    title: 'Terms of Service',
    legalNotice: 'Legal Notice',
    legalNoticeContent: 'Only the Korean version of these Terms of Service has legal effect. Translations in other languages are for reference only, and in case of any discrepancy, the Korean original shall prevail.',
  },

  // Privacy
  privacy: {
    title: 'Privacy Policy',
    legalNotice: 'Legal Notice',
    legalNoticeContent: 'Only the Korean version of this Privacy Policy has legal effect. Translations in other languages are for reference only, and in case of any discrepancy, the Korean original shall prevail.',
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
    companyName: 'MZCube',
    description: 'Discover hidden gem restaurants across the country.\nShare your delicious moments with us.',
    quickLinks: 'Quick Links',
    policies: 'Policies',
    companyInfo: 'Company Info',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    contact: 'Contact Us',
    businessName: 'Business Name',
    businessNumber: 'Business Number',
    address: 'Address',
    adminEmail: 'Admin Email',
    notYetRegistered: 'Not Registered (Coming Soon)',
    copyright: '© 2025 MZCube. All rights reserved.',
  },

  // Contact Page
  contactPage: {
    title: 'Contact Us',
    subtitle: 'Have questions or concerns? Feel free to contact us anytime.',
    quickContact: 'Quick Contact',
    emailContact: 'Email Contact',
    kakaoContact: 'KakaoTalk Contact',
    emailContactDescription: 'Contact admin directly via email',
    kakaoContactDescription: 'Contact us through KakaoTalk channel',
    sendEmail: 'Send Email',
    openKakao: 'Open KakaoTalk',
    directContact: 'Direct Contact',
    directContactDescription: 'Fill out the form below and the admin will respond quickly.',
    name: 'Name',
    namePlaceholder: 'Enter your name',
    email: 'Email',
    emailPlaceholder: 'Enter email for reply',
    subject: 'Subject',
    subjectPlaceholder: 'Enter subject',
    message: 'Message',
    messagePlaceholder: 'Please describe your inquiry in detail',
    submit: 'Submit',
    sending: 'Sending...',
    successMessage: 'Your inquiry has been sent successfully. We will reply as soon as possible.',
    errorMessage: 'Failed to send inquiry. Please try again.',
    requiredField: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
  },
};
