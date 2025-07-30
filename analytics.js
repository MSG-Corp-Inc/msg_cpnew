/* Google Analytics 4 設定ファイル
   MSG株式会社 - トラッキングとイベント管理 */

// GA4設定
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // 実際のMeasurement IDに置き換えてください

// Google Analytics 4の初期化
class Analytics {
  constructor() {
    this.isInitialized = false;
    this.init();
  }
  
  // GA4の初期化
  init() {
    // gtag関数の定義
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      dataLayer.push(arguments);
    };
    
    // 初期設定
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      // プライバシー設定
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      
      // カスタム設定
      custom_map: {
        'custom_parameter_1': 'form_type',
        'custom_parameter_2': 'user_type'
      }
    });
    
    this.isInitialized = true;
    console.log('Google Analytics 4 initialized');
  }
  
  // ページビューの追跡
  trackPageView(page_title, page_location) {
    if (!this.isInitialized) return;
    
    gtag('event', 'page_view', {
      page_title: page_title || document.title,
      page_location: page_location || window.location.href
    });
  }
  
  // カスタムイベントの追跡
  trackEvent(action, category, label = null, value = null) {
    if (!this.isInitialized) return;
    
    const eventData = {
      event_category: category,
      event_label: label,
      value: value
    };
    
    // null値を除去
    Object.keys(eventData).forEach(key => {
      if (eventData[key] === null) {
        delete eventData[key];
      }
    });
    
    gtag('event', action, eventData);
  }
  
  // フォーム送信の追跡
  trackFormSubmission(formType, success = true) {
    if (!this.isInitialized) return;
    
    gtag('event', success ? 'form_submit_success' : 'form_submit_error', {
      event_category: 'form',
      event_label: formType,
      form_type: formType,
      success: success
    });
  }
  
  // スクロール深度の追跡
  trackScrollDepth(percent) {
    if (!this.isInitialized) return;
    
    gtag('event', 'scroll', {
      event_category: 'engagement',
      event_label: `${percent}%`,
      value: percent
    });
  }
  
  // ダウンロードの追跡
  trackDownload(fileName, fileType) {
    if (!this.isInitialized) return;
    
    gtag('event', 'file_download', {
      event_category: 'download',
      event_label: fileName,
      file_name: fileName,
      file_extension: fileType
    });
  }
  
  // 外部リンククリックの追跡
  trackOutboundLink(url, linkText) {
    if (!this.isInitialized) return;
    
    gtag('event', 'click', {
      event_category: 'outbound',
      event_label: url,
      link_text: linkText,
      link_url: url
    });
  }
  
  // 動画再生の追跡
  trackVideoPlay(videoTitle, videoUrl) {
    if (!this.isInitialized) return;
    
    gtag('event', 'video_play', {
      event_category: 'video',
      event_label: videoTitle,
      video_title: videoTitle,
      video_url: videoUrl
    });
  }
  
  // 検索の追跡
  trackSearch(searchTerm, resultCount = null) {
    if (!this.isInitialized) return;
    
    gtag('event', 'search', {
      search_term: searchTerm,
      result_count: resultCount
    });
  }
  
  // タイミングの追跡
  trackTiming(category, variable, time, label = null) {
    if (!this.isInitialized) return;
    
    gtag('event', 'timing_complete', {
      name: variable,
      value: time,
      event_category: category,
      event_label: label
    });
  }
  
  // エラーの追跡
  trackError(errorMessage, errorType = 'javascript') {
    if (!this.isInitialized) return;
    
    gtag('event', 'exception', {
      description: errorMessage,
      fatal: false,
      error_type: errorType
    });
  }
  
  // ユーザープロパティの設定
  setUserProperty(propertyName, propertyValue) {
    if (!this.isInitialized) return;
    
    gtag('config', GA_MEASUREMENT_ID, {
      custom_map: {
        [propertyName]: propertyValue
      }
    });
  }
}

// Analytics自動初期化クラス
class AutoTracker {
  constructor(analytics) {
    this.analytics = analytics;
    this.scrollDepthTracked = new Set();
    this.init();
  }
  
