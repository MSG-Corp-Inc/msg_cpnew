/* MSG株式会社ランディングページ - JavaScriptファイル
   ES6構文を使用し、モジュール化された動的機能を実装 */

// ===========================
// DOM要素の取得と初期化
// ===========================
class MSGWebsite {
  constructor() {
    // DOM要素をキャッシュ
    this.elements = {
      header: document.getElementById('header'),
      mobileMenuButton: document.getElementById('mobileMenuButton'),
      mobileNav: document.getElementById('mobileNav'),
      menuIcon: null,
      closeIcon: null,
      navLinks: [],
      scrollButtons: [],
      tabTriggers: [],
      tabPanels: [],
      contactForm: document.getElementById('contactForm'),
      currentYearSpan: document.getElementById('currentYear')
    };
    
    // 現在のアクティブセクション
    this.activeSection = 'hero';
    
    // モバイルメニューの状態
    this.isMenuOpen = false;
    
    // セクションIDの配列
    this.sectionIds = ['hero', 'vision', 'services', 'media', 'news', 'partners', 'company', 'careers', 'contact'];
    
    // 初期化
    this.init();
  }
  
  init() {
    this.setupIcons();
    this.cacheElements();
    this.bindEvents();
    this.initializeYear();
    this.checkActiveSection();
  }
  
  // Lucideアイコンの初期化
  setupIcons() {
    // Lucideアイコンを初期化
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  
  // DOM要素のキャッシュ
  cacheElements() {
    // メニューアイコンの取得
    const menuButton = this.elements.mobileMenuButton;
    if (menuButton) {
      this.elements.menuIcon = menuButton.querySelector('.menu-icon');
      this.elements.closeIcon = menuButton.querySelector('.close-icon');
    }
    
    // ナビゲーションリンクの取得
    this.elements.navLinks = Array.from(document.querySelectorAll('.nav__link'));
    
    // スクロールボタンの取得
    this.elements.scrollButtons = Array.from(document.querySelectorAll('[data-scroll-to]'));
    
    // タブ要素の取得
    this.elements.tabTriggers = Array.from(document.querySelectorAll('.tabs__trigger'));
    this.elements.tabPanels = Array.from(document.querySelectorAll('.tabs__panel'));
  }
  
  // イベントリスナーの設定
  bindEvents() {
    // モバイルメニューボタン
    if (this.elements.mobileMenuButton) {
      this.elements.mobileMenuButton.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // スクロールボタン
    this.elements.scrollButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleScrollClick(e));
    });
    
    // ウィンドウスクロール
    window.addEventListener('scroll', () => this.handleScroll());
    
