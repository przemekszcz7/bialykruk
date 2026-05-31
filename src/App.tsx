/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  PartyPopper, 
  Wine, 
  Gift, 
  Quote, 
  Menu, 
  X, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 1. Interactive Custom Cursor Trackers (manipulating DOM for hardware-accelerated fluid movement)
  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    const ring = document.querySelector('.custom-cursor-ring') as HTMLElement;
    if (!cursor || !ring) return;

    let targetX = -100;
    let targetY = -100;
    let currentRingX = -100;
    let currentRingY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      cursor.style.left = `${targetX}px`;
      cursor.style.top = `${targetY}px`;
    };

    // Smooth elastic trailing ring animation
    const updateRing = () => {
      const ease = 0.15;
      currentRingX += (targetX - currentRingX) * ease;
      currentRingY += (targetY - currentRingY) * ease;
      
      ring.style.left = `${currentRingX}px`;
      ring.style.top = `${currentRingY}px`;
      
      requestAnimationFrame(updateRing);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animId = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // 2. Cursor Hover Effects for Interactive Elements
  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor');
    const ring = document.querySelector('.custom-cursor-ring');
    
    const handleMouseEnter = () => {
      cursor?.classList.add('hovering');
      ring?.classList.add('hovering');
    };
    
    const handleMouseLeave = () => {
      cursor?.classList.remove('hovering');
      ring?.classList.remove('hovering');
    };

    const attachHoverListeners = () => {
      const elements = document.querySelectorAll('a, button, .gallery-item, .clickable');
      elements.forEach(item => {
        item.addEventListener('mouseenter', handleMouseEnter);
        item.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    attachHoverListeners();

    // Re-attach listeners when DOM updates (or fallback)
    const observer = new MutationObserver(attachHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  // 3. Scroll Reveal Transition Triggering (IntersectionObserver)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    const targets = document.querySelectorAll('.reveal-item');
    targets.forEach(el => observer.observe(el));

    return () => {
      targets.forEach(el => observer.unobserve(el));
    };
  }, []);

  // 4. Scroll Sticky Navbar State
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-white select-none selection:bg-brand-accent selection:text-brand-bg">
      {/* Texture Grains overlay */}
      <div className="noise-overlay" />

      {/* Modern Cursor System */}
      <div className="custom-cursor" />
      <div className="custom-cursor-ring" />

      {/* HEADER / NAVIGATION BAR */}
      <header id="nav" className={`header-nav fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 md:py-6 flex items-center justify-between ${scrolled ? 'header-scrolled' : 'bg-transparent'}`}>
        <button 
          onClick={() => scrollToSection('hero')} 
          className="text-2xl cursor-pointer funky-logo"
          id="nav-logo"
        >
          Biały Kruk
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-12">
          {['o-nas', 'uslugi', 'galeria', 'opinie', 'kontakt'].map((sec) => (
            <button
              key={sec}
              onClick={() => scrollToSection(sec)}
              className="font-sans text-xs uppercase tracking-widest text-[#555555] hover:text-brand-accent transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-brand-accent after:transform after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 cursor-pointer uppercase-first"
              id={`nav-link-${sec}`}
            >
              {sec.replace('-', ' ')}
            </button>
          ))}
        </nav>

        {/* CTA Contact Button Header */}
        <div className="hidden lg:block">
          <a
            href="mailto:adrian_kruk@op.pl"
            className="px-5 py-2.5 text-xs font-semibold tracking-wider border border-brand-white bg-transparent hover:bg-brand-white hover:text-brand-bg uppercase rounded-sm transition-all duration-300 inline-flex items-center gap-2"
            id="nav-cta-email"
          >
            Szybka wycena
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-brand-white hover:text-brand-accent transition-colors focus:outline-none"
          aria-label="Toggle menu"
          id="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* MOBILE FULLSCREEN MENU OVERLAY */}
      <div 
        className={`fixed inset-0 bg-brand-bg z-40 flex flex-col justify-center items-center px-6 transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-10 invisible'}`}
        id="mobile-menu-overlay"
      >
        <nav className="flex flex-col space-y-8 text-center">
          {['o-nas', 'uslugi', 'galeria', 'opinie', 'kontakt'].map((sec) => (
            <button
              key={sec}
              onClick={() => scrollToSection(sec)}
              className="text-4xl font-display uppercase tracking-widest text-brand-white hover:text-brand-accent transition-colors duration-300"
              id={`mobile-nav-${sec}`}
            >
              {sec.replace('-', ' ')}
            </button>
          ))}
          <div className="pt-8 flex flex-col gap-4">
            <a
              href="mailto:adrian_kruk@op.pl"
              className="px-6 py-3 text-sm font-semibold tracking-widest bg-brand-accent text-brand-bg uppercase rounded-sm hover:-translate-y-1 transition-all"
            >
              adrian_kruk@op.pl
            </a>
            <a
              href="tel:505393758"
              className="px-6 py-3 text-sm font-semibold tracking-widest bg-transparent border border-brand-white text-brand-white uppercase rounded-sm"
            >
              Zadzwoń: 505 393 758
            </a>
          </div>
        </nav>
      </div>


      {/* 1. HERO SECTION */}
      <section 
        id="hero" 
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Parallax Image Background Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat filter brightness-[1.03] contrast-[0.98] grayscale-[0.25] opacity-[0.14] scale-105"
          style={{ 
            backgroundImage: `url('https://i.ibb.co/rR8pK280/486124072-696618866227646-2824236445171792335-n.jpg')`
          }}
        />

        {/* Dynamic Dark Gradients for Content Popping */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-brand-bg-darker/60 z-0" />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-radial from-brand-accent/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">


          {/* Large Title with glitch reveal and funky wavy font */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[115px] leading-tight mb-6 filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] funky-title">
            Biały Kruk
          </h1>

          {/* Subtitles & Copywriting */}
          <p className="text-lg md:text-2xl font-display tracking-widest text-brand-white uppercase mb-4 font-semibold">
            Profesjonalny Mobilny Koktajl Bar
          </p>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-brand-gray tracking-wide mb-12 font-sans">
            Przywozimy profesjonalny bar barmański, lód, unikalne koktajle i niesamowitą energię bezpośrednio na Twoje wydarzenie. Ty cieszysz się imprezą, my dbamy o doskonałe wrażenia smakowe i wizualne.
          </p>

          {/* Majestic Hero CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6">
            <a
              href="mailto:adrian_kruk@op.pl"
              className="group relative w-full sm:w-auto px-8 py-4 bg-brand-white text-brand-bg text-xs font-bold tracking-widest uppercase rounded-sm overflow-hidden shadow-2xl hover:bg-brand-accent hover:-translate-y-1 transition-all duration-300"
              id="hero-cta-btn1"
            >
              Zapytaj o wycenę
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-accent" />
            </a>
            <a
              href="tel:505393758"
              className="group w-full sm:w-auto px-8 py-4 bg-brand-bg2 border border-brand-white text-brand-white text-xs font-bold tracking-widest uppercase rounded-sm hover:border-brand-accent hover:text-brand-accent hover:-translate-y-1 transition-all duration-300"
              id="hero-cta-btn2"
            >
              Zadzwoń: 505 393 758
            </a>
          </div>
        </div>

        {/* Wavy Downward transition divider to O NAS */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden translate-y-[2px]">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="wavy-divider fill-brand-bg2">
            <path d="M0,64L48,58.7C96,53,192,43,288,53.3C384,64,480,96,576,101.3C672,107,768,85,864,69.3C960,53,1056,43,1152,48C1248,53,1344,75,1392,85.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>


      {/* 2. O NAS (ABOUT) SECTION */}
      <section 
        id="o-nas" 
        className="relative bg-brand-bg2 py-24 md:py-32 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left text description panel */}
            <div className="lg:col-span-7 reveal-item">
              <span className="text-brand-accent text-xs font-mono tracking-widest uppercase mb-4 block">
                Zza kulis baru // KARIERA I ETOS
              </span>
              <h2 className="text-5xl sm:text-6xl font-black font-display uppercase tracking-wider text-brand-white mb-8">
                Skąd ta nazwa?
              </h2>
              
              <div className="space-y-6 text-brand-gray text-[15px] sm:text-base leading-relaxed font-sans">
                <p>
                  Ta nazwa nie pojawiła się przypadkowo. <strong className="text-brand-white">„Biały”</strong> kojarzy mi się z czystością, świeżością i jakością — dokładnie z tym, jak chcę tworzyć swoje projekty i doświadczenia dla ludzi.
                </p>
                <p>
                  <strong className="text-brand-white">„Kruk”</strong> nawiązuje do mojego nazwiska, ale też do czegoś charakterystycznego, mocnego i łatwego do zapamiętania.
                </p>
                <p>
                  Od początku chciałem stworzyć markę, która będzie uniwersalna i ponadczasowa — taką, pod którą można budować różne inicjatywy, eventy i projekty, zawsze z tym samym bezkompromisowym podejściem i niesamowitą energią.
                </p>
              </div>

              {/* Editorial styled quote feature */}
              <div className="mt-10 p-6 border-l-2 border-brand-accent bg-brand-bg/40 rounded-r-md">
                <p className="italic text-brand-white text-sm font-sans">
                  "Jakość nie jest dziełem przypadku, ale świadomego działania. Wierzymy, że unikalny koktajl potrafi podnieść prestiż każdego wydarzenia krok wyżej."
                </p>
              </div>
            </div>

            {/* Right offset overlapping imagery */}
            <div className="lg:col-span-5 reveal-item flex justify-center lg:justify-end">
              <div className="relative group">
                {/* Glowing Background Backdrop and frame */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-brand-accent to-brand-white/25 rounded-md opacity-20 blur-xl group-hover:opacity-35 transition-all duration-700" />
                
                {/* Main Image Frame with styling offset */}
                <div className="relative border border-brand-white/10 rounded-sm overflow-hidden shadow-2xl max-w-sm sm:max-w-md">
                  <img 
                    src="https://i.ibb.co/39Jz0YSY/487234069-696619129560953-1258943222876074251-n.jpg" 
                    alt="Biały Kruk barman w akcji" 
                    className="w-full object-cover aspect-[4/5] object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle caption bottom overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-brand-bg to-transparent p-5">
                    <span className="text-[11px] font-mono tracking-widest text-brand-white/80 uppercase">Biały Kruk Mobilny Bar</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Wavy transition divider to CO OFERUJEMY */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden translate-y-[2px]">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="wavy-divider fill-brand-bg">
            <path d="M0,32L48,48C96,64,192,96,288,101.3C384,107,480,85,576,64C672,43,768,21,864,26.7C960,32,1056,64,1152,74.7C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>


      {/* 3. CO OFERUJEMY (SERVICES) SECTION */}
      <section 
        id="uslugi" 
        className="relative bg-brand-bg py-24 md:py-32 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Editorial Section Header */}
          <div className="mb-16 text-center lg:text-left reveal-item">
            <span className="text-brand-accent text-xs font-mono tracking-widest uppercase mb-4 block">
              Kompleksowa obsługa barmańska
            </span>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="text-5xl sm:text-6xl font-black font-display uppercase tracking-wider text-brand-white">
                Co oferujemy
              </h2>
              <p className="max-w-lg text-[#555555] font-sans text-sm md:text-base leading-relaxed lg:text-right">
                Zapewniamy kompletne zaplecze barowe na wydarzenia publiczne i prywatne. Cały alkohol, wyśmienite owoce i dekoracje, lód, karty menu oraz elegancko podświetlany bar.
              </p>
            </div>
          </div>

          {/* Majestic Services Grid (4 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            
            {/* CARD 1: Wesela */}
            <div className="glow-card group bg-brand-bg2 rounded-sm p-8 flex flex-col justify-between min-h-[290px] reveal-item">
              <div>
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-brand-bg border border-brand-accent/20 text-brand-accent mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Wine size={24} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-widest text-brand-white mb-3">
                  🥂 Wesela
                </h3>
                <p className="text-brand-gray text-sm sm:text-[15px] leading-relaxed">
                  Mobilny bar na Twoje wesele. Autorskie menu, klasyka gatunku, widowiskowy serwis i doskonałe koktajle, które zaproszeni goście zapamiętają na lata.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-brand-white/5 flex items-center gap-2 text-brand-accent text-xs font-mono uppercase tracking-wider">
                Prestiżowy serwis weselny <ArrowRight size={12} />
              </div>
            </div>

            {/* CARD 2: Eventy firmowe */}
            <div className="glow-card-white group bg-brand-bg2 rounded-sm p-8 flex flex-col justify-between min-h-[290px] reveal-item">
              <div>
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-brand-bg border border-brand-white/10 text-brand-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  <PartyPopper size={24} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-widest text-brand-white mb-3">
                  🎉 Eventy firmowe
                </h3>
                <p className="text-brand-gray text-sm sm:text-[15px] leading-relaxed">
                  Profesjonalna i płynna obsługa imprez firmowych, konferencji, gal, bankietów prasowych i premier produktowych. Budujemy markę poprzez zmysłowy smak.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-brand-white/5 flex items-center gap-2 text-brand-white text-xs font-mono uppercase tracking-wider">
                Dedykowane pakiety b2b <ArrowRight size={12} />
              </div>
            </div>

            {/* CARD 3: Urodziny & prywatne */}
            <div className="glow-card-white group bg-brand-bg2 rounded-sm p-8 flex flex-col justify-between min-h-[290px] reveal-item">
              <div>
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-brand-bg border border-brand-white/10 text-brand-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Gift size={24} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-widest text-brand-white mb-3">
                  🎂 Urodziny & prywatne
                </h3>
                <p className="text-brand-gray text-sm sm:text-[15px] leading-relaxed">
                  Wyjątkowa oprawa każdej prywatnej imprezy (jubileusze, osiemnastki, garden party). Dopasujemy asortyment drinków, soków i motywów przewodnich do Twojej wizji.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-brand-white/5 flex items-center gap-2 text-brand-white text-xs font-mono uppercase tracking-wider">
                Unikalna formuła domowa <ArrowRight size={12} />
              </div>
            </div>

            {/* CARD 4: Pokazy barmańskie */}
            <div className="glow-card group bg-brand-bg2 rounded-sm p-8 flex flex-col justify-between min-h-[290px] reveal-item">
              <div>
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-brand-bg border border-brand-accent/20 text-brand-accent mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-widest text-brand-white mb-3">
                  🍹 Pokazy barmańskie
                </h3>
                <p className="text-brand-gray text-sm sm:text-[15px] leading-relaxed">
                  Widowiskowe flair barmaństwo, żonglerka, płonące naczynia i interaktywne zabawy dla wyselekcjonowanej widowni. Pucharowe triki i wybitny show!
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-brand-white/5 flex items-center gap-2 text-brand-accent text-xs font-mono uppercase tracking-wider">
                Wydarzenie z show flair <ArrowRight size={12} />
              </div>
            </div>

          </div>
        </div>

        {/* Wavy transition divider to GALERIA */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden translate-y-[2px]">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="wavy-divider fill-brand-bg2">
            <path d="M0,96C180,96,240,48,360,48C480,48,600,112,720,112C840,112,960,16,1080,16C1200,16,1320,80,1380,80L1440,80L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
          </svg>
        </div>
      </section>


      {/* 4. GALERIA (GALLERY) SECTION */}
      <section 
        id="galeria" 
        className="relative bg-brand-bg2 py-24 md:py-32 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          <div className="mb-16 text-center reveal-item">
            <span className="text-brand-accent text-xs font-mono tracking-widest uppercase mb-4 block">
              Złapane kadry w obiektywie
            </span>
            <h2 className="text-5xl sm:text-6xl font-black font-display uppercase tracking-wider text-brand-white">
              Galeria
            </h2>
            <div className="h-1 w-20 bg-brand-accent mx-auto mt-4" />
          </div>

          {/* Majestic Asymmetrical Masonry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px] lg:auto-rows-[300px]">
            {[
              {
                url: "https://i.ibb.co/NdFNnBwP/486797185-697057492850450-2789959948269272414-n.jpg",
                class: "sm:col-span-2 row-span-1"
              },
              {
                url: "https://i.ibb.co/x8crS042/487203687-697518386137694-3717944889848915134-n.jpg",
                class: "col-span-1 row-span-2"
              },
              {
                url: "https://i.ibb.co/qMwCH2XY/486614567-697519042804295-2171256120395648188-n.jpg",
                class: "col-span-1 row-span-1"
              },
              {
                url: "https://i.ibb.co/KxtFjJqn/486825150-697519106137622-2259841737410840304-n.jpg",
                class: "col-span-1 row-span-2"
              },
              {
                url: "https://i.ibb.co/0yscVBbf/486608862-697519109470955-5396977186349185179-n.jpg",
                class: "col-span-1 row-span-1"
              },
              {
                url: "https://i.ibb.co/JTdhSCK/486461873-697519076137625-916723467627074753-n.jpg",
                class: "col-span-1 sm:col-span-2 lg:col-span-1 row-span-1"
              },
              {
                url: "https://i.ibb.co/b547wTLW/487095271-697519102804289-3121358511904578031-n.jpg",
                class: "col-span-1 row-span-1"
              },
              {
                url: "https://i.ibb.co/1f5Jz1S4/486612641-697519089470957-4222712168845359044-n.jpg",
                class: "col-span-1 lg:col-span-2 row-span-1"
              }
            ].map((img, index) => (
              <div 
                key={index}
                className={`gallery-item reveal-item overflow-hidden relative cursor-pointer group ${img.class}`}
                style={{ contentVisibility: 'auto' }}
              >
                <img 
                  src={img.url} 
                  alt={`Koktajl bar imprezy galeria ${index + 1}`} 
                  className="w-full h-full object-cover select-none"
                  loading="lazy"
                />
                
                {/* Visual hover color-shimmer card text */}
                <div className="absolute inset-0 bg-brand-bg/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <div className="text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs font-mono text-brand-accent tracking-widest uppercase">Biały Kruk</p>
                    <p className="text-sm font-sans font-semibold text-brand-white mt-1">Perfekcja w każdym detalu</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Wavy transition divider to OPINIE */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden translate-y-[2px]">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="wavy-divider fill-brand-bg">
            <path d="M0,64L60,53.3C120,43,240,21,360,21C480,21,600,43,720,53.3C840,64,960,64,1080,53.3C1200,43,1320,21,1380,10.7L1440,0L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      
      {/* 5. OPINIE (REVIEWS) SECTION */}
      <section 
        id="opinie" 
        className="relative bg-brand-bg py-24 md:py-32 overflow-hidden"
      >
        {/* Giant background quote decoration */}
        <div className="absolute top-10 left-10 md:left-24 text-brand-white/5 text-[200px] md:text-[320px] leading-none pointer-events-none font-black font-display font-serif">
          “
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          <div className="mb-16 text-center reveal-item">
            <span className="text-brand-accent text-xs font-mono tracking-widest uppercase mb-4 block">
              Doświadczenia naszych klientów
            </span>
            <h2 className="text-5xl sm:text-6xl font-black font-display uppercase tracking-wider text-brand-white">
              Opinie gości
            </h2>
          </div>

          {/* Horizontal / Grid Cards review display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            {/* Review Card 1 */}
            <div className="bg-brand-bg2 border border-brand-white/5 rounded-sm p-8 flex flex-col justify-between relative shadow-xl min-h-[220px] reveal-item">
              <div className="absolute top-6 right-6 text-brand-accent/25">
                <Quote size={28} />
              </div>
              <p className="text-brand-white text-sm sm:text-base leading-relaxed italic z-10 font-sans pr-6">
                "Fantastyczni, profesjonalni i naprawdę Panowie z pasją. Z całego serducha polecam 😊"
              </p>
              <div className="mt-8 border-t border-brand-white/5 pt-4">
                <p className="font-mono text-xs text-brand-accent tracking-widest">OPINIA Z FACEBOOKA</p>
                <div className="flex text-brand-accent text-xs mt-1">★★★★★</div>
              </div>
            </div>

            {/* Review Card 2 */}
            <div className="bg-brand-bg2 border border-brand-white/5 rounded-sm p-8 flex flex-col justify-between relative shadow-xl min-h-[220px] reveal-item">
              <div className="absolute top-6 right-6 text-brand-accent/25">
                <Quote size={28} />
              </div>
              <p className="text-brand-white text-sm sm:text-base leading-relaxed italic z-10 font-sans pr-6">
                "Serdecznie polecam, drinki przepyszne, obsługa profesjonalna, goście weselni zachwyceni 😍😍😍😍😍"
              </p>
              <div className="mt-8 border-t border-brand-white/5 pt-4">
                <p className="font-mono text-xs text-brand-accent tracking-widest">OPINIA Z FACEBOOKA</p>
                <div className="flex text-brand-accent text-xs mt-1">★★★★★</div>
              </div>
            </div>

            {/* Review Card 3 */}
            <div className="bg-brand-bg2 border border-brand-white/5 rounded-sm p-8 flex flex-col justify-between relative shadow-xl min-h-[220px] reveal-item">
              <div className="absolute top-6 right-6 text-brand-accent/25">
                <Quote size={28} />
              </div>
              <p className="text-brand-white text-sm sm:text-base leading-relaxed italic z-10 font-sans pr-6">
                "Profesjonalne podejście do klienta. Nasi goście weselni mega zadowoleni. Polecam."
              </p>
              <div className="mt-8 border-t border-brand-white/5 pt-4">
                <p className="font-mono text-xs text-brand-accent tracking-widest">OPINIA Z FACEBOOKA</p>
                <div className="flex text-brand-accent text-xs mt-1">★★★★★</div>
              </div>
            </div>

          </div>

          {/* Social review lookup button */}
          <div className="text-center reveal-item">
            <a
              href="https://www.facebook.com/PolotBar/reviews/?id=100076386159441&sk=reviews"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-brand-accent text-brand-accent text-xs font-bold tracking-widest uppercase hover:bg-brand-accent hover:text-brand-bg active:scale-95 transition-all duration-300 rounded-sm"
              id="reviews-fb-link"
            >
              Zobacz więcej opinii na Facebooku
              <ExternalLink size={14} />
            </a>
          </div>

        </div>

        {/* Wavy transition divider to KONTAKT */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden translate-y-[2px]">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="wavy-divider fill-brand-bg2">
            <path d="M0,48C180,48,240,96,360,96C480,96,600,16,720,16C840,16,960,80,1080,80C1200,80,1320,32,1380,16L1440,0L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
          </svg>
        </div>
      </section>


      {/* 6. KONTAKT (CONTACT) SECTION */}
      <section 
        id="kontakt" 
        className="relative bg-brand-bg2 py-24 md:py-32 overflow-hidden"
      >
        <div className="max-w-3xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
          
          {/* Direct contact details */}
          <div className="reveal-item w-full flex flex-col items-center">
            <span className="text-brand-accent text-xs font-mono tracking-widest uppercase mb-4 block">
              Zorganizujmy niezapomniany bar
            </span>
            <h2 className="text-5xl sm:text-6xl font-black font-display uppercase tracking-wider text-brand-white mb-4">
              Porozmawiajmy
            </h2>
            <p className="text-brand-gray text-sm sm:text-base font-sans tracking-wide mb-12 max-w-xl">
              Napisz lub zadzwoń — wstępną kalkulację kosztów i unikalną ofertę menu koktajli przygotujemy szybko i całkowicie bezpłatnie.
            </p>

            {/* Functional clickable contact elements */}
            <div className="space-y-6 w-full max-w-md mx-auto">
              
              {/* Phone contact card */}
              <a 
                href="tel:505393758" 
                className="flex items-center gap-6 p-5 border border-brand-white/5 bg-brand-bg/40 hover:border-brand-accent rounded-sm group transition-all duration-300 text-left"
                id="contact-phone-card"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-bg border border-brand-accent/20 text-brand-accent group-hover:scale-110 transition-transform flex-shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-widest text-[#8d8d8d]">ZADZWOŃ TERAZ</p>
                  <p className="text-lg font-bold text-brand-white group-hover:text-brand-accent tracking-wide transition-colors">
                    505 393 758
                  </p>
                </div>
              </a>

              {/* Email contact card */}
              <a 
                href="mailto:adrian_kruk@op.pl" 
                className="flex items-center gap-6 p-5 border border-brand-white/5 bg-brand-bg/40 hover:border-brand-accent rounded-sm group transition-all duration-300 text-left"
                id="contact-email-card"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-bg border border-brand-accent/20 text-brand-accent group-hover:scale-110 transition-transform flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-widest text-[#8d8d8d]">NAPISZ WIADOMOŚĆ</p>
                  <p className="text-lg font-bold text-brand-white group-hover:text-brand-accent tracking-wide transition-colors">
                    adrian_kruk@op.pl
                  </p>
                </div>
              </a>

              {/* Location context card */}
              <div 
                className="flex items-center gap-6 p-5 border border-brand-white/5 bg-brand-bg2 rounded-sm text-left"
                id="contact-location-card"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-bg border border-brand-white/10 text-brand-white flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-mono tracking-widest text-[#8d8d8d]">NASZA LOKALIZACJA</p>
                  <p className="text-sm sm:text-base font-semibold text-brand-white tracking-wide">
                    03-983, Warszawa, Woj. Mazowieckie
                  </p>
                </div>
              </div>

            </div>

            {/* Facebook dynamic button integration */}
            <div className="mt-12">
              <a
                href="https://www.facebook.com/PolotBar/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-brand-white text-brand-bg text-xs font-black tracking-widest uppercase hover:bg-brand-accent hover:-translate-y-1 transition-all duration-300 rounded-sm"
                id="contact-fb-btn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
                Śledź nas na Facebooku
              </a>
            </div>

          </div>
        </div>

        {/* Minimal wave styled bottom divider transitioning to footer */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden translate-y-[2px]">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="wavy-divider fill-brand-bg-darker">
            <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,60L1320,60C1200,60,960,60,720,60C480,60,240,60,120,60L0,60Z"></path>
          </svg>
        </div>
      </section>


      {/* 7. FOOTER */}
      <footer className="bg-brand-bg-darker py-12 md:py-16 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-brand-white/5">
            
            {/* Left aligned logo-repetition and signature */}
            <div className="text-center md:text-left">
              <button 
                onClick={() => scrollToSection('hero')} 
                className="text-3xl cursor-pointer funky-logo"
              >
                Biały Kruk
              </button>
              <p className="text-xs text-brand-gray mt-2 font-sans tracking-wide">
                Mobilne stanowiska barmańskie z warszawskim stylem.
              </p>
            </div>

            {/* Right aligned social profiles links */}
            <div className="flex items-center gap-6">
              <a 
                href="mailto:adrian_kruk@op.pl" 
                className="w-10 h-10 rounded-full border border-brand-white/5 flex items-center justify-center text-brand-gray hover:text-brand-accent hover:border-brand-accent transition-all duration-300"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
              <a 
                href="tel:505393758" 
                className="w-10 h-10 rounded-full border border-brand-white/5 flex items-center justify-center text-brand-gray hover:text-brand-accent hover:border-brand-accent transition-all duration-300"
                aria-label="Telefon"
              >
                <Phone size={16} />
              </a>
              <a 
                href="https://www.facebook.com/PolotBar/" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full border border-brand-white/5 flex items-center justify-center text-brand-gray hover:text-brand-accent hover:border-brand-accent transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
            </div>

          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-10 text-[11px] font-mono text-[#5d5d5d] tracking-wide text-center">
            <p>© 2026 Biały Kruk — Mobilny Koktajl Bar | Warszawa. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

