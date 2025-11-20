import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// --- Data Types ---
interface LocalizedString {
  en: string;
  ar: string;
}

interface Slide {
  image: string;
  title: LocalizedString;
  subtitle: LocalizedString;
}

interface Product {
  id: string;
  name: LocalizedString;
  image: string;
  otherImages?: string[];
  manufacturer: LocalizedString;
  category: LocalizedString;
  mainCategory?: string;
  subCategory?: string;
  isFeatured?: boolean;
  shortDescription: LocalizedString;
  countryOfOrigin: LocalizedString;
  features: LocalizedString[];
  model?: string;
}

interface Service {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  image: string;
}

interface FAQ {
  question: LocalizedString;
  answer: LocalizedString;
}

interface Partner {
    name: string;
    logo: string;
}

interface AppData {
  slides: Slide[];
  products: Product[];
  services: Service[];
  faq: FAQ[];
  partners: Partner[];
}

type Language = 'en' | 'ar';

// --- Custom Hooks ---
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// --- Helper Components ---
const T: React.FC<{ content: LocalizedString; lang: Language; args?: Record<string, string | number> }> = ({ content, lang, args }) => {
  let text = content[lang] || '';
  if (args) {
    Object.keys(args).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      text = text.replace(regex, String(args[key]));
    });
  }
  return <>{text}</>;
};

// --- App Components ---

