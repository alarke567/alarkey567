
import React, { useState, useEffect, useRef } from 'react';
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
  shortDescription: LocalizedString;
  countryOfOrigin: LocalizedString;
  features: LocalizedString[];
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
type Page = 'home' | 'about' | 'products' | 'services' | 'faq' | 'contact';

// --- Helper Components ---
const T: React.FC<{ content: LocalizedString; lang: Language }> = ({ content, lang }) => {
  return <>{content[lang]}</>;
};

// --- App Components ---

const Header: React.FC<{
  lang: Language;
  setLang: (lang: Language) => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  translations: any;
}> = ({ lang, setLang, currentPage, setCurrentPage, translations }) => {
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

  const navLinks: { page: Page; label: LocalizedString }[] = [
    { page: 'home', label: translations.navHome },
    { page: 'about', label: translations.navAbout },
    { page: 'products', label: translations.navProducts },
    { page: 'services', label: translations.navServices },
    { page: 'faq', label: translations.navFAQ },
    { page: 'contact', label: translations.navContact },
  ];

  return (
    <header className={`${scrolled ? 'scrolled' : ''} ${lang === 'ar' ? 'rtl' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="container">
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); setIsMenuOpen(false); }} className="logo">
          <img src="https://i.imgur.com/sUARy23.png" alt="Wheel of Excellence Logo" />
        </a>
        <div className="header-controls">
            <nav className={isMenuOpen ? 'open' : ''}>
              <ul>
                {navLinks.map((link) => (
                  <li key={link.page}>
                    <a
                      href={`#${link.page === 'home' ? '' : link.page}`}
                      className={currentPage === link.page ? 'active' : ''}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(link.page);
                        setIsMenuOpen(false);
                      }}
                    >
                      <T content={link.label} lang={lang} />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <button
              className="lang-switcher"
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            >
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
            <button 
              className="menu-toggle" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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

const Footer: React.FC<{ lang: Language, setLang: (lang: Language) => void, setCurrentPage: (page: Page) => void, translations: any }> = ({ lang, setLang, setCurrentPage, translations }) => {
    
  const topNavLinks: { page: Page; label: LocalizedString }[] = [
    { page: 'home', label: translations.navHome },
    { page: 'about', label: translations.navAbout },
    { page: 'products', label: translations.navProducts },
    { page: 'services', label: translations.navServices },
    { page: 'faq', label: translations.navFAQ },
    { page: 'contact', label: translations.navContact },
  ];

  return (
    <footer className={lang === 'ar' ? 'rtl' : ''}>
        <div className="container">
            <div className="footer-top">
                 <nav className="footer-nav">
                    <ul>
                        {topNavLinks.map((link) => (
                          <li key={link.page}>
                            <a
                              href={`#${link.page === 'home' ? '' : link.page}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(link.page);
                              }}
                            >
                              <T content={link.label} lang={lang} />
                            </a>
                          </li>
                        ))}
                    </ul>
                </nav>
                <button
                  className="lang-switcher"
                  onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                >
                  {lang === 'en' ? 'العربية' : 'English'}
                </button>
            </div>
            <div className="footer-main">
                <div className="footer-col">
                    <img src="https://i.imgur.com/sUARy23.png" alt="Wheel of Excellence Logo" className="footer-logo"/>
                    <img src="https://i.imgur.com/L8aVvB4.png" alt="Wheel of Excellence Partner Logo" className="footer-logo"/>
                    <p><T content={translations.footerSlogan} lang={lang} /></p>
                </div>
                <div className="footer-col">
                    <h3><T content={translations.footerLinks} lang={lang} /></h3>
                    <ul>
                        <li><a href="#about" onClick={(e)=>{e.preventDefault(); setCurrentPage('about')}}><T content={translations.navAbout} lang={lang} /></a></li>
                        <li><a href="#products" onClick={(e)=>{e.preventDefault(); setCurrentPage('products')}}><T content={translations.navProducts} lang={lang} /></a></li>
                        <li><a href="#services" onClick={(e)=>{e.preventDefault(); setCurrentPage('services')}}><T content={translations.navServices} lang={lang} /></a></li>
                        <li><a href="#faq" onClick={(e)=>{e.preventDefault(); setCurrentPage('faq')}}><T content={translations.navFAQ} lang={lang} /></a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h3><T content={translations.navContact} lang={lang} /></h3>
                    <div className="contact-list">
                      <p className="contact-item"><span>An Nahadhah, Riyadh, Saudi Arabia</span><i className="icon-map"></i></p>
                      <p className="contact-item"><span>+966 50 520 3532</span><i className="icon-phone"></i></p>
                      <p className="contact-item"><span>Customer@woe.sa</span><i className="icon-email"></i></p>
                    </div>
                </div>
                 <div className="footer-col">
                    <h3><T content={translations.footerSocial} lang={lang} /></h3>
                    <div className="social-icons">
                        <a href="#"><i className="icon-facebook"></i></a>
                        <a href="#"><i className="icon-twitter"></i></a>
                        <a href="mailto:Customer@woe.sa"><i className="icon-email"></i></a>
                        <a href="#"><i className="icon-instagram"></i></a>
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


const ProductModal: React.FC<{ product: Product | null; onClose: () => void; lang: Language, translations: any }> = ({ product, onClose, lang, translations }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
    }
  }, [product]);
  
  if (!product) return null;

  const allImages = [product.image, ...(product.otherImages || [])];

  return (
    <div className={`modal-overlay ${lang === 'ar' ? 'rtl' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-body">
            <div className="modal-gallery">
                 <div className="modal-main-image">
                    <img src={allImages[currentImageIndex]} alt={product.name[lang]} />
                 </div>
                 {allImages.length > 1 && (
                     <div className="modal-thumbnails">
                         {allImages.map((img, index) => (
                             <img
                                 key={index}
                                 src={img}
                                 alt={`Thumbnail ${index + 1}`}
                                 className={currentImageIndex === index ? 'active' : ''}
                                 onClick={() => setCurrentImageIndex(index)}
                             />
                         ))}
                     </div>
                 )}
            </div>
            <div className="modal-details">
                <h2><T content={product.name} lang={lang} /></h2>
                <div className="product-tags">
                    <span><T content={product.manufacturer} lang={lang}/></span>
                    <span><T content={product.category} lang={lang}/></span>
                </div>
                <p><T content={product.shortDescription} lang={lang} /></p>
                <h3><T content={translations.productFeatures} lang={lang} />:</h3>
                <ul>
                    {product.features.map((feature, index) => (
                        <li key={index}><i className="icon-tick"></i><T content={feature} lang={lang} /></li>
                    ))}
                </ul>
                <p><strong><T content={translations.productOrigin} lang={lang} />:</strong> <T content={product.countryOfOrigin} lang={lang} /></p>
                <a href="mailto:Customer@woe.sa" className="cta-button modal-cta"><T content={translations.productContact} lang={lang} /></a>
            </div>
        </div>
      </div>
    </div>
  );
};


// --- Pages ---
const HomePage: React.FC<{ data: AppData; lang: Language; setCurrentPage: (page: Page) => void, setSelectedProduct: (p: Product) => void, translations: any }> = ({ data, lang, setCurrentPage, setSelectedProduct, translations }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [data.slides.length]);

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
            <div className="hero-content">
              <h1><T content={slide.title} lang={lang} /></h1>
              <p><T content={slide.subtitle} lang={lang} /></p>
              <button className="cta-button" onClick={() => setCurrentPage('products')}>
                <T content={translations.heroButton} lang={lang} />
              </button>
            </div>
          </div>
        ))}
         <div className="slider-dots">
            {data.slides.map((_, index) => (
                <span 
                    key={index} 
                    className={`dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                ></span>
            ))}
        </div>
      </section>

      {/* About Us Section */}
      <section className={`about-section container ${lang === 'ar' ? 'rtl' : ''}`}>
          <h2><T content={translations.navAbout} lang={lang} /></h2>
          <div className="title-divider"></div>
          <div className="home-about-content">
              <div className="home-about-image">
                  <img src="https://i.imgur.com/gTH8a5E.png" alt="About us"/>
              </div>
              <div className="home-about-text">
                  <p><T content={translations.aboutP1} lang={lang} /></p>
                  <button className="cta-button-outline" onClick={() => setCurrentPage('about')}><T content={translations.learnMore} lang={lang} /></button>
              </div>
          </div>
      </section>

      {/* Services Section */}
      <section className={`services-section ${lang === 'ar' ? 'rtl' : ''}`}>
        <div className="container">
          <h2><T content={translations.navServices} lang={lang} /></h2>
          <div className="title-divider"></div>
          <div className="services-grid">
            {data.services.slice(0, 3).map(service => (
              <div key={service.id} className="service-card">
                <img src={service.image} alt={service.title[lang]}/>
                <h3><T content={service.title} lang={lang}/></h3>
                <p><T content={service.description} lang={lang}/></p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Products Preview Section */}
      <section className={`products-preview-section container ${lang === 'ar' ? 'rtl' : ''}`}>
          <h2><T content={translations.navProducts} lang={lang} /></h2>
          <div className="title-divider"></div>
          <div className="product-grid">
              {data.products.slice(0, 3).map(product => (
                  <div key={product.id} className="product-card">
                      <div className="product-card-image">
                        <img src={product.image} alt={product.name[lang]} />
                      </div>
                      <h3><T content={product.name} lang={lang}/></h3>
                      <p><T content={product.shortDescription} lang={lang}/></p>
                      <button className="cta-button-outline" onClick={() => setSelectedProduct(product)}><T content={translations.viewDetails} lang={lang} /></button>
                  </div>
              ))}
          </div>
          <button className="cta-button" onClick={() => setCurrentPage('products')}><T content={translations.viewAllProducts} lang={lang} /></button>
      </section>

      {/* Partners of Success Section */}
      <section className={`partners-section ${lang === 'ar' ? 'rtl' : ''}`}>
          <div className="container">
              <h2><T content={translations.partnersTitle} lang={lang} /></h2>
              <div className="title-divider"></div>
              <div className="partners-grid">
                  {data.partners.map(partner => (
                      <div key={partner.name} className="partner-card">
                         <img src={partner.logo} alt={partner.name} />
                      </div>
                  ))}
              </div>
          </div>
      </section>
    </>
  );
};

const AboutPage: React.FC<{ lang: Language, translations: any }> = ({ lang, translations }) => (
    <div className={`page-container container ${lang === 'ar' ? 'rtl' : ''}`}>
        <h1 className="page-title"><T content={translations.navAbout} lang={lang} /></h1>
        <div className="title-divider"></div>
        <div className="about-content">
            <div className="about-text">
                <h3><T content={translations.whoWeAre} lang={lang} /></h3>
                <p><T content={translations.aboutP1} lang={lang} /></p>
                <h3><T content={translations.ourVision} lang={lang} /></h3>
                <p><T content={translations.aboutP2} lang={lang} /></p>
            </div>
            <div className="about-image">
                <img src="https://i.imgur.com/gTH8a5E.png" alt="About us image"/>
            </div>
        </div>
    </div>
);

const ProductsPage: React.FC<{ data: AppData; lang: Language; setSelectedProduct: (p: Product) => void, translations: any }> = ({ data, lang, setSelectedProduct, translations }) => (
    <div className={`page-container container ${lang === 'ar' ? 'rtl' : ''}`}>
        <h1 className="page-title"><T content={translations.navProducts} lang={lang} /></h1>
        <div className="title-divider"></div>
        <div className="product-grid">
            {data.products.map(product => (
                <div key={product.id} className="product-card">
                    <div className="product-card-image">
                      <img src={product.image} alt={product.name[lang]} />
                    </div>
                    <h3><T content={product.name} lang={lang}/></h3>
                    <p><T content={product.shortDescription} lang={lang}/></p>
                    <button className="cta-button-outline" onClick={() => setSelectedProduct(product)}><T content={translations.viewDetails} lang={lang} /></button>
                </div>
            ))}
        </div>
    </div>
);

const ServicesPage: React.FC<{ data: AppData; lang: Language, translations: any }> = ({ data, lang, translations }) => (
    <div className={`page-container container ${lang === 'ar' ? 'rtl' : ''}`}>
        <h1 className="page-title"><T content={translations.navServices} lang={lang} /></h1>
        <div className="title-divider"></div>
        <div className="services-grid page-grid">
            {data.services.map(service => (
                <div key={service.id} className="service-card">
                    <img src={service.image} alt={service.title[lang]}/>
                    <h3><T content={service.title} lang={lang}/></h3>
                    <p><T content={service.description} lang={lang}/></p>
                </div>
            ))}
        </div>
    </div>
);

const FAQPage: React.FC<{ data: AppData; lang: Language, translations: any }> = ({ data, lang, translations }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={`page-container container ${lang === 'ar' ? 'rtl' : ''}`}>
            <h1 className="page-title"><T content={translations.navFAQ} lang={lang} /></h1>
            <div className="title-divider"></div>
            <div className="faq-list">
                {data.faq.map((item, index) => (
                    <div key={index} className="faq-item">
                        <div className="faq-question" onClick={() => toggleFAQ(index)}>
                            <span><T content={item.question} lang={lang} /></span>
                            <span className={`faq-icon ${openIndex === index ? 'open' : ''}`}>+</span>
                        </div>
                        <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                            <p><T content={item.answer} lang={lang} /></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ContactPage: React.FC<{ lang: Language, translations: any }> = ({ lang, translations }) => (
    <div className={`page-container container ${lang === 'ar' ? 'rtl' : ''}`}>
        <h1 className="page-title"><T content={translations.navContact} lang={lang} /></h1>
        <div className="title-divider"></div>
        <div className="contact-content">
            <div className="contact-form">
                <h3><T content={translations.contactFormTitle} lang={lang} /></h3>
                <form>
                    <input type="text" placeholder={translations.formName[lang]} />
                    <input type="email" placeholder={translations.formEmail[lang]} />
                    <textarea rows={5} placeholder={translations.formMessage[lang]}></textarea>
                    <button type="submit" className="cta-button"><T content={translations.formSend} lang={lang} /></button>
                </form>
            </div>
            <div className="contact-info">
                <h3><T content={translations.contactInfoTitle} lang={lang} /></h3>
                <p><T content={translations.contactInfoText} lang={lang} /></p>
                 <div className="contact-list">
                    <p className="contact-item"><span>An Nahadhah, Riyadh, Saudi Arabia</span><i className="icon-map"></i></p>
                    <p className="contact-item"><span>+966 50 520 3532</span><i className="icon-phone"></i></p>
                    <p className="contact-item"><span>Customer@woe.sa</span><i className="icon-email"></i></p>
                </div>
                <div className="map-placeholder">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.11195616527!2d46.79633331500076!3d24.75731698410298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2efd8a3911b333%3A0x6b4737c64998a699!2sAn%20Nahdah%2C%20Riyadh%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1684321098765!5m2!1sen!2sus" width="100%" height="250" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>
        </div>
    </div>
);


// --- Main App Component ---
function App() {
  const [lang, setLang] = useState<Language>('ar');
  
  const getPageFromHash = (): Page => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash === '') return 'home';
    const validPages: Page[] = ['home', 'about', 'products', 'services', 'faq', 'contact'];
    if (validPages.includes(hash as Page)) {
        return hash as Page;
    }
    return 'home'; // Default to home for any invalid hash
  };

  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash());
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const translations = {
    navHome: { en: 'Home', ar: 'الرئيسية' },
    navAbout: { en: 'About Us', ar: 'من نحن' },
    navProducts: { en: 'Products', ar: 'المنتجات' },
    navServices: { en: 'Services', ar: 'الخدمات' },
    navFAQ: { en: 'FAQ', ar: 'الأسئلة الشائعة' },
    navContact: { en: 'Contact', ar: 'اتصل بنا' },
    heroButton: { en: 'Explore Products', ar: 'استكشف المنتجات' },
    aboutIntro: { en: "Raising the quality of life for people with disabilities through leading mobility solutions.", ar: "رفع جودة الحياة للأشخاص ذوي الإعاقة من خلال حلول التنقل الرائدة."},
    learnMore: { en: 'Learn More', ar: 'اعرف المزيد' },
    viewDetails: { en: 'View Details', ar: 'عرض التفاصيل' },
    viewAllProducts: { en: 'View All Products', ar: 'عرض كل المنتجات' },
    partnersTitle: { en: 'Partners of Success', ar: 'شركاء النجاح' },
    footerSlogan: { en: 'Leading mobility solutions for a better quality of life.', ar: 'حلول تنقل رائدة لجودة حياة أفضل.' },
    footerLinks: { en: 'Quick Links', ar: 'روابط سريعة' },
    footerSocial: { en: 'Follow Us', ar: 'تابعنا' },
    footerRights: { en: 'Wheel of Excellence. All Rights Reserved.', ar: 'مؤسسة عجلة التميز. كل الحقوق محفوظة.' },
    whoWeAre: { en: 'Who We Are', ar: 'من نحن' },
    ourVision: { en: 'Our Vision', ar: 'رؤيتنا' },
    aboutP1: { en: 'The Wheel of Excellence Foundation is one of the leading institutions in the field of medical devices, supplies, and services for people with disabilities. Its headquarters is located in Riyadh. We specialize in importing and customizing high-quality mobility devices, wheelchairs, and supplies for people with physical disabilities from the most renowned global companies.', ar: 'مؤسسة عجلة التميز هي إحدى المؤسسات الرائدة في مجال الأجهزة والمستلزمات الطبية وخدمات ذوي الإعاقة. يقع مقرها الرئيسي في مدينة الرياض. نتخصص باستيراد وتفصيل أجهزة وكراسي ومستلزمات ذوي الإعاقة الحركية ذات الجودة العالية والمواصفات الخاصة من أشهر وأجود الشركات العالمية.' },
    aboutP2: { en: 'To be the first and leading choice in providing devices and supplies for people with disabilities in the Kingdom and the Middle East, while achieving the highest standards of quality and innovation to meet customer needs and enhance the quality of life for people with disabilities.', ar: 'أن تكون عجلة التميز هي الخيار الأول والرائد في مجال توفير أجهزة ومستلزمات ذوي الإعاقة على مستوى المملكة والشرق الأوسط، مع تحقيق أعلى معايير الجودة والابتكار لتلبية احتياجات العملاء وتعزيز جودة حياة الأشخاص ذوي الإعاقة.' },
    contactFormTitle: { en: 'Send us a Message', ar: 'أرسل لنا رسالة' },
    contactInfoTitle: { en: 'Our Information', ar: 'معلوماتنا' },
    contactInfoText: { en: 'Feel free to reach out to us through any of the following methods. We are here to help you with your mobility needs.', ar: 'لا تتردد في التواصل معنا عبر أي من الطرق التالية. نحن هنا لمساعدتك في تلبية احتياجات التنقل الخاصة بك.' },
    formName: { en: 'Name', ar: 'الاسم' },
    formEmail: { en: 'Email', ar: 'البريد الإلكتروني' },
    formMessage: { en: 'Message', ar: 'الرسالة' },
    formSend: { en: 'Send Message', ar: 'إرسال الرسالة' },
    productFeatures: {en: "Features & Specifications", ar: "الميزات والمواصفات"},
    productOrigin: {en: "Country of Origin", ar: "بلد الصنع"},
    productContact: {en: "Contact for Price", ar: "تواصل لمعرفة السعر"}
  };

  const navigateTo = (page: Page) => {
    // This function changes the URL hash, which in turn triggers the `hashchange` event listener.
    window.location.hash = page === 'home' ? '' : page;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.body.className = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const splashScreen = document.getElementById('splash-screen');
    const root = document.getElementById('root');
    if (splashScreen && root && !loading) {
      setTimeout(() => {
        splashScreen.classList.add('fade-out');
        root.classList.add('visible');
        splashScreen.addEventListener('transitionend', () => {
          splashScreen.style.display = 'none';
        });
      }, 2000); 
    }
  }, [loading]);

  useEffect(() => {
    // This listener handles URL hash changes (e.g., from browser back/forward buttons)
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);


  const renderPage = () => {
    if (!data) return null; // Or a loading spinner

    switch (currentPage) {
      case 'home':
        return <HomePage data={data} lang={lang} setCurrentPage={navigateTo} setSelectedProduct={setSelectedProduct} translations={translations} />;
      case 'about':
        return <AboutPage lang={lang} translations={translations} />;
      case 'products':
        return <ProductsPage data={data} lang={lang} setSelectedProduct={setSelectedProduct} translations={translations} />;
      case 'services':
        return <ServicesPage data={data} lang={lang} translations={translations}/>;
      case 'faq':
        return <FAQPage data={data} lang={lang} translations={translations}/>;
      case 'contact':
        return <ContactPage lang={lang} translations={translations} />;
      default:
        return <HomePage data={data} lang={lang} setCurrentPage={navigateTo} setSelectedProduct={setSelectedProduct} translations={translations} />;
    }
  };

  if (loading) {
    return null; // Splash screen is visible via HTML/CSS
  }

  return (
    <>
      <Header
        lang={lang}
        setLang={setLang}
        currentPage={currentPage}
        setCurrentPage={navigateTo}
        translations={translations}
      />
      <main>
          {renderPage()}
      </main>
      <Footer lang={lang} setLang={setLang} setCurrentPage={navigateTo} translations={translations}/>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} lang={lang} translations={translations}/>
    </>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