  init() {
    this.setupScrollTracking();
    this.setupFormTracking();
    this.setupLinkTracking();
    this.setupErrorTracking();
  }
  
  // スクロール深度の自動追跡
  setupScrollTracking() {
    let ticking = false;
    
    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      // 25%, 50%, 75%, 90%のマイルストーンで追跡
      const milestones = [25, 50, 75, 90];
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !this.scrollDepthTracked.has(milestone)) {
          this.analytics.trackScrollDepth(milestone);
          this.scrollDepthTracked.add(milestone);
        }
      });
      
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(trackScroll);
        ticking = true;
      }
    });
  }
  
  // フォーム送信の自動追跡
  setupFormTracking() {
    document.addEventListener('submit', (event) => {
      const form = event.target;
      const formId = form.id || 'unknown_form';
      
      // フォーム送信の追跡
      this.analytics.trackEvent('form_start', 'form', formId);
      
      // フォームの詳細情報を収集
      const formData = new FormData(form);
      const fieldCount = formData.keys() ? Array.from(formData.keys()).length : 0;
      
      this.analytics.trackEvent('form_submit_attempt', 'form', formId, fieldCount);
    });
  }
  
  // リンククリックの自動追跡
  setupLinkTracking() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link) return;
      
      const href = link.href;
      const linkText = link.textContent.trim();
      
      // 外部リンクの判定
      if (href && this.isExternalLink(href)) {
        this.analytics.trackOutboundLink(href, linkText);
      }
      
      // ダウンロードリンクの判定
      if (href && this.isDownloadLink(href)) {
        const fileName = this.getFileNameFromUrl(href);
        const fileType = this.getFileExtension(fileName);
        this.analytics.trackDownload(fileName, fileType);
      }
      
      // ナビゲーションリンクの追跡
      if (link.dataset.scrollTo) {
        this.analytics.trackEvent('navigation_click', 'navigation', link.dataset.scrollTo);
      }
    });
  }
  
  // エラーの自動追跡
  setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.analytics.trackError(
        `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
        'javascript'
      );
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.analytics.trackError(
        `Unhandled Promise Rejection: ${event.reason}`,
        'promise'
      );
    });
  }
  
  // ヘルパーメソッド
  isExternalLink(url) {
    try {
      const linkHost = new URL(url).hostname;
      const currentHost = window.location.hostname;
      return linkHost !== currentHost;
    } catch {
      return false;
    }
  }
  
  isDownloadLink(url) {
    const downloadExtensions = [
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
      'zip', 'rar', 'mp3', 'mp4', 'avi', 'mov', 'wmv',
      'jpg', 'jpeg', 'png', 'gif', 'svg'
    ];
    
    try {
      const pathname = new URL(url).pathname.toLowerCase();
      return downloadExtensions.some(ext => pathname.endsWith(`.${ext}`));
    } catch {
      return false;
    }
  }
  
  getFileNameFromUrl(url) {
    try {
      return new URL(url).pathname.split('/').pop() || 'unknown_file';
    } catch {
      return 'unknown_file';
    }
  }
  
  getFileExtension(fileName) {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : 'unknown';
  }
}

// グローバル初期化
let msgAnalytics;
let msgAutoTracker;

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
  // Cookieの同意確認（実装に応じて調整）
  const hasAnalyticsConsent = localStorage.getItem('analytics_consent') === 'true';
  
  if (hasAnalyticsConsent) {
    msgAnalytics = new Analytics();
    msgAutoTracker = new AutoTracker(msgAnalytics);
    
    // 初回ページビューを記録
    msgAnalytics.trackPageView();
  }
});

// グローバルアクセス用
window.msgAnalytics = msgAnalytics;

// Cookieの同意管理
function enableAnalytics() {
  localStorage.setItem('analytics_consent', 'true');
  
  if (!msgAnalytics) {
    msgAnalytics = new Analytics();
    msgAutoTracker = new AutoTracker(msgAnalytics);
    msgAnalytics.trackPageView();
  }
}

function disableAnalytics() {
  localStorage.setItem('analytics_consent', 'false');
  
  // GAの無効化
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
}

// グローバル関数として公開
window.enableAnalytics = enableAnalytics;
window.disableAnalytics = disableAnalytics;