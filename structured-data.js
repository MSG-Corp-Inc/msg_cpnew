/* 構造化データ（JSON-LD）
   MSG株式会社 - 検索エンジン最適化 */

// 組織情報の構造化データ
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MSG株式会社",
  "alternateName": ["MSG Corporation", "エムエスジー"],
  "url": "https://msg-corp.co.jp",
  "logo": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MSGcope.jpg-t3pNeP862X1d4acI45N1lowdlWPl0p.jpeg",
  "image": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MSGcope.jpg-t3pNeP862X1d4acI45N1lowdlWPl0p.jpeg",
  "description": "MSG株式会社は東洋医学×西洋医学×AIの力で、誰もが健やかに生きられる社会を創ります。KampoAI、ロイヤル漢方クラブ、Smart Functional Foodを展開。",
  "foundingDate": "2016",
  "founder": {
    "@type": "Person",
    "name": "飯 寿行"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "渋谷3-6-2 YAGI bldg.2 3F",
    "addressLocality": "渋谷区",
    "addressRegion": "東京都",
    "postalCode": "150-0002",
    "addressCountry": "JP"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+81-3-XXXX-XXXX",
    "contactType": "customer service",
    "areaServed": "JP",
    "availableLanguage": "Japanese"
  },
  "sameAs": [
    "https://twitter.com/msg_corp",
    "https://www.linkedin.com/company/msg-corp",
    "https://www.facebook.com/msgcorp"
  ],
  "employee": {
    "@type": "QuantitativeValue",
    "value": 60
  },
  "knowsAbout": [
    "東洋医学",
    "西洋医学",
    "人工知能",
    "漢方",
    "機能性食品",
    "ヘルスケア",
    "健康",
    "AI診断"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "MSG株式会社のサービス",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "KampoAI",
          "description": "AIと東洋医学を融合したパーソナライズ健康体験サービス"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "ロイヤル漢方クラブ",
          "description": "専門家による漢方サポートとマッチングサービス"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Smart Functional Food",
          "description": "機能性食品の開発・PR・販促ワンストップ支援"
        }
      }
    ]
  }
};

// ウェブサイト情報の構造化データ
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MSG株式会社",
  "url": "https://msg-corp.co.jp",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://msg-corp.co.jp/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// ローカルビジネス情報の構造化データ
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Corporation",
  "name": "MSG株式会社",
  "image": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MSGcope.jpg-t3pNeP862X1d4acI45N1lowdlWPl0p.jpeg",
  "url": "https://msg-corp.co.jp",
  "telephone": "+81-3-XXXX-XXXX",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "渋谷3-6-2 YAGI bldg.2 3F",
    "addressLocality": "渋谷区",
    "addressRegion": "東京都",
    "postalCode": "150-0002",
    "addressCountry": "JP"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 35.658581,
    "longitude": 139.701634
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday", 
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "09:00",
    "closes": "18:00"
  },
  "foundingDate": "2016",
  "numberOfEmployees": 60,
  "industry": "Healthcare Technology"
};

// パンくずリストの構造化データ
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "ホーム",
      "item": "https://msg-corp.co.jp"
    }
  ]
};

// FAQ構造化データ
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "MSG株式会社はどのような事業を行っていますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MSG株式会社は東洋医学×西洋医学×AIの力で健康ソリューションを提供しています。主なサービスにKampoAI（AI診断システム）、ロイヤル漢方クラブ（専門家マッチング）、Smart Functional Food（機能性食品開発支援）があります。"
      }
    },
    {
      "@type": "Question", 
      "name": "KampoAIとは何ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "KampoAIは、AIと東洋医学を融合したパーソナライズ健康体験サービスです。中医体質九分類とビッグデータを活用し、個人に最適化された健康提案を行います。"
      }
    },
    {
      "@type": "Question",
      "name": "健タメ！とは何ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "健タメ！は「読んで行動につながるヘルスメディア」として、専門家による解決策、共感性の高い体験談、直接相談可能な機能を提供する健康メディアです。"
      }
    }
  ]
};

// 構造化データをページに追加する関数
function addStructuredData() {
  const schemas = [
    organizationSchema,
    websiteSchema,
    localBusinessSchema,
    breadcrumbSchema,
    faqSchema
  ];
  
  schemas.forEach((schema, index) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    script.id = `structured-data-${index}`;
    document.head.appendChild(script);
  });
}

// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', addStructuredData);