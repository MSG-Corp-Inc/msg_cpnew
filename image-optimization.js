/* 画像最適化システム
   MSG株式会社 - パフォーマンス向上とユーザー体験改善 */

class ImageOptimization {
  constructor() {
    this.lazyImages = [];
    this.observer = null;
    this.supportsWebP = false;
    this.supportsAvif = false;
    
    this.init();
  }
  
  // 初期化
  async init() {
    await this.checkFormatSupport();
    this.setupLazyLoading();
    this.optimizeExistingImages();
  }
  
  // 画像フォーマットサポートの確認
  async checkFormatSupport() {
    // WebPサポート確認
    this.supportsWebP = await this.checkWebPSupport();
    
    // AVIFサポート確認（将来的な対応）
    this.supportsAvif = await this.checkAvifSupport();
    
    console.log('画像フォーマットサポート:', {
      webp: this.supportsWebP,
      avif: this.supportsAvif
    });
  }
  
  // WebPサポート確認
  checkWebPSupport() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }
  
  // AVIFサポート確認
  checkAvifSupport() {
    return new Promise((resolve) => {
      const avif = new Image();
      avif.onload = avif.onerror = () => {
        resolve(avif.height === 2);
      };
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
  }
  
  // 遅延読み込みの設定
  setupLazyLoading() {
    // Intersection Observerがサポートされているかチェック
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          root: null,
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      );
      
      // data-src属性を持つ画像を監視対象に追加
      this.lazyImages = document.querySelectorAll('img[data-src]');
      this.lazyImages.forEach(img => this.observer.observe(img));
    } else {
      // フォールバック：すべての画像を即座に読み込み
      this.loadAllImages();
    }
  }
  
  // Intersection Observer のコールバック
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  // 画像の読み込み
  loadImage(img) {
    // 最適な画像フォーマットを選択
    const optimizedSrc = this.getOptimizedImageSrc(img.dataset.src);
    
    // 新しい画像オブジェクトを作成して事前読み込み
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      // 読み込み完了後にsrcを設定
      img.src = optimizedSrc;
      img.classList.add('loaded');
      
      // アニメーション効果
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';
      requestAnimationFrame(() => {
        img.style.opacity = '1';
      });
      
      // Analytics追跡
      if (window.msgAnalytics) {
        window.msgAnalytics.trackEvent('image_loaded', 'performance', img.alt || 'unnamed');
      }
    };
    
    imageLoader.onerror = () => {
      // エラー時のフォールバック
      img.src = img.dataset.src; // 元の画像を使用
      console.warn('最適化画像の読み込みに失敗:', optimizedSrc);
    };
    
    imageLoader.src = optimizedSrc;
  }
  
  // 最適な画像ソースの取得
  getOptimizedImageSrc(originalSrc) {
    // 外部サービス（Vercel Storage等）の場合、クエリパラメータで最適化
    if (originalSrc.includes('vercel-storage.com')) {
      let optimizedSrc = originalSrc;
      
      // WebPサポート時の処理
      if (this.supportsWebP) {
        optimizedSrc += optimizedSrc.includes('?') ? '&format=webp' : '?format=webp';
      }
      
      // 画質最適化
      optimizedSrc += optimizedSrc.includes('?') ? '&quality=85' : '?quality=85';
      
      // レスポンシブ対応（画面サイズに応じた幅）
      const screenWidth = window.innerWidth;
      let targetWidth;
      
      if (screenWidth <= 640) {
        targetWidth = 640;
      } else if (screenWidth <= 1024) {
        targetWidth = 1024;
      } else {
        targetWidth = 1920;
      }
      
      optimizedSrc += `&width=${targetWidth}`;
      
      return optimizedSrc;
    }
    
    // その他の画像は元のまま返す
    return originalSrc;
  }
  
  // 既存の画像を最適化対象に変換
  optimizeExistingImages() {
    const images = document.querySelectorAll('img:not([data-src])');
    
    images.forEach(img => {
      // すでに読み込まれている画像をdata-srcに移動
      if (img.src && !img.classList.contains('no-lazy')) {
        img.dataset.src = img.src;
        img.src = this.getPlaceholderImage();
        img.classList.add('lazy');
        
        // 遅延読み込み対象に追加
        if (this.observer) {
          this.observer.observe(img);
        }
      }
    });
  }
  
  // プレースホルダー画像の生成
  getPlaceholderImage() {
    // Base64エンコードされた1x1透明画像
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+';
  }
  
  // フォールバック：すべての画像を読み込み
  loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.loadImage(img));
  }
  
  // 画像の事前読み込み
  preloadCriticalImages() {
    const criticalImages = [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MSGcope.jpg-t3pNeP862X1d4acI45N1lowdlWPl0p.jpeg'
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = this.getOptimizedImageSrc(src);
      document.head.appendChild(link);
    });
  }
  
  // パフォーマンス測定
  measureImagePerformance() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name.includes('image') || entry.name.includes('jpg') || entry.name.includes('png') || entry.name.includes('webp')) {
            console.log('画像読み込み時間:', {
              name: entry.name,
              duration: entry.duration,
              transferSize: entry.transferSize
            });
            
            // Analytics追跡
            if (window.msgAnalytics) {
              window.msgAnalytics.trackTiming('images', 'load_time', Math.round(entry.duration), entry.name);
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }
}

// レスポンシブ画像のヘルパー関数
class ResponsiveImageHelper {
  // srcset属性の生成
  static generateSrcSet(baseUrl, sizes = [400, 800, 1200, 1600]) {
    return sizes.map(size => {
      const optimizedUrl = baseUrl.includes('?') 
        ? `${baseUrl}&width=${size}` 
        : `${baseUrl}?width=${size}`;
      return `${optimizedUrl} ${size}w`;
    }).join(', ');
  }
  
  // sizes属性の生成
  static generateSizes(breakpoints = {
    mobile: '(max-width: 640px) 100vw',
    tablet: '(max-width: 1024px) 50vw',
    desktop: '33vw'
  }) {
    return Object.values(breakpoints).join(', ');
  }
  
  // picture要素の生成
  static createPictureElement(baseUrl, alt = '', className = '') {
    const picture = document.createElement('picture');
    
    // WebP source
    const webpSource = document.createElement('source');
    webpSource.srcset = this.generateSrcSet(`${baseUrl}?format=webp`);
    webpSource.sizes = this.generateSizes();
    webpSource.type = 'image/webp';
    
    // フォールバック img
    const img = document.createElement('img');
    img.src = baseUrl;
    img.srcset = this.generateSrcSet(baseUrl);
    img.sizes = this.generateSizes();
    img.alt = alt;
    img.className = className;
    img.loading = 'lazy';
    
    picture.appendChild(webpSource);
    picture.appendChild(img);
    
    return picture;
  }
}

// 自動初期化
let imageOptimization;

document.addEventListener('DOMContentLoaded', () => {
  imageOptimization = new ImageOptimization();
  
  // 重要な画像の事前読み込み
  imageOptimization.preloadCriticalImages();
  
  // パフォーマンス測定開始
  imageOptimization.measureImagePerformance();
});

// グローバルアクセス用
window.imageOptimization = imageOptimization;
window.ResponsiveImageHelper = ResponsiveImageHelper;