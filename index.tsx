import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Link, NavLink, useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';

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

// ScrollToTop Component for Router
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// --- App Components ---

const Header: React.FC<{
  lang: Language;
  setLang: (lang: Language) => void;
  translations: any;
}> = ({ lang, setLang, translations }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
    { path: '/', label: translations.navHome, end: true },
    { path: '/about', label: translations.navAbout },
    { path: '/products', label: translations.navProducts, isProduct: true },
    { path: '/services', label: translations.navServices },
    { path: '/faq', label: translations.navFAQ },
    { path: '/contact', label: translations.navContact },
  ];

  const productCategories = [
      { key: 'sport-lightweight', translationKey: 'categorySportLightweight' },
      { key: 'lightweight', translationKey: 'categoryLightweight' },
      { key: 'electric', translationKey: 'categoryElectric' },
      { key: 'children', translationKey: 'categoryChildren' },
      { key: 'standard', translationKey: 'categoryStandard' },
      { key: 'bathroom', translationKey: 'categoryBathroom' },
      { key: 'accessories', translationKey: 'categoryAccessories' },
      { key: 'movable', translationKey: 'categoryMovable' },
      { key: 'beds', translationKey: 'categoryMedicalBeds' },
      { key: 'mattresses', translationKey: 'categoryMattresses' },
      { key: 'walkers', translationKey: 'categoryWalkers' },
      { key: 'diapers', translationKey: 'categoryDiapers' },
      { key: 'cushions', translationKey: 'categoryCushions' },
      { key: 'respiratory', translationKey: 'categoryRespiratory' },
      { key: 'diagnostic', translationKey: 'categoryDiagnostic' },
      { key: 'furniture', translationKey: 'categoryFurniture' },
      { key: 'consumables', translationKey: 'categoryConsumables' },
  ];
  
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`${scrolled ? 'scrolled' : ''} ${lang === 'ar' ? 'rtl' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="container">
        <div className="logo-area">
            <Link to="/" onClick={closeMenu} className="logo" aria-label={translations.ariaHomepage[lang]}>
              <img src="https://i.imgur.com/sUARy23.png" alt="Wheel of Excellence Logo" />
            </Link>
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
              <li key={link.path} className={link.isProduct ? 'has-dropdown' : ''}>
                <NavLink
                  to={link.path}
                  end={link.end}
                  className={({ isActive }) => isActive || (link.isProduct && location.pathname.includes('/products')) ? 'active' : ''}
                  onClick={closeMenu}
                >
                  <T content={link.label} lang={lang} />
                  {link.isProduct && <span className="chevron"></span>}
                </NavLink>
                {link.isProduct && (
                  <ul className="dropdown-menu">
                    {productCategories.map(category => (
                        <li key={category.key}>
                            <Link 
                                to={`/products?category=${category.key}`}
                                onClick={closeMenu}
                            >
                                <T content={translations[category.translationKey]} lang={lang} />
                            </Link>
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
    translations: any
}> = ({ lang, setLang, translations }) => {
    
  const topNavLinks = [
    { path: '/', label: translations.navHome },
    { path: '/about', label: translations.navAbout },
    { path: '/products', label: translations.navProducts },
    { path: '/services', label: translations.navServices },
    { path: '/faq', label: translations.navFAQ },
    { path: '/contact', label: translations.navContact },
  ];
  
  return (
    <footer className={lang === 'ar' ? 'rtl' : ''}>
        <div className="container">
            <div className="footer-top">
                 <nav className="footer-nav">
                    <ul>
                        {topNavLinks.map((link) => (
                          <li key={link.path}>
                            <Link to={link.path}>
                              <T content={link.label} lang={lang} />
                            </Link>
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
                        <li><Link to="/about"><T content={translations.navAbout} lang={lang} /></Link></li>
                        <li><Link to="/products"><T content={translations.navProducts} lang={lang} /></Link></li>
                        <li><Link to="/services"><T content={translations.navServices} lang={lang} /></Link></li>
                        <li><Link to="/faq"><T content={translations.navFAQ} lang={lang} /></Link></li>
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
                        <a href="https://x.com/excellence65" target="_blank" rel="noopener noreferrer" aria-label={translations.ariaFollowX[lang]}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
                        </a>
                        <a href="https://instagram.com/clever_881" target="_blank" rel="noopener noreferrer" aria-label={translations.ariaFollowInstagram[lang]}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.5 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
                        </a>
                        <a href="https://www.snapchat.com/explore/excellence65" target="_blank" rel="noopener noreferrer" aria-label={translations.ariaFollowSnapchat[lang]}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 64C152.6 64 87.5 132.7 81.6 197.5c-1 10.9 5.8 21.2 16.1 24.5l16.7 5.3c8.6 2.7 15.1 9.9 17 18.8l1 4.9c3.2 15.2-8.4 29.3-23.8 29.3H100.2c-16.8 0-31.7 9.4-39.1 24.5l-4.1 8.4c-10 20.5 5.1 44.8 27.8 44.8 12.1 0 23.1 6.7 28.8 17.4l1.4 2.6c13.8 26.2 53.6 30 72.6 7l4.9-6c8.7-10.5 24.2-14.4 37.1-9.3l2.9 1.1c16 6.4 34.1 6.4 50.1 0l2.9-1.1c12.9-5.1 28.4-1.2 37.1 9.3l4.9 6c19 23 58.8 19.2 72.6-7l1.4-2.6c5.7-10.8 16.7-17.4 28.8-17.4 22.7 0 37.8-24.3 27.8-44.8l-4.1-8.4c-7.4-15.1-22.3-24.5-39.1-24.5h-8.4c-15.3 0-27-14.1-23.8-29.3l1-4.9c1.9-8.9 8.4-16.1 17-18.8l16.7-5.3c10.3-3.3 17.1-13.6 16.1-24.5C424.5 132.7 359.4 64 256 64z"/></svg>
                        </a>
                        <a href="https://api.whatsapp.com/send?phone=966505203532" target="_blank" rel="noopener noreferrer" aria-label={translations.ariaFollowWhatsApp[lang]}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                        </a>
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
}> = ({ data, lang, translations }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

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
              <Link to="/products" className="cta-button">
                <T content={translations.heroButton} lang={lang} />
              </Link>
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
                      <Link to="/about" className="cta-button"><T content={translations.homeAboutButton} lang={lang} /></Link>
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
              <div onClick={() => navigate(`/products/${product.id}`)} className="product-card" key={product.id}>
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
           <Link to="/products" className="cta-button" style={{marginTop: '30px', display: 'inline-block'}}><T content={translations.homeProductsButton} lang={lang} /></Link>
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
}> = ({ products, lang, translations }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get('category') || 'all';
    
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortOrder, setSortOrder] = useState('default');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const navigate = useNavigate();

    const setActiveCategory = (category: string) => {
        setSearchParams(category === 'all' ? {} : { category });
    };

    const categories = {
        'all': { label: translations.categoryAll },
        'standard': { label: translations.categoryStandard },
        'sport-lightweight': { label: translations.categorySportLightweight },
        'lightweight': { label: translations.categoryLightweight },
        'children': { label: translations.categoryChildren },
        'electric': { label: translations.categoryElectric },
        'bathroom': { label: translations.categoryBathroom },
        'accessories': { label: translations.categoryAccessories },
        'movable': { label: translations.categoryMovable },
        'beds': { label: translations.categoryMedicalBeds },
        'mattresses': { label: translations.categoryMattresses },
        'walkers': { label: translations.categoryWalkers },
        'diapers': { label: translations.categoryDiapers },
        'cushions': { label: translations.categoryCushions },
        'respiratory': { label: translations.categoryRespiratory },
        'diagnostic': { label: translations.categoryDiagnostic },
        'furniture': { label: translations.categoryFurniture },
        'consumables': { label: translations.categoryConsumables },
    };
    
    let filteredProducts = products.filter(product => {
        let productCategory = product.mainCategory;
        
        // Map existing data to new categories if necessary or handle existing logic
        if (['sport-lightweight', 'lightweight', 'children'].includes(product.mainCategory) && activeCategory === 'movable') {
            // Optionally group these under movable if desired, but user requested original categories.
            // If 'movable' is selected, we might want to show all manual wheelchairs.
            // For now, strict matching as per data.json.
            // If product.mainCategory is one of the specific types, it won't match 'movable' unless we add logic.
             if (activeCategory === 'movable' && ['sport-lightweight', 'lightweight', 'children', 'standard'].includes(product.mainCategory)) {
                 return true;
             }
        }

        const matchesCategory = activeCategory === 'all' || product.mainCategory === activeCategory || (activeCategory === 'movable' && ['sport-lightweight', 'lightweight', 'children', 'standard'].includes(product.mainCategory));
        
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
                      <div onClick={() => navigate(`/products/${product.id}`)} className="product-card" key={product.id}>
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
}> = ({ lang, translations, allProducts }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = allProducts.find(p => p.id === id);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [product]);

    if (!product) {
        return (
            <div className="page-container container" style={{textAlign: 'center', padding: '5rem 0'}}>
                 <h2>Product not found</h2>
                 <Link to="/products" className="cta-button">Back to Products</Link>
            </div>
        );
    }

    const allImages = [product.image, ...(product.otherImages || [])];
    const relatedProducts = allProducts.filter(p => p.mainCategory === product.mainCategory && p.id !== product.id).slice(0, 4);

    return (
        <div className="page-container container product-detail-page">
            <div className="breadcrumbs">
                <Link to="/products"><T content={translations.navProducts} lang={lang}/></Link> / <span><T content={product.name} lang={lang}/></span>
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
                            <div onClick={() => navigate(`/products/${p.id}`)} className="product-card" key={p.id}>
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
    homeAboutText: { en: 'Wheel of Excellence Trading Est. is a leading Saudi company specializing in medical equipment for people with disabilities. Contact us: +966 505 203 532 | Customer@woe.sa', ar: 'مؤسسة عجلة التميز التجارية هي شركة سعودية رائدة متخصصة في الأجهزة والمستلزمات الطبية للأشخاص ذوي الإعاقة. للتواصل: 966505203532+ | Customer@woe.sa'},
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
    ariaFollowX: { en: 'Follow us on X', ar: 'تابعنا على منصة X' },
    ariaFollowInstagram: { en: 'Follow us on Instagram', ar: 'تابعنا على انستغرام' },
    ariaFollowSnapchat: { en: 'Follow us on Snapchat', ar: 'تابعنا على سناب شات' },
    ariaFollowWhatsApp: { en: 'Contact us on WhatsApp', ar: 'تواصل معنا عبر واتساب' },
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
  
  if (loading || !data) {
    return null; 
  }

  return (
    <HashRouter>
        <ScrollToTop />
        <Header
            lang={lang}
            setLang={setLang}
            translations={translations}
        />
        <main>
            <Routes>
                <Route path="/" element={<HomePage data={data} lang={lang} translations={translations} />} />
                <Route path="/about" element={<AboutPage lang={lang} translations={translations} />} />
                <Route path="/products" element={<ProductsPage products={data.products} lang={lang} translations={translations} />} />
                <Route path="/products/:id" element={<ProductDetailPage lang={lang} translations={translations} allProducts={data.products} />} />
                <Route path="/services" element={<ServicesPage services={data.services} lang={lang} translations={translations} />} />
                <Route path="/faq" element={<FAQPage faqs={data.faq} lang={lang} translations={translations} />} />
                <Route path="/contact" element={<ContactPage lang={lang} translations={translations} />} />
            </Routes>
        </main>
        <Footer
            lang={lang}
            setLang={setLang}
            translations={translations}
        />
        <ScrollToTopButton translations={translations} lang={lang} />
    </HashRouter>
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