const Header: React.FC<{
  lang: Language;
  setLang: (lang: Language) => void;
  translations: any;
  currentView: string;
  navigateTo: (view: string, productId?: string | null, category?: string) => void;
}> = ({ lang, setLang, translations, currentView, navigateTo }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { id: 'home', label: translations.navHome },
    { id: 'about', label: translations.navAbout },
    { id: 'products', label: translations.navProducts, isProduct: true },
    { id: 'services', label: translations.navServices },
    { id: 'faq', label: translations.navFAQ },
    { id: 'contact', label: translations.navContact },
  ];

  const productCategories = [
      { key: 'sport-lightweight', translationKey: 'categorySportLightweight' },
      { key: 'lightweight', translationKey: 'categoryLightweight' },
      { key: 'electric', translationKey: 'categoryElectric' },
      { key: 'children', translationKey: 'categoryChildren' },
      { key: 'standard', translationKey: 'categoryStandard' },
      { key: 'bathroom', translationKey: 'categoryBathroom' },
      { key: 'accessories', translationKey: 'categoryAccessories' },
  ];
  
  const closeMenu = () => setIsMenuOpen(false);

  const handleNavClick = (e: React.MouseEvent, viewId: string) => {
    e.preventDefault();
    navigateTo(viewId);
    closeMenu();
  };

  const handleCategoryClick = (e: React.MouseEvent, categoryKey: string) => {
      e.preventDefault();
      navigateTo('products', null, categoryKey);
      closeMenu();
  }

  return (
    <header className={`${scrolled ? 'scrolled' : ''} ${lang === 'ar' ? 'rtl' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="container">
        <div className="logo-area">
            <a href="#" onClick={(e) => handleNavClick(e, 'home')} className="logo" aria-label={translations.ariaHomepage[lang]}>
              <img src="https://i.imgur.com/sUARy23.png" alt="Wheel of Excellence Logo" />
            </a>
            <button
              className="lang-switcher"
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              aria-label={translations.ariaSwitchLang[lang]}
            >
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
        </div>

        <nav className={isMenuOpen ? 'open' : ''}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.id} className={link.isProduct ? 'has-dropdown' : ''}>
                <a
                  href="#"
                  className={currentView === link.id ? 'active' : ''}
                  onClick={(e) => handleNavClick(e, link.id)}
                >
                  <T content={link.label} lang={lang} />
                  {link.isProduct && <span className="chevron"></span>}
                </a>
                {link.isProduct && (
                  <ul className="dropdown-menu">
                    {productCategories.map(category => (
                        <li key={category.key}>
                            <a 
                                href="#"
                                onClick={(e) => handleCategoryClick(e, category.key)}
                            >
                                <T content={translations[category.translationKey]} lang={lang} />
                            </a>
                        </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-right">
            <button 
              className="menu-toggle" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? translations.ariaCloseMenu[lang] : translations.ariaOpenMenu[lang]}
              aria-expanded={isMenuOpen}
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC<{ 
    lang: Language, 
    setLang: (lang: Language) => void, 
    translations: any,
    navigateTo: (view: string) => void
}> = ({ lang, setLang, translations, navigateTo }) => {
    
  const topNavLinks = [
    { id: 'home', label: translations.navHome },
    { id: 'about', label: translations.navAbout },
    { id: 'products', label: translations.navProducts },
    { id: 'services', label: translations.navServices },
    { id: 'faq', label: translations.navFAQ },
    { id: 'contact', label: translations.navContact },
  ];

  const handleLinkClick = (e: React.MouseEvent, viewId: string) => {
      e.preventDefault();
      navigateTo(viewId);
  }
  
  return (
    <footer className={lang === 'ar' ? 'rtl' : ''}>
        <div className="container">
            <div className="footer-top">
                 <nav className="footer-nav">
                    <ul>
                        {topNavLinks.map((link) => (
                          <li key={link.id}>
                            <a href="#" onClick={(e) => handleLinkClick(e, link.id)}>
                              <T content={link.label} lang={lang} />
                            </a>
                          </li>
                        ))}
                    </ul>
                </nav>
                <button
                  className="lang-switcher"
                  onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                  aria-label={translations.ariaSwitchLang[lang]}
                >
                  {lang === 'en' ? 'العربية' : 'English'}
                </button>
            </div>
            <div className="footer-main">
                <div className="footer-col">
                    <img src="https://i.imgur.com/sUARy23.png" alt="Wheel of Excellence Logo" className="footer-logo" loading="lazy" />
                    <p><T content={translations.footerSlogan} lang={lang} /></p>
                </div>
                <div className="footer-col">
                    <h3><T content={translations.footerLinks} lang={lang} /></h3>
                    <ul>
                        <li><a href="#" onClick={(e) => handleLinkClick(e, 'about')}><T content={translations.navAbout} lang={lang} /></a></li>
                        <li><a href="#" onClick={(e) => handleLinkClick(e, 'products')}><T content={translations.navProducts} lang={lang} /></a></li>
                        <li><a href="#" onClick={(e) => handleLinkClick(e, 'services')}><T content={translations.navServices} lang={lang} /></a></li>
                        <li><a href="#" onClick={(e) => handleLinkClick(e, 'faq')}><T content={translations.navFAQ} lang={lang} /></a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h3><T content={translations.navContact} lang={lang} /></h3>
                    <div className="contact-list">
                      <p className="contact-item"><span>An Nahadhah, Riyadh, Saudi Arabia</span><i className="icon-map"></i></p>
                      <p className="contact-item"><span dir="ltr">+966 505 203 532</span><i className="icon-phone"></i></p>
                      <p className="contact-item"><span dir="ltr">Customer@woe.sa</span><i className="icon-email"></i></p>
                    </div>
                </div>
                 <div className="footer-col">
                    <h3><T content={translations.footerSocial} lang={lang} /></h3>
                    <div className="social-icons">
                        <a href="#" aria-label={translations.ariaFollowFacebook[lang]}><i className="icon-facebook"></i></a>
                        <a href="#" aria-label={translations.ariaFollowTwitter[lang]}><i className="icon-twitter"></i></a>
                        <a href="#" aria-label={translations.ariaFollowInstagram[lang]}><i className="icon-instagram"></i></a>
                    </div>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; 2025 <T content={translations.footerRights} lang={lang} /></p>
        </div>
    </footer>
  );
};


const ScrollToTopButton: React.FC<{ translations: any; lang: Language }> = ({ translations, lang }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label={translations.ariaScrollToTop[lang]}
    >
      &#8679;
    </button>
  );
};


// --- Pages ---
const HomePage: React.FC<{ 
    data: AppData; 
    lang: Language; 
    translations: any;
    navigateTo: (view: string, productId?: string) => void;
}> = ({ data, lang, translations, navigateTo }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [data.slides.length]);

  const featuredProducts = data.products.filter(p => p.isFeatured);

  return (
    <>
      {/* Hero Slider */}
      <section className="hero">
        {data.slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
             {index === 0 && <img src={slide.image} alt="" style={{display: 'none'}} />}
            <div className="hero-content">
              <h1><T content={slide.title} lang={lang} /></h1>
              <p><T content={slide.subtitle} lang={lang} /></p>
              <button onClick={() => navigateTo('products')} className="cta-button">
                <T content={translations.heroButton} lang={lang} />
              </button>
            </div>
          </div>
        ))}
        <div className="slider-dots">
            {data.slides.map((_, index) => (
                <button
                    key={index}
                    className="dot"
                    aria-current={index === currentSlide}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`${translations.ariaGoToSlide[lang]} ${index + 1}`}
                />
            ))}
        </div>
      </section>

      {/* About Section Preview */}
      <section className="about-section">
          <div className="container">
              <h2 className="page-title"><T content={translations.homeAboutTitle} lang={lang} /></h2>
              <div className="title-divider"></div>
              <div className="home-about-content">
                  <div className="home-about-text">
                      <p><T content={translations.homeAboutText} lang={lang} /></p>
                      <button onClick={() => navigateTo('about')} className="cta-button"><T content={translations.homeAboutButton} lang={lang} /></button>
                  </div>
                  <div className="home-about-image">
                      <img src="https://i.imgur.com/xApFqZi.jpeg" alt={translations.homeAboutImageAlt[lang]} loading="lazy" />
                  </div>
              </div>
          </div>
      </section>

      {/* Products Preview Section */}
      <section className="products-preview-section">
        <div className="container">
          <h2 className="page-title"><T content={translations.homeProductsTitle} lang={lang} /></h2>
          <div className="title-divider"></div>
          <p className="section-subtitle"><T content={translations.homeProductsSubtitle} lang={lang} /></p>
          <div className="product-grid">
            {featuredProducts.map(product => (
              <div onClick={() => navigateTo('product-detail', product.id)} className="product-card" key={product.id}>
                <div className="product-card-image">
                    <img src={product.image} alt={product.name[lang]} loading="lazy" />
                </div>
                <div className="product-card-info">
                  <div className="product-card-tags">
                      <span className="manufacturer"><T content={product.manufacturer} lang={lang} /></span>
                      <span className="category"><T content={product.category} lang={lang} /></span>
                  </div>
                  <h3><T content={product.name} lang={lang} /></h3>
                  <p><T content={product.shortDescription} lang={lang} /></p>
                  <span className="cta-button-outline">
                    <T content={translations.productViewDetails} lang={lang} />
                  </span>
                </div>
              </div>
            ))}
          </div>
           <button onClick={() => navigateTo('products')} className="cta-button" style={{marginTop: '30px'}}><T content={translations.homeProductsButton} lang={lang} /></button>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
            <h2 className="page-title"><T content={translations.homeServicesTitle} lang={lang} /></h2>
            <div className="title-divider"></div>
            <div className="services-grid">
                {data.services.map(service => (
                    <div className="service-card" key={service.id}>
                        <img src={service.image} alt={service.title[lang]} loading="lazy"/>
                        <h3><T content={service.title} lang={lang}/></h3>
                        <p><T content={service.description} lang={lang}/></p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Partners section */}
      <section className="partners-section">
        <div className="container">
            <h2 className="page-title"><T content={translations.homePartnersTitle} lang={lang} /></h2>
            <div className="title-divider"></div>
            <div className="partners-grid">
                {data.partners.map(partner => (
                    <div className="partner-card" key={partner.name}>
                        <img src={partner.logo} alt={partner.name} loading="lazy" />
                    </div>
                ))}
            </div>
        </div>
      </section>
    </>
  );
};

const AboutPage: React.FC<{ lang: Language, translations: any }> = ({ lang, translations }) => (
    <div className="page-container container">
        <h1 className="page-title"><T content={translations.navAbout} lang={lang} /></h1>
        <div className="title-divider"></div>
        <div className="about-content">
            <div className="about-text">
                <p><T content={translations.aboutText1} lang={lang} /></p>
                <p><T content={translations.aboutText2} lang={lang} /></p>
                <h3><T content={translations.aboutVisionTitle} lang={lang} /></h3>
                <p><T content={translations.aboutVisionText} lang={lang} /></p>
                <h3><T content={translations.aboutMissionTitle} lang={lang} /></h3>
                <p><T content={translations.aboutMissionText} lang={lang} /></p>
            </div>
            <div className="about-image">
                <img src="https://i.imgur.com/xApFqZi.jpeg" alt={translations.aboutImageAlt[lang]} loading="lazy" />
            </div>
        </div>
    </div>
);

const ProductsPage: React.FC<{ 
    products: Product[]; 
    lang: Language; 
    translations: any; 
    initialCategory: string;
    navigateTo: (view: string, productId?: string) => void;
}> = ({ products, lang, translations, initialCategory, navigateTo }) => {
    const [activeCategory, setActiveCategory] = useState(initialCategory || 'all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortOrder, setSortOrder] = useState('default');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        setActiveCategory(initialCategory);
    }, [initialCategory]);

    const categories = {
        'all': { label: translations.categoryAll },
        'standard': { label: translations.categoryStandard },
        'sport-lightweight': { label: translations.categorySportLightweight },
        'lightweight': { label: translations.categoryLightweight },
        'children': { label: translations.categoryChildren },
        'electric': { label: translations.categoryElectric },
        'bathroom': { label: translations.categoryBathroom },
        'accessories': { label: translations.categoryAccessories },
    };
    
    let filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'all' || product.mainCategory === activeCategory;
        
        const matchesSearch = debouncedSearchTerm.trim() === '' || 
            product.name.en.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            product.name.ar.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            product.manufacturer.en.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            product.manufacturer.ar.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            product.category.en.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            product.category.ar.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOrder === 'name-asc') {
            return a.name[lang].localeCompare(b.name[lang]);
        }
        if (sortOrder === 'name-desc') {
            return b.name[lang].localeCompare(a.name[lang]);
        }
        return 0; // default
    });
    
    const currentCategoryName = categories[activeCategory]?.label[lang];

    return (
      <div className="page-container container">
        <h1 className="page-title"><T content={translations.navProducts} lang={lang} /></h1>
        <div className="title-divider"></div>
        <div className="products-page-layout">
          <aside className="products-sidebar">
            <h3><T content={translations.productCategories} lang={lang}/></h3>
            <ul className="category-list">
              {Object.entries(categories).map(([key, value]) => (
                <li key={key}>
                    <button 
                        className={`category-link ${activeCategory === key ? 'active' : ''}`}
                        onClick={() => setActiveCategory(key)}
                    >
                        <T content={value.label} lang={lang}/>
                    </button>
                </li>
              ))}
            </ul>
          </aside>
          <div className="products-main-content">
            <div className="product-controls">
                <div className="product-search-bar">
                    <input
                        type="search"
                        placeholder={translations.productSearchPlaceholder[lang]}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label={translations.productSearchPlaceholder[lang]}
                    />
                    <i className="search-icon" aria-hidden="true"></i>
                </div>
                <div className="product-view-controls">
                    <div className="view-mode-toggle">
                        <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} aria-label={translations.ariaGridView[lang]}>
                            <i className="icon-grid"></i>
                        </button>
                        <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} aria-label={translations.ariaListView[lang]}>
                            <i className="icon-list"></i>
                        </button>
                    </div>

                    {/* Mobile Category Select */}
                    <div className="select-wrapper mobile-only">
                         <label htmlFor="mobile-category-select" className="sr-only"><T content={translations.productCategories} lang={lang}/></label>
                         <select id="mobile-category-select" value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}>
                            {Object.entries(categories).map(([key, value]) => (
                                <option key={key} value={key}><T content={value.label} lang={lang}/></option>
                            ))}
                         </select>
                    </div>
                    
                    {/* Desktop Sort Select */}
                    <div className="select-wrapper desktop-only">
                         <label htmlFor="sort-select" className="sr-only"><T content={translations.ariaSortBy} lang={lang}/></label>
                         <select id="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                             <option value="default"><T content={translations.sortDefault} lang={lang}/></option>
                             <option value="name-asc"><T content={translations.sortNameAsc} lang={lang}/></option>
                             <option value="name-desc"><T content={translations.sortNameDesc} lang={lang}/></option>
                         </select>
                    </div>
                </div>
            </div>
            
            <div className="product-list-header">
                <h2>{currentCategoryName || <T content={translations.categoryAll} lang={lang}/>}</h2>
                <span>(<T content={translations.productCount} lang={lang} args={{count: sortedProducts.length}}/>)</span>
            </div>

            {sortedProducts.length > 0 ? (
                <div className={`product-${viewMode}`}>
                    {sortedProducts.map(product => (
                      <div onClick={() => navigateTo('product-detail', product.id)} className="product-card" key={product.id}>
                          <div className="product-card-image">
                              <img src={product.image} alt={product.name[lang]} loading="lazy" />
                          </div>
                          <div className="product-card-info">
                              <div className="product-card-tags">
                                  <span className="manufacturer"><T content={product.manufacturer} lang={lang} /></span>
                                  <span className="category"><T content={product.category} lang={lang} /></span>
                              </div>
                              <h3><T content={product.name} lang={lang} /></h3>
                              <p><T content={product.shortDescription} lang={lang} /></p>
                              <span className="cta-button-outline">
                                <T content={translations.productViewDetails} lang={lang} />
                              </span>
                          </div>
                      </div>
                    ))}
                </div>
            ) : (
                <div className="no-results-container">
                    <span role="img" aria-label={translations.ariaSadFace[lang]}>😔</span>
                    <p className="no-results-message"><T content={translations.productNoResults} lang={lang} /></p>
                </div>
            )}
          </div>
        </div>
        </div>
    );
};

const ProductDetailPage: React.FC<{ 
    lang: Language; 
    translations: any; 
    allProducts: Product[];
    productId: string | null;
    navigateTo: (view: string, productId?: string) => void;
}> = ({ lang, translations, allProducts, productId, navigateTo }) => {
    const product = allProducts.find(p => p.id === productId);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [product]);

    if (!product) {
        return (
            <div className="page-container container" style={{textAlign: 'center', padding: '5rem 0'}}>
                 <h2>Product not found</h2>
                 <button onClick={() => navigateTo('products')} className="cta-button">Back to Products</button>
            </div>
        );
    }

    const allImages = [product.image, ...(product.otherImages || [])];
    const relatedProducts = allProducts.filter(p => p.mainCategory === product.mainCategory && p.id !== product.id).slice(0, 4);

    return (
        <div className="page-container container product-detail-page">
            <div className="breadcrumbs">
                <button onClick={() => navigateTo('products')}><T content={translations.navProducts} lang={lang}/></button> / <span><T content={product.name} lang={lang}/></span>
            </div>
            <div className="product-detail-layout">
                <div className="product-gallery">
                    <div className="main-image-container">
                        <img src={allImages[currentImageIndex]} alt={product.name[lang]}/>
                    </div>
                    {allImages.length > 1 && (
                        <div className="thumbnail-container">
                            {allImages.map((img, index) => (
                                <button
                                    key={index}
                                    className={`thumbnail-button ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                    aria-label={`${translations.ariaViewImage[lang]} ${index + 1}`}
                                >
                                    <img src={img} alt={`${translations.thumbnailAlt[lang]} ${index + 1}`} loading="lazy"/>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="product-info">
                    <h1><T content={product.name} lang={lang}/></h1>
                    <div className="product-meta">
                        <span><strong><T content={translations.productManufacturer} lang={lang}/>:</strong> <T content={product.manufacturer} lang={lang}/></span>
                        <span><strong><T content={translations.productCategory} lang={lang}/>:</strong> <T content={product.category} lang={lang}/></span>
                        {product.model && <span><strong><T content={translations.productModel} lang={lang}/>:</strong> {product.model}</span>}
                    </div>
                    <p className="product-description-detail"><T content={product.shortDescription} lang={lang}/></p>
                    
                    <h3><T content={translations.productFeatures} lang={lang}/></h3>
                    <ul className="features-list">
                        {product.features.map((feature, index) => (
                            <li key={index}><i className="icon-tick"></i><T content={feature} lang={lang}/></li>
                        ))}
                    </ul>
                    <p className="product-origin"><strong><T content={translations.productOrigin} lang={lang} />:</strong> <T content={product.countryOfOrigin} lang={lang} /></p>
                    <a href="mailto:Customer@woe.sa" className="cta-button contact-cta">
                        <i className="icon-email-cta"></i>
                        <T content={translations.productContact} lang={lang} />
                    </a>
                </div>
            </div>
            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <h2><T content={translations.relatedProducts} lang={lang}/></h2>
                    <div className="product-grid">
                        {relatedProducts.map(p => (
                            <div onClick={() => navigateTo('product-detail', p.id)} className="product-card" key={p.id}>
                                <div className="product-card-image">
                                    <img src={p.image} alt={p.name[lang]} loading="lazy" />
                                </div>
                                <div className="product-card-info">
                                    <h3><T content={p.name} lang={lang} /></h3>
                                    <p><T content={p.shortDescription} lang={lang} /></p>
                                    <span className="cta-button-outline"><T content={translations.productViewDetails} lang={lang}/></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const ServicesPage: React.FC<{ services: Service[], lang: Language, translations: any }> = ({ services, lang, translations }) => (
    <div className="page-container container">
        <h1 className="page-title"><T content={translations.navServices} lang={lang} /></h1>
        <div className="title-divider"></div>
        <p className="section-subtitle"><T content={translations.servicesSubtitle} lang={lang} /></p>
        <div className="services-grid page-grid">
            {services.map(service => (
                <div className="service-card" key={service.id}>
                    <img src={service.image} alt={service.title[lang]} loading="lazy" />
                    <h3><T content={service.title} lang={lang} /></h3>
                    <p><T content={service.description} lang={lang} /></p>
                </div>
            ))}
        </div>
    </div>
);

const FAQPage: React.FC<{ faqs: FAQ[], lang: Language, translations: any }> = ({ faqs, lang, translations }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="page-container container">
            <h1 className="page-title"><T content={translations.navFAQ} lang={lang} /></h1>
            <div className="title-divider"></div>
            <div className="faq-list">
                {faqs.map((faq, index) => (
                    <div className="faq-item" key={index}>
                        <button
                            className="faq-question"
                            onClick={() => toggleFAQ(index)}
                            aria-expanded={openIndex === index}
                        >
                            <T content={faq.question} lang={lang} />
                            <span className={`faq-icon ${openIndex === index ? 'open' : ''}`} aria-hidden="true">+</span>
                        </button>
                        <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                            <p><T content={faq.answer} lang={lang} /></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ContactPage: React.FC<{ lang: Language, translations: any }> = ({ lang, translations }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({ name: '', email: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const validate = () => {
        const newErrors = { name: '', email: '', message: '' };
        let isValid = true;
        if (!formData.name) {
            newErrors.name = translations.formErrorName[lang];
            isValid = false;
        }
        if (!formData.email) {
            newErrors.email = translations.formErrorEmail[lang];
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = translations.formErrorEmailInvalid[lang];
            isValid = false;
        }
        if (!formData.message) {
            newErrors.message = translations.formErrorMessage[lang];
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        if (!validate()) {
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch('https://formspree.io/f/xeqyqdrj', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsSubmitted(true);
                setFormData({ name: '', email: '', message: '' });
            } else {
                const data = await response.json();
                if (Object.prototype.hasOwnProperty.call(data, 'errors')) {
                    setSubmitError(data["errors"].map((error: any) => error["message"]).join(", "));
                } else {
                    setSubmitError(translations.formErrorGeneric[lang]);
                }
            }
        } catch (error) {
            console.error("Form submission error:", error);
            setSubmitError(translations.formErrorGeneric[lang]);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="page-container container">
            <h1 className="page-title"><T content={translations.navContact} lang={lang} /></h1>
            <div className="title-divider"></div>
            <p className="section-subtitle"><T content={translations.contactSubtitle} lang={lang} /></p>
            <div className="contact-content">
                <div className="contact-info">
                    <h3><T content={translations.contactInfoTitle} lang={lang} /></h3>
                    <div className="contact-list">
                      <p className="contact-item"><span>An Nahadhah, Riyadh, Saudi Arabia</span><i className="icon-map"></i></p>
                      <p className="contact-item"><span dir="ltr">+966 505 203 532</span><i className="icon-phone"></i></p>
                      <p className="contact-item"><span dir="ltr">Customer@woe.sa</span><i className="icon-email"></i></p>
                    </div>
                    {/* Placeholder for map */}
                    <div className="map-placeholder">
                       <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.197258323674!2d46.7963388753677!3d24.754425277997577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2efd7b5f5f5f5f%3A0x8c6b8f8b8f8b8f8b!2sAn%20Nahdah%2C%20Riyadh%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1628582414782!5m2!1sen!2sus" width="100%" height="250" style={{border:0}} allowFullScreen loading="lazy" title="Location Map"></iframe>
                    </div>
                </div>
                <div className="contact-form">
                    <h3><T content={translations.contactFormTitle} lang={lang} /></h3>
                    {isSubmitted ? (
                        <div className="form-success-message">
                            <p><T content={translations.formSuccess} lang={lang} /></p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="form-group">
                                <label htmlFor="name"><T content={translations.formName} lang={lang} /></label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={errors.name ? 'error' : ''} required />
                                {errors.name && <p className="error-message">{errors.name}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="email"><T content={translations.formEmail} lang={lang} /></label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'error' : ''} required />
                                {errors.email && <p className="error-message">{errors.email}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="message"><T content={translations.formMessage} lang={lang} /></label>
                                <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} className={errors.message ? 'error' : ''} required></textarea>
                                {errors.message && <p className="error-message">{errors.message}</p>}
                            </div>
                            <button type="submit" className="cta-button" disabled={isSubmitting}>
                                {isSubmitting ? <T content={translations.formSubmitting} lang={lang} /> : <T content={translations.formSubmit} lang={lang} />}
                            </button>
                            {submitError && <p className="error-message submit-error">{submitError}</p>}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---
const App = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [productCategory, setProductCategory] = useState<string>('all');

  const translations = {
    // Nav & General
    navHome: { en: 'Home', ar: 'الرئيسية' },
    navAbout: { en: 'About Us', ar: 'من نحن' },
    navProducts: { en: 'Products', ar: 'المنتجات' },
    navServices: { en: 'Services', ar: 'الخدمات' },
    navFAQ: { en: 'FAQ', ar: 'الأسئلة الشائعة' },
    navContact: { en: 'Contact Us', ar: 'تواصل معنا' },
    heroButton: { en: 'Explore Our Products', ar: 'اكتشف منتجاتنا' },
    productViewDetails: { en: 'View Details', ar: 'عرض التفاصيل' },
    // Home Page
    homeAboutTitle: { en: 'Wheel of Excellence', ar: 'عجلة التميز' },
    homeAboutText: { en: 'Wheel of Excellence Trading Est. is a leading Saudi company specializing in importing and distributing high-quality medical equipment and supplies for people with disabilities. We are committed to providing the latest global technologies to enhance the quality of life for our customers.', ar: 'مؤسسة عجلة التميز التجارية هي شركة سعودية رائدة متخصصة في استيراد وتوزيع الأجهزة والمستلزمات الطبية عالية الجودة للأشخاص ذوي الإعاقة. نلتزم بتوفير أحدث التقنيات العالمية لتعزيز جودة الحياة لعملائنا.'},
    homeAboutButton: { en: 'Learn More', ar: 'اعرف المزيد' },
    homeAboutImageAlt: { en: 'Technician adjusting a wheelchair', ar: 'فني يقوم بتعديل كرسي متحرك' },
    homeProductsTitle: { en: 'Featured Products', ar: 'منتجاتنا المميزة' },
    homeProductsSubtitle: { en: 'Discover our curated selection of high-performance and reliable mobility solutions.', ar: 'اكتشف مجموعتنا المختارة من حلول التنقل الموثوقة وعالية الأداء.' },
    homeProductsButton: { en: 'View All Products', ar: 'عرض جميع المنتجات' },
    homeServicesTitle: { en: 'Our Services', ar: 'خدماتنا' },
    homePartnersTitle: { en: 'Our Partners', ar: 'شركاؤنا' },
    // Products Page
    productSearchPlaceholder: { en: 'Search by name, brand, or category...', ar: 'ابحث بالاسم، الماركة، أو القسم' },
    productNoResults: { en: 'No products found matching your criteria.', ar: 'لم يتم العثور على منتجات تطابق بحثك.' },
    productCategories: { en: 'Categories', ar: 'الأقسام' },
    productCount: { en: `{count} Products`, ar: `عدد المنتجات: {count}` },
    sortDefault: { en: 'Default Sorting', ar: 'الفرز بواسطة: الافتراضي' },
    sortNameAsc: { en: 'Name: A-Z', ar: 'الاسم: أ-ي' },
    sortNameDesc: { en: 'Name: Z-A', ar: 'الاسم: ي-أ' },
    // Product Detail Page
    productManufacturer: { en: 'Brand', ar: 'العلامة التجارية' },
    productCategory: { en: 'Category', ar: 'القسم' },
    productModel: { en: 'Model', ar: 'الموديل' },
    productFeatures: { en: 'Features', ar: 'المميزات' },
    productOrigin: { en: 'Country of Origin', ar: 'بلد الصنع' },
    productContact: { en: 'Contact for Inquiry', ar: 'تواصل للاستفسار' },
    relatedProducts: { en: 'Related Products', ar: 'منتجات ذات صلة' },
    // About Page
    aboutText1: { en: 'Established with a vision to empower individuals with mobility challenges, Wheel of Excellence has become a trusted name in the healthcare sector across Saudi Arabia and the Middle East.', ar: 'تأسست مؤسسة عجلة التميز برؤية لتمكين الأفراد الذين يواجهون تحديات في التنقل، وأصبحت اسمًا موثوقًا به في قطاع الرعاية الصحية في جميع أنحاء المملكة العربية السعودية والشرق الأوسط.' },
    aboutText2: { en: 'Our team of experts carefully selects products from world-renowned manufacturers, ensuring that we offer only the best in terms of quality, durability, and innovation. We work closely with healthcare professionals and end-users to provide tailored solutions that meet specific needs.', ar: 'يقوم فريق خبرائنا باختيار المنتجات بعناية من أشهر المصنعين العالميين، مما يضمن أننا نقدم الأفضل فقط من حيث الجودة والمتانة والابتكار. نحن نعمل بشكل وثيق مع المتخصصين في الرعاية الصحية والمستخدمين النهائيين لتقديم حلول مخصصة تلبي الاحتياجات المحددة.' },
    aboutVisionTitle: { en: 'Our Vision', ar: 'رؤيتنا' },
    aboutVisionText: { en: 'To be the leading provider of mobility solutions in the Middle East, enhancing independence and quality of life for all.', ar: 'أن نكون المزود الرائد لحلول التنقل في الشرق الأوسط، معززين بذلك استقلالية وجودة حياة الجميع.' },
    aboutMissionTitle: { en: 'Our Mission', ar: 'مهمتنا' },
    aboutMissionText: { en: 'To supply the highest quality medical equipment, offer expert consultation, and provide exceptional after-sales service to our valued customers.', ar: 'توفير أجود المعدات الطبية، وتقديم استشارات متخصصة، وخدمة ما بعد البيع استثنائية لعملائنا الكرام.' },
    aboutImageAlt: { en: 'A person using a custom-fitted wheelchair outdoors', ar: 'شخص يستخدم كرسيًا متحركًا مخصصًا في الهواء الطلق' },
    // Services Page
    servicesSubtitle: { en: 'We offer a comprehensive range of services to ensure your mobility equipment meets your needs and remains in perfect condition.', ar: 'نقدم مجموعة شاملة من الخدمات لضمان أن معدات التنقل الخاصة بك تلبي احتياجاتك وتبقى في حالة ممتازة.' },
    // Contact Page
    contactSubtitle: { en: 'We would love to hear from you! Whether you have a question about our products, need assistance, or want to provide feedback, please get in touch.', ar: 'يسعدنا أن نسمع منك! سواء كان لديك سؤال حول منتجاتنا، أو تحتاج إلى مساعدة، أو ترغب في تقديم ملاحظات، يرجى التواصل معنا.' },
    contactInfoTitle: { en: 'Our Information', ar: 'معلوماتنا' },
    contactFormTitle: { en: 'Send us a Message', ar: 'أرسل لنا رسالة' },
    // Form
    formName: { en: 'Your Name', ar: 'الاسم' },
    formEmail: { en: 'Your Email', ar: 'البريد الإلكتروني' },
    formMessage: { en: 'Your Message', ar: 'رسالتك' },
    formSubmit: { en: 'Send Message', ar: 'إرسال' },
    formSubmitting: { en: 'Sending...', ar: 'جار الإرسال...' },
    formErrorName: { en: 'Name is required.', ar: 'الاسم مطلوب.' },
    formErrorEmail: { en: 'Email is required.', ar: 'البريد الإلكتروني مطلوب.' },
    formErrorEmailInvalid: { en: 'Please enter a valid email.', ar: 'الرجاء إدخال بريد إلكتروني صالح.' },
    formErrorMessage: { en: 'Message is required.', ar: 'الرسالة مطلوبة.' },
    formErrorGeneric: { en: 'An error occurred while sending your message. Please try again later.', ar: 'حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى لاحقاً.' },
    formSuccess: { en: 'Thank you for contacting us! We will get back to you soon.', ar: 'شكرا للتواصل معنا سيتم الرد معك في اقرب وقت' },
    // Footer
    footerSlogan: { en: 'Advanced solutions for a better life.', ar: 'حلول متقدمة لحياة أفضل.' },
    footerLinks: { en: 'Quick Links', ar: 'روابط سريعة' },
    footerSocial: { en: 'Follow Us', ar: 'تابعنا' },
    footerRights: { en: 'Wheel of Excellence Trading Est. All rights reserved.', ar: 'مؤسسة عجلة التميز التجارية. جميع الحقوق محفوظة.' },
    // Categories
    categoryAll: { en: 'All Categories', ar: 'جميع الأقسام' },
    categoryFeatured: { en: 'Featured', ar: 'المميزة' },
    categorySportLightweight: { en: 'Ultralight Wheelchairs', ar: 'كراسي متحركة فائقة الخفة' },
    categoryLightweight: { en: 'Lightweight', ar: 'كراسي خفيفة الوزن' },
    categoryElectric: { en: 'Electric Wheelchairs', ar: 'كراسي متحركة كهربائية' },
    categoryChildren: { en: 'Children\'s Wheelchairs', ar: 'كراسي أطفال' },
    categoryStandard: { en: 'Standard Wheelchairs', ar: 'كراسي متحركة عادية' },
    categoryBathroom: { en: 'Bathroom Chairs & Accessories', ar: 'كراسي و لوازم حمام' },
    categoryAccessories: { en: 'Accessories', ar: 'مستلزمات طبية' },
    categoryMovable: { en: 'Manual Wheelchairs', ar: 'كراسي متحركة عادية' },
    categoryMedicalBeds: { en: 'Beds & Accessories', ar: 'أسرة طبية و ملحقاتها' },
    categoryMattresses: { en: 'Medical & Air Mattresses', ar: 'مراتب طبية و هوائية' },
    categoryWalkers: { en: 'Walkers & Crutches', ar: 'مشايات و عكاكيز' },
    categoryDiapers: { en: 'Diapers & Bed Pads for Seniors', ar: 'حفائض و مفارش لكبار السن' },
    categoryCushions: { en: 'Cushions & Backrests', ar: 'وسائل الراحة و الاسترخاء' },
    categoryRespiratory: { en: 'Respiratory & Oxygen Cylinders', ar: 'أجهزة تنفس و اسطوانات أكسجين' },
    categoryDiagnostic: { en: 'Specialized Hospital Devices', ar: 'أجهزة المستشفيات التخصصية' },
    categoryFurniture: { en: 'Medical Furniture', ar: 'الأثاث الطبي' },
    categoryConsumables: { en: 'Medical Consumables', ar: 'مستهلكات طبية' },
    // ARIA Labels & Accessibility
    ariaHomepage: { en: 'Go to homepage', ar: 'الانتقال إلى الصفحة الرئيسية' },
    ariaSwitchLang: { en: 'Switch to Arabic', ar: 'التحويل إلى اللغة العربية' },
    ariaOpenMenu: { en: 'Open navigation menu', ar: 'فتح قائمة التنقل' },
    ariaCloseMenu: { en: 'Close navigation menu', ar: 'إغلاق قائمة التنقل' },
    ariaViewImage: { en: 'View image', ar: 'عرض الصورة' },
    thumbnailAlt: { en: 'Product thumbnail', ar: 'صورة مصغرة للمنتج' },
    ariaContactForPrice: { en: 'Contact us for product pricing', ar: 'تواصل معنا لمعرفة سعر المنتج' },
    ariaFollowFacebook: { en: 'Follow us on Facebook', ar: 'تابعنا على فيسبوك' },
    ariaFollowTwitter: { en: 'Follow us on Twitter', ar: 'تابعنا على تويتر' },
    ariaFollowInstagram: { en: 'Follow us on Instagram', ar: 'تابعنا على انستغرام' },
    ariaScrollToTop: { en: 'Scroll to top of page', ar: 'الانتقال إلى أعلى الصفحة' },
    ariaGoToSlide: { en: 'Go to slide', ar: 'الانتقال إلى الشريحة' },
    ariaProductCategories: { en: 'Product categories', ar: 'فئات المنتجات' },
    ariaSadFace: { en: 'Sad face emoji', ar: 'وجه حزين' },
    ariaListView: { en: 'Switch to list view', ar: 'التحويل إلى عرض القائمة' },
    ariaGridView: { en: 'Switch to grid view', ar: 'التحويل إلى عرض الشبكة' },
    ariaSortBy: { en: 'Sort by', ar: 'الفرز بواسطة' },
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Could not fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const splashScreen = document.getElementById('splash-screen');
    const root = document.getElementById('root');
    if (splashScreen && root && !loading) {
      setTimeout(() => {
        splashScreen.classList.add('fade-out');
        root.classList.add('visible');
        splashScreen.addEventListener('transitionend', () => {
          if (splashScreen) {
              splashScreen.style.display = 'none';
          }
        });
      }, 500); 
    }
  }, [loading]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.body.className = lang === 'ar' ? 'rtl' : '';
  }, [lang]);
  
  const navigateTo = useCallback((view: string, productId: string | null = null, category: string = 'all') => {
      setCurrentView(view);
      if (productId) setSelectedProductId(productId);
      if (category !== 'all') setProductCategory(category); 
      // Reset category to 'all' if navigating to products without a specific category, 
      // unless we want to persist it. For now, let's respect the passed category.
      // If user clicks "Products" in nav, we probably want all products.
      if (view === 'products' && category === 'all') {
          setProductCategory('all');
      }

      window.scrollTo(0, 0);
  }, []);

  if (loading || !data) {
    return null; 
  }

  const renderContent = () => {
      switch (currentView) {
          case 'home':
              return <HomePage data={data} lang={lang} translations={translations} navigateTo={navigateTo} />;
          case 'about':
              return <AboutPage lang={lang} translations={translations} />;
          case 'products':
              return <ProductsPage products={data.products} lang={lang} translations={translations} initialCategory={productCategory} navigateTo={navigateTo} />;
          case 'product-detail':
              return <ProductDetailPage lang={lang} translations={translations} allProducts={data.products} productId={selectedProductId} navigateTo={navigateTo} />;
          case 'services':
              return <ServicesPage services={data.services} lang={lang} translations={translations} />;
          case 'faq':
              return <FAQPage faqs={data.faq} lang={lang} translations={translations} />;
          case 'contact':
              return <ContactPage lang={lang} translations={translations} />;
          default:
              return <HomePage data={data} lang={lang} translations={translations} navigateTo={navigateTo} />;
      }
  };

  return (
    <>
      <Header
        lang={lang}
        setLang={setLang}
        translations={translations}
        currentView={currentView}
        navigateTo={navigateTo}
      />
      <main>
        {renderContent()}
      </main>
      <Footer
        lang={lang}
        setLang={setLang}
        translations={translations}
        navigateTo={navigateTo}
      />
      <ScrollToTopButton translations={translations} lang={lang} />
    </>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
}