    // タブ切り替え
    this.elements.tabTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => this.handleTabClick(e));
    });
    
    // フォーム送信
    if (this.elements.contactForm) {
      this.elements.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
    
    // ウィンドウリサイズ
    window.addEventListener('resize', () => this.handleResize());
  }
  
  // ===========================
  // モバイルメニュー機能
  // ===========================
  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    if (this.elements.mobileNav) {
      this.elements.mobileNav.style.display = this.isMenuOpen ? 'flex' : 'none';
    }
    
    if (this.elements.menuIcon && this.elements.closeIcon) {
      this.elements.menuIcon.style.display = this.isMenuOpen ? 'none' : 'block';
      this.elements.closeIcon.style.display = this.isMenuOpen ? 'block' : 'none';
    }
    
    // アイコンを再生成
    this.setupIcons();
  }
  
  closeMobileMenu() {
    this.isMenuOpen = false;
    
    if (this.elements.mobileNav) {
      this.elements.mobileNav.style.display = 'none';
    }
    
    if (this.elements.menuIcon && this.elements.closeIcon) {
      this.elements.menuIcon.style.display = 'block';
      this.elements.closeIcon.style.display = 'none';
    }
    
    // アイコンを再生成
    this.setupIcons();
  }
  
  // ===========================
  // スムーススクロール機能
  // ===========================
  handleScrollClick(event) {
    const button = event.currentTarget;
    const targetId = button.getAttribute('data-scroll-to');
    
    if (targetId) {
      this.scrollToSection(targetId);
    }
  }
  
  scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    
    if (targetElement) {
      const headerHeight = this.elements.header ? this.elements.header.offsetHeight : 0;
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // モバイルメニューを閉じる
      this.closeMobileMenu();
    }
  }
  
  // ===========================
  // スクロール監視機能
  // ===========================
  handleScroll() {
    this.checkActiveSection();
  }
  
  checkActiveSection() {
    const scrollPosition = window.scrollY + 100;
    
    for (const sectionId of this.sectionIds) {
      const section = document.getElementById(sectionId);
      
      if (section) {
        const { offsetTop, offsetHeight } = section;
        
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          if (this.activeSection !== sectionId) {
            this.activeSection = sectionId;
            this.updateActiveNavLinks();
          }
          break;
        }
      }
    }
  }
  
  updateActiveNavLinks() {
    this.elements.navLinks.forEach(link => {
      const targetId = link.getAttribute('data-scroll-to');
      
      if (targetId === this.activeSection) {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    });
  }
  
  // ===========================
  // タブ機能
  // ===========================
  handleTabClick(event) {
    const clickedTrigger = event.currentTarget;
    const targetTab = clickedTrigger.getAttribute('data-tab');
    
    // すべてのトリガーからアクティブクラスを削除
    this.elements.tabTriggers.forEach(trigger => {
      trigger.classList.remove('tabs__trigger--active');
    });
    
    // クリックされたトリガーにアクティブクラスを追加
    clickedTrigger.classList.add('tabs__trigger--active');
    
    // すべてのパネルを非表示
    this.elements.tabPanels.forEach(panel => {
      panel.classList.remove('tabs__panel--active');
    });
    
    // 対応するパネルを表示
    const targetPanel = document.querySelector(`[data-panel="${targetTab}"]`);
    if (targetPanel) {
      targetPanel.classList.add('tabs__panel--active');
    }
  }
  
  // ===========================
  // フォーム機能
  // ===========================
  async handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    try {
      // 送信中状態
      submitButton.disabled = true;
      submitButton.innerHTML = '<i data-lucide="loader-2" class="btn__icon animate-spin"></i> 送信中...';
      this.setupIcons(); // アイコン再生成
      
      // フォームデータの取得
      const formData = new FormData(form);
      
      // クライアントサイドバリデーション
      const data = {
        name: formData.get('name'),
        company: formData.get('company'),
        email: formData.get('email'),
        message: formData.get('message')
      };
      
      if (!this.validateForm(data)) {
        return;
      }
      
      // サーバーへの送信
      const response = await fetch('contact-handler.php', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        this.showFormSuccess(result.message);
        form.reset();
        
        // Google Analytics 4でフォーム送信成功を追跡
        if (window.msgAnalytics) {
          window.msgAnalytics.trackFormSubmission('contact_form', true);
        }
      } else {
        this.showFormError(result.message, result.errors);
        
        // Google Analytics 4でフォーム送信エラーを追跡
        if (window.msgAnalytics) {
          window.msgAnalytics.trackFormSubmission('contact_form', false);
        }
      }
      
    } catch (error) {
      console.error('送信エラー:', error);
      this.showFormError('ネットワークエラーが発生しました。インターネット接続を確認してください。');
    } finally {
      // ボタンを元に戻す
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
      this.setupIcons(); // アイコン再生成
    }
  }
  
  validateForm(data) {
    // 必須フィールドのチェック
    if (!data.name || !data.email || !data.message) {
      alert('必須項目を入力してください。');
      return false;
    }
    
    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert('正しいメールアドレスを入力してください。');
      return false;
    }
    
    return true;
  }
  
  showFormSuccess(message) {
    const defaultMessage = 'お問い合わせありがとうございます。\n担当者より折り返しご連絡させていただきます。';
    alert(message || defaultMessage);
  }
  
  showFormError(message, errors = []) {
    let errorMessage = message;
    if (errors && errors.length > 0) {
      errorMessage += '\n\n詳細:\n' + errors.join('\n');
    }
    alert(errorMessage);
  }
  
  // ===========================
  // ユーティリティ機能
  // ===========================
  handleResize() {
    // モバイルメニューの自動クローズ
    if (window.innerWidth >= 768 && this.isMenuOpen) {
      this.closeMobileMenu();
    }
  }
  
  initializeYear() {
    // 現在の年を表示
    if (this.elements.currentYearSpan) {
      this.elements.currentYearSpan.textContent = new Date().getFullYear();
    }
  }
}

// ===========================
// アニメーション機能（オプション）
// ===========================
class AnimationObserver {
  constructor() {
    this.observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    this.init();
  }
  
  init() {
    // Intersection Observerがサポートされているかチェック
    if ('IntersectionObserver' in window) {
      this.setupObserver();
    }
  }
  
  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);
    
    // アニメーション対象要素を監視
    const animatedElements = document.querySelectorAll('.card, .service-card, .media-card, .partner-card');
    animatedElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      observer.observe(element);
    });
  }
  
  animateElement(element) {
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }
}

// ===========================
// 初期化
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  // メインサイトの初期化
  const msgWebsite = new MSGWebsite();
  
  // アニメーションの初期化
  const animationObserver = new AnimationObserver();
  
  // グローバルに公開（デバッグ用）
  window.msgWebsite = msgWebsite;
});

// ===========================
// ユーティリティ関数
// ===========================
const utils = {
  // デバウンス関数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // スロットル関数
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // ローカルストレージ操作
  storage: {
    get(key) {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (e) {
        return null;
      }
    },
    
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    },
    
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        return false;
      }
    }
  }
};

// ユーティリティをグローバルに公開
window.msgUtils = utils;