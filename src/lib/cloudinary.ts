/**
 * Cloudinary 이미지 업로드 유틸리티
 * Upload Widget을 사용하여 이미지를 업로드합니다.
 */

// Cloudinary 설정 (환경변수에서 읽어오거나 직접 설정)
export const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dnmwvwnrv'
export const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'restaurants_upload'

interface CloudinaryUploadResult {
  url: string
  thumbnail_url: string
  public_id: string
  secure_url: string
}

/**
 * Cloudinary Upload Widget 초기화 및 이미지 업로드
 */
export const openCloudinaryWidget = (
  callback: (result: CloudinaryUploadResult) => void,
  options: {
    multiple?: boolean
    folder?: string
    tags?: string[]
  } = {}
): void => {
  // Cloudinary Upload Widget 스크립트가 로드되지 않았으면 로드
  if (!(window as any).cloudinary) {
    const script = document.createElement('script')
    script.src = 'https://upload-widget.cloudinary.com/global/all.js'
    script.async = true
    script.onload = () => {
      openWidget()
    }
    document.body.appendChild(script)
  } else {
    openWidget()
  }

  function openWidget() {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: options.multiple !== false,
        folder: options.folder || 'reviews',
        tags: options.tags || [],
        clientAllowedFormats: ['image'],
        maxFileSize: 10000000, // 10MB
        maxImageWidth: 2000,
        maxImageHeight: 2000,
        cropping: false,
        showSkipCropButton: true,
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#90A0B3',
            tabIcon: '#0E2F5A',
            menuIcons: '#5A616A',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#0078FF',
            action: '#FF620C',
            inactiveTabIcon: '#0E2F5A',
            error: '#F44235',
            inProgress: '#0078FF',
            complete: '#20B832',
            sourceBg: '#E4EBF1',
          },
        },
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          const uploadResult: CloudinaryUploadResult = {
            url: result.info.secure_url,
            thumbnail_url: result.info.thumbnail_url || result.info.secure_url,
            public_id: result.info.public_id,
            secure_url: result.info.secure_url,
          }
          callback(uploadResult)
        }
      }
    )

    widget.open()
  }
}

/**
 * 이미지 URL을 변환 (리사이징, 최적화 등)
 */
export const transformCloudinaryUrl = (
  url: string,
  options: {
    width?: number
    height?: number
    crop?: 'fill' | 'fit' | 'scale' | 'thumb'
    quality?: 'auto' | number
  } = {}
): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url
  }

  const { width, height, crop = 'fill', quality = 'auto' } = options

  const transformations: string[] = []

  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (crop) transformations.push(`c_${crop}`)
  if (quality) transformations.push(`q_${quality}`)

  if (transformations.length === 0) {
    return url
  }

  // URL에서 upload/ 이후의 부분을 변환
  const uploadIndex = url.indexOf('/upload/')
  if (uploadIndex === -1) {
    return url
  }

  const before = url.substring(0, uploadIndex + 8) // "/upload/" 포함
  const after = url.substring(uploadIndex + 8)

  return `${before}${transformations.join(',')}/${after}`
}
