import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import SplitText from './components/rb/SplitText';
import ScrollVelocity from './components/rb/ScrollVelocity';
import ScrollFloat from './components/rb/ScrollFloat';
import CircularText from './components/rb/CircularText';
import TiltedCard from './components/rb/TiltedCard';
import Magnet from './components/rb/Magnet';
import ClickSpark from './components/rb/ClickSpark';
import { bookmarks, characters, dict, social, type Lang } from './i18n';
import { processArt, Squiggle } from './Illustrations';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FORM_ENDPOINT = 'https://formspree.io/f/mgvapyye';
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

function initialLang(): Lang {
  const q = new URLSearchParams(window.location.search).get('lang');
  if (q === 'en' || q === 'it') return q;
  return navigator.language?.toLowerCase().startsWith('it') ? 'it' : 'en';
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: id === 'top' ? 0 : -20, duration: 1.6 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

/* ---------------- icons ---------------- */
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconTikTok = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M16.6 2h-3.3v13.2a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9a6.3 6.3 0 1 0 5.3 6.2V8.6a8 8 0 0 0 4.4 1.4V6.7A4.6 4.6 0 0 1 16.6 2Z" />
  </svg>
);
const Arrow = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* ---------------- loader ---------------- */
function Loader({ label, onDone }: { label: string; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) {
        onDone();
        gsap.set(root.current, { autoAlpha: 0 });
        return;
      }
      const c = { v: 0 };
      const tl = gsap.timeline();
      tl.from('.loader__logo', { scale: 0.6, autoAlpha: 0, rotate: -20, duration: 0.9, ease: 'back.out(1.6)' })
        .from('.loader__label', { y: 20, autoAlpha: 0, duration: 0.6 }, '<0.2')
        .to(c, {
          v: 100,
          duration: 1.4,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (count.current) count.current.textContent = String(Math.round(c.v)).padStart(3, '0');
          }
        }, 0)
        .to('.loader__inner', { y: -40, autoAlpha: 0, duration: 0.5, ease: 'power2.in' })
        .add(onDone, '-=0.1')
        .to(root.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '<')
        .set(root.current, { display: 'none' });
    },
    { scope: root }
  );

  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader__inner">
        <img className="loader__logo" src="/logo.png" alt="" />
        <p className="loader__label">{label}</p>
        <span className="loader__count" ref={count}>000</span>
      </div>
    </div>
  );
}

/* ---------------- nav ---------------- */
function Nav({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const t = dict[lang].nav;
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > last && y > 400);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [open]);

  const links: [string, string][] = [
    ['vetro', t.glass],
    ['personaggi', t.characters],
    ['segnalibri', t.bookmarks],
    ['autrice', t.author],
    ['contatti', t.contact]
  ];

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 250 : 0);
  };

  return (
    <header className={`nav ${hidden && !open ? 'nav--hidden' : ''} ${solid ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
      <a className="nav__brand" href="#top" onClick={e => (e.preventDefault(), go('top'))}>
        <img src="/logo.png" alt="AlinneArt" width="40" height="40" />
        <span>AlinneArt</span>
      </a>
      <nav className="nav__links" aria-label="Main">
        {links.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={e => (e.preventDefault(), go(id))}>
            {label}
          </a>
        ))}
      </nav>
      <div className="nav__right">
        <div className="lang" role="group" aria-label="Language">
          {(['it', 'en'] as Lang[]).map(l => (
            <button key={l} className={l === lang ? 'is-active' : ''} onClick={() => setLang(l)} aria-pressed={l === lang}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <a className="btn btn--small nav__cta" href="#contatti" onClick={e => (e.preventDefault(), go('contatti'))}>
          {t.cta}
        </a>
        <button className="nav__burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          <span />
          <span />
        </button>
      </div>
      <div className="nav__drawer" aria-hidden={!open}>
        {links.map(([id, label], i) => (
          <a key={id} href={`#${id}`} style={{ transitionDelay: `${open ? 0.08 * i + 0.1 : 0}s` }} onClick={e => (e.preventDefault(), go(id))}>
            <small>0{i + 1}</small>
            {label}
          </a>
        ))}
        <div className="nav__drawer-social">
          <a href={social.instagram} target="_blank" rel="noreferrer"><IconInstagram /> Instagram</a>
          <a href={social.tiktok} target="_blank" rel="noreferrer"><IconTikTok /> TikTok</a>
        </div>
      </div>
    </header>
  );
}

/* ---------------- hero ---------------- */
const heroColumns = [
  ['/img/personaggio1.jpg', '/img/background4.jpg', '/img/personaggio5.jpg', '/img/personaggio9.jpg'],
  ['/img/personaggio2.jpg', '/img/personaggio7.jpg', '/img/background1.jpg', '/img/personaggio10.jpg'],
  ['/img/personaggio3.jpg', '/img/personaggio8.jpg', '/img/background3.jpg', '/img/personaggio11.jpg'],
  ['/img/personaggio4.jpg', '/img/background2.jpg', '/img/personaggio6.jpg', '/img/personaggio12.jpg'],
  ['/img/personaggio12.jpg', '/img/personaggio9.jpg', '/img/background4.jpg', '/img/personaggio2.jpg']
];

function Hero({ lang, ready }: { lang: Lang; ready: boolean }) {
  const t = dict[lang].hero;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const rm = reducedMotion();
      const small = window.matchMedia('(max-width: 899px)').matches;
      const lens = { x: window.innerWidth / 2, y: window.innerHeight * 0.55, r: 0 };
      const apply = () => {
        el.style.setProperty('--mx', `${lens.x}px`);
        el.style.setProperty('--my', `${lens.y}px`);
        el.style.setProperty('--r', `${lens.r}px`);
      };
      apply();
      if (!ready) return;

      const radius = () => Math.max(window.innerWidth, window.innerHeight) * (small ? 0.26 : 0.17);
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('.mosaic__col', { yPercent: (i: number) => (i % 2 ? -12 : 12), autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.8, stagger: 0.08 }, 0)
        .fromTo(lens, { r: 0 }, { r: radius, duration: 1.8, onUpdate: apply }, 0.4)
        .fromTo('.hero__pill', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 0.3)
        .fromTo('.hero__tag', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power2.inOut' }, 1)
        .fromTo('.hero__sub', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 1.1)
        .fromTo('.hero__actions > *', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1 }, 1.2)
        .fromTo('.hero__badge', { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 1.4 }, 1.3);

      if (rm) return;

      // the "glass lens": follows the pointer on desktop, drifts on its own on touch screens
      const toX = gsap.quickTo(lens, 'x', { duration: 0.9, ease: 'power3', onUpdate: apply });
      const toY = gsap.quickTo(lens, 'y', { duration: 0.9, ease: 'power3', onUpdate: apply });
      let idle: gsap.core.Tween | null = null;
      const drift = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const p = { a: 0 };
        idle = gsap.to(p, {
          a: Math.PI * 2,
          duration: small ? 14 : 18,
          ease: 'none',
          repeat: -1,
          onUpdate: () => {
            toX(w / 2 + Math.sin(p.a) * w * (small ? 0.3 : 0.32));
            toY(h * 0.5 + Math.sin(p.a * 2) * h * (small ? 0.28 : 0.22));
          }
        });
      };
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      let onMove: ((e: PointerEvent) => void) | undefined;
      if (fine) {
        onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          if (e.clientY > r.bottom) return;
          idle?.kill();
          idle = null;
          toX(e.clientX - r.left);
          toY(e.clientY - r.top);
        };
        window.addEventListener('pointermove', onMove, { once: false });
        const startX = lens.x;
        gsap.delayedCall(2.2, () => {
          if (!idle && lens.x === startX) drift();
        });
      } else {
        gsap.delayedCall(1.6, drift);
      }

      // scroll out: the full-screen stage shrinks into a framed pane
      gsap.to('.hero__stage', {
        clipPath: small ? 'inset(4% 4% 4% 4% round 28px)' : 'inset(6% 5% 6% 5% round 40px)',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to('.mosaic', {
        scale: 1.15,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to('.hero__content', {
        yPercent: -18,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: '70% top', scrub: true }
      });

      return () => {
        if (onMove) window.removeEventListener('pointermove', onMove);
        idle?.kill();
      };
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__stage" aria-hidden="true">
        <div className="mosaic">
          {heroColumns.map((col, c) => (
            <div className={`mosaic__col mosaic__col--${c + 1}`} key={c}>
              <div className="mosaic__track" style={{ animationDuration: `${46 + c * 7}s` }}>
                {[...col, ...col].map((src, i) => (
                  <img key={i} src={src} alt="" loading={i < 3 ? 'eager' : 'lazy'} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="hero__frost" />
        <div className="hero__lens" />
        <div className="hero__veil" />
        <div className="hero__grain" />
      </div>

      <div className="hero__content">
        <p className="hero__pill">
          <span className="dot" /> {t.eyebrow}
        </p>
        <h1 className="hero__title" aria-label="AlinneArt">
          {ready ? (
            <>
              <SplitText key={`a-${lang}`} text={t.line1} tag="span" className="hero__word" splitType="chars" effect="rise" mask trigger="load" delay={0.05} duration={1.2} />
              <SplitText key={`b-${lang}`} text={t.line2} tag="span" className="hero__word hero__word--accent" splitType="chars" effect="flip" trigger="load" delay={0.08} duration={1.2} />
            </>
          ) : (
            <span style={{ opacity: 0 }}>AlinneArt</span>
          )}
        </h1>
        <p className="hero__tag">{t.tag}</p>
        <p className="hero__sub">{t.sub}</p>
        <div className="hero__actions">
          <Magnet padding={60} magnetStrength={3} style={{ display: 'flex' }} innerClassName="magnet-inner">
            <a className="btn" href="#contatti" onClick={e => (e.preventDefault(), scrollToId('contatti'))}>
              {t.ctaPrimary} <Arrow />
            </a>
          </Magnet>
          <a className="btn btn--ghost" href="#personaggi" onClick={e => (e.preventDefault(), scrollToId('personaggi'))}>
            {t.ctaSecondary}
          </a>
        </div>
      </div>

      <button className="hero__badge" onClick={() => scrollToId('vetro')} aria-label={t.scroll}>
        <CircularText key={lang} text={t.badge} spinDuration={18} onHover="speedUp" size={128} fontSize={11} color="#f4efe2">
          <span className="hero__badge-arrow">↓</span>
        </CircularText>
      </button>
    </section>
  );
}

/* ---------------- shared ---------------- */
function Kicker({ children }: { children: ReactNode }) {
  return <p className="kicker" data-reveal>{children}</p>;
}

/* ---------------- glass section ---------------- */
function drawOnScroll(scope: Element, trigger: Element | string, start = 'top 80%') {
  const draws = scope.querySelectorAll('.draw');
  const pops = scope.querySelectorAll('.pop');
  const tl = gsap.timeline({ scrollTrigger: { trigger, start } });
  if (draws.length) tl.fromTo(draws, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.12 }, 0);
  if (pops.length) tl.fromTo(pops, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.7, ease: 'back.out(2)', stagger: 0.06 }, 0.35);
  return tl;
}

function Glass({ lang }: { lang: Lang }) {
  const t = dict[lang].glass;
  const p = dict[lang].process;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const el = root.current!;
      // video banner opens like a pane of glass
      gsap.fromTo(
        '.glass__banner',
        { clipPath: 'inset(10% 12% 10% 12% round 32px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 32px)',
          ease: 'none',
          scrollTrigger: { trigger: '.glass__banner', start: 'top 95%', end: 'center 55%', scrub: true }
        }
      );
      gsap.fromTo('.glass__banner video', { scale: 1.3 }, {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.glass__banner', start: 'top bottom', end: 'bottom top', scrub: true }
      });
      // centre phone + side cards
      gsap.fromTo('.glass__phone', { y: 80, rotate: -4 }, {
        y: -40,
        rotate: 3,
        ease: 'none',
        scrollTrigger: { trigger: '.glass__trio', start: 'top bottom', end: 'bottom top', scrub: true }
      });
      gsap.fromTo('.glass__card', { y: 60, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '.glass__trio', start: 'top 75%' }
      });
      el.querySelectorAll('.squiggle').forEach(s => drawOnScroll(s, s, 'top 85%'));
      // process illustrations
      el.querySelectorAll('.process__step').forEach((step, i) => {
        gsap.fromTo(step, { y: 60, autoAlpha: 0 }, {
          y: 0,
          autoAlpha: 1,
          duration: 1.1,
          ease: 'expo.out',
          delay: (i % 4) * 0.08,
          scrollTrigger: { trigger: step, start: 'top 88%' }
        });
        drawOnScroll(step, step, 'top 80%');
      });
      const path = el.querySelector<SVGPathElement>('.process__line path');
      if (path) {
        gsap.fromTo(path, { strokeDashoffset: 1 }, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.process__grid', start: 'top 80%', end: 'bottom 70%', scrub: true }
        });
      }
    },
    { scope: root, dependencies: [lang] }
  );

  return (
    <section className="section glass light" id="vetro" ref={root}>
      <div className="wrap center-head">
        <Kicker>{t.kicker}</Kicker>
        <SplitText key={lang} text={t.title} tag="h2" className="h2" splitType="words" effect="blur" textAlign="center" />
        <Squiggle className="center-squiggle" />
      </div>

      <div className="wrap glass__trio">
        <article className="glass__card glass__card--left">
          <span className="glass__card-num">I</span>
          <p>{t.p1}</p>
        </article>
        <div className="glass__phone">
          <video src="/video/video2.mp4" autoPlay muted loop playsInline preload="metadata" />
          <span className="glass__shine" />
        </div>
        <article className="glass__card glass__card--right">
          <span className="glass__card-num">II</span>
          <p>{t.p2}</p>
        </article>
      </div>

      <div className="wrap">
        <div className="glass__banner">
          <video src="/video/video1.mp4" autoPlay muted loop playsInline preload="metadata" poster="/img/disegno-sul-vetro.jpg" />
          <div className="glass__banner-quote">
            <ScrollFloat key={lang} effect="float" splitBy="chars" textClassName="quote" animationDuration={1} ease="back.inOut(2)" scrollStart="top bottom" scrollEnd="center center" stagger={0.03}>
              {t.quote}
            </ScrollFloat>
          </div>
        </div>
      </div>

      <div className="wrap process">
        <div className="center-head">
          <Kicker>{p.kicker}</Kicker>
          <h3 className="h3" data-reveal>{p.title}</h3>
        </div>
        <div className="process__grid">
          <svg className="process__line" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength={1} d="M60 30 C 180 -10, 300 70, 380 30 S 560 -10, 620 30 S 820 70, 940 30" />
          </svg>
          {p.steps.map((s, i) => {
            const Art = processArt[i];
            return (
              <article className="process__step" key={s.t}>
                <div className="process__art">
                  <Art />
                  <span className="process__num">0{i + 1}</span>
                </div>
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- marquee ---------------- */
function Marquee({ lang }: { lang: Lang }) {
  const items = dict[lang].marquee;
  const line = items.join('  ✦  ') + '  ✦  ';
  return (
    <div className="marquee" aria-hidden="true">
      <ScrollVelocity
        key={lang}
        texts={[line, line]}
        velocity={60}
        className="marquee__text"
        outlineAlternate
        fadeEdges
        skewWithVelocity={6}
      />
    </div>
  );
}

/* ---------------- characters ---------------- */
function Characters({ lang }: { lang: Lang }) {
  const t = dict[lang].characters;
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const el = track.current!;
        const dist = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.chars__pin',
            start: 'top top',
            end: () => '+=' + dist(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: self => gsap.set('.chars__progress i', { scaleX: self.progress })
          }
        });
        gsap.utils.toArray<HTMLElement>('.chars__card').forEach((card, i) => {
          gsap.fromTo(card, { y: i % 2 ? 50 : -30, rotate: i % 2 ? 3 : -3 }, {
            y: i % 2 ? -30 : 30,
            rotate: i % 2 ? -2 : 2,
            ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true }
          });
        });
      });
      // mobile: rows glide on their own, and speed up with scroll velocity
      mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => {
        const rows = gsap.utils.toArray<HTMLElement>('.chars__row');
        const loops = rows.map((row, i) =>
          gsap.fromTo(row, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 60, ease: 'none', repeat: -1 })
        );
        const settle = gsap.delayedCall(0.25, () => loops.forEach(l => gsap.to(l, { timeScale: 1, duration: 1.2, overwrite: true }))).pause();
        const st = ScrollTrigger.create({
          trigger: '.chars__rows',
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: self => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 6);
            loops.forEach(l => gsap.to(l, { timeScale: boost, duration: 0.2, overwrite: true }));
            settle.restart(true);
          }
        });
        const holder = root.current!.querySelector('.chars__rows')!;
        const pause = () => loops.forEach(l => gsap.to(l, { timeScale: 0, duration: 0.4, overwrite: true }));
        const play = () => loops.forEach(l => gsap.to(l, { timeScale: 1, duration: 0.6, overwrite: true }));
        holder.addEventListener('pointerdown', pause);
        holder.addEventListener('pointerup', play);
        holder.addEventListener('pointercancel', play);
        return () => {
          st.kill();
          holder.removeEventListener('pointerdown', pause);
          holder.removeEventListener('pointerup', play);
          holder.removeEventListener('pointercancel', play);
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lang] }
  );

  return (
    <section className="section chars" id="personaggi" ref={root}>
      <div className="chars__pin">
        <div className="wrap center-head chars__head">
          <Kicker>{t.kicker}</Kicker>
          <SplitText key={lang} text={t.title} tag="h2" className="h2" splitType="words" effect="rise" mask textAlign="center" />
          <p className="lead" data-reveal>{t.text}</p>
        </div>

        <div className="chars__track" ref={track}>
          {characters.map((src, i) => (
            <div className="chars__card" key={src}>
              <TiltedCard
                imageSrc={src}
                altText={`${t.alt} ${i + 1}`}
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={10}
                scaleOnHover={1.04}
                showTooltip={false}
                glare={0.35}
                radius={20}
              />
              <span className="chars__index">{String(i + 1).padStart(2, '0')}</span>
            </div>
          ))}
        </div>

        <div className="chars__rows">
          {[characters].map((row, r) => (
            <div className="chars__row" key={r}>
              {[...row, ...row].map((src, i) => (
                <figure className="chars__mini" key={i}>
                  <img src={src} alt={i < row.length ? `${t.alt} ${r * 12 + i + 1}` : ''} loading="lazy" />
                </figure>
              ))}
            </div>
          ))}
        </div>

        <div className="wrap chars__foot">
          <span className="chars__hint">{t.hint}</span>
          <div className="chars__progress"><i /></div>
        </div>
      </div>

      <div className="wrap chars__cta" data-reveal>
        <p>{t.cta}</p>
        <a className="btn" href="#contatti" onClick={e => (e.preventDefault(), scrollToId('contatti'))}>
          {t.ctaLink} <Arrow />
        </a>
      </div>
    </section>
  );
}

/* ---------------- bookmarks ---------------- */
function Bookmarks({ lang }: { lang: Lang }) {
  const t = dict[lang].bookmarks;
  const root = useRef<HTMLElement>(null);
  const cols = useMemo(() => [0, 1, 2, 3].map(c => bookmarks.filter((_, i) => i % 4 === c)), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.bm__col').forEach((col, i) => {
          gsap.fromTo(col, { yPercent: [10, -4, 14, 0][i] }, {
            yPercent: [-10, 6, -14, 8][i],
            ease: 'none',
            scrollTrigger: { trigger: '.bm__cols', start: 'top bottom', end: 'bottom top', scrub: true }
          });
        });
        gsap.utils.toArray<HTMLElement>('.bm__item').forEach(el => {
          gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round 16px)' }, {
            clipPath: 'inset(0% 0% 0% 0% round 16px)',
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 95%' }
          });
        });
        if (root.current) root.current.querySelectorAll('.squiggle').forEach(s => drawOnScroll(s, s, 'top 85%'));
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lang] }
  );

  return (
    <section className="section bm light" id="segnalibri" ref={root}>
      <div className="wrap center-head">
        <Kicker>{t.kicker}</Kicker>
        <SplitText key={lang} text={t.title} tag="h2" className="h2" splitType="chars" effect="wave" textAlign="center" />
        <Squiggle className="center-squiggle" />
        <p className="lead" data-reveal>{t.text}</p>
        <ul className="bm__features" data-reveal>
          {t.features.map(f => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
      <div className="wrap bm__cols">
        {cols.map((col, c) => (
          <div className="bm__col" key={c}>
            {col.map(src => (
              <figure className="bm__item" key={src}>
                <img src={src} alt={t.alt} loading="lazy" />
              </figure>
            ))}
          </div>
        ))}
      </div>
      <div className="wrap bm__cta" data-reveal>
        <a className="btn btn--dark" href="#contatti" onClick={e => (e.preventDefault(), scrollToId('contatti'))}>
          {t.cta} <Arrow />
        </a>
      </div>
    </section>
  );
}

/* ---------------- author ---------------- */
function Author({ lang }: { lang: Lang }) {
  const t = dict[lang].author;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.fromTo('.author__photo--main', { clipPath: 'inset(0 0 100% 0 round 999px 999px 24px 24px)' }, {
        clipPath: 'inset(0 0 0% 0 round 999px 999px 24px 24px)',
        duration: 1.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.author__media', start: 'top 75%' }
      });
      gsap.fromTo('.author__photo--main img', { scale: 1.3 }, {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.author__media', start: 'top bottom', end: 'bottom top', scrub: true }
      });
      gsap.fromTo('.author__photo--small', { y: 120, rotate: 8 }, {
        y: -60,
        rotate: -4,
        ease: 'none',
        scrollTrigger: { trigger: '.author__media', start: 'top bottom', end: 'bottom top', scrub: true }
      });
      gsap.from('.author__stat', {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.author__stats', start: 'top 85%' }
      });
    },
    { scope: root, dependencies: [lang] }
  );

  return (
    <section className="section author" id="autrice" ref={root}>
      <div className="wrap author__grid">
        <div className="author__media">
          <div className="author__photo author__photo--main">
            <img src="/img/autore1.jpg" alt={t.alt} loading="lazy" />
          </div>
          <div className="author__photo author__photo--small">
            <img src="/img/autore3.jpg" alt="" loading="lazy" />
          </div>
          <span className="author__sign">Alinne ✦</span>
        </div>
        <div className="author__text">
          <Kicker>{t.kicker}</Kicker>
          <SplitText key={lang} text={t.title} tag="h2" className="h2" splitType="chars" effect="pop" textAlign="left" />
          <p className="author__lead" data-reveal>{t.p1}</p>
          <p data-reveal>{t.p2}</p>
          <div className="author__stats">
            {t.stats.map(s => (
              <div className="author__stat" key={s.l}>
                <strong>{s.n}</strong>
                <span>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- contact ---------------- */
function Contact({ lang }: { lang: Lang }) {
  const t = dict[lang].contact;
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setState('sending');
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setState('ok');
    } catch {
      setState('err');
    }
  };

  return (
    <section className="section contact" id="contatti">
      <div className="contact__bg" aria-hidden="true">
        <img src="/img/background2.jpg" alt="" loading="lazy" />
      </div>
      <div className="wrap contact__grid">
        <div className="contact__text">
          <Kicker>{t.kicker}</Kicker>
          <SplitText key={lang} text={t.title} tag="h2" className="h2" splitType="words" effect="blur" textAlign="left" />
          <p data-reveal>{t.text}</p>
          <div className="contact__social" data-reveal>
            <span>{t.follow}</span>
            <a href={social.instagram} target="_blank" rel="noreferrer"><IconInstagram /> @alinne.art</a>
            <a href={social.tiktok} target="_blank" rel="noreferrer"><IconTikTok /> @alinne.art</a>
          </div>
        </div>
        <ClickSpark sparkColor={['#eb5b00', '#ffb36b', '#f4efe2']} sparkCount={10} sparkRadius={26} className="contact__spark">
          <form className="contact__form" onSubmit={submit} data-reveal>
            <input type="hidden" name="_language" value={lang} />
            <label>
              <span>{t.name}</span>
              <input name="name" type="text" required autoComplete="name" />
            </label>
            <label>
              <span>{t.email}</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <fieldset>
              <legend>{t.type}</legend>
              <div className="chips">
                {t.types.map((ty, i) => (
                  <label className="chip" key={ty}>
                    <input type="radio" name="request" value={ty} defaultChecked={i === 0} />
                    <span>{ty}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label>
              <span className="sr-only">{t.message}</span>
              <textarea name="message" rows={5} required placeholder={t.message} />
            </label>
            <button className="btn btn--block" type="submit" disabled={state === 'sending'}>
              {state === 'sending' ? t.sending : t.send} <Arrow />
            </button>
            <p className={`contact__status contact__status--${state}`} role="status" aria-live="polite">
              {state === 'ok' ? t.ok : state === 'err' ? t.err : ''}
            </p>
          </form>
        </ClickSpark>
      </div>
    </section>
  );
}

/* ---------------- footer ---------------- */
function Footer({ lang }: { lang: Lang }) {
  const t = dict[lang].footer;
  const n = dict[lang].nav;
  const links: [string, string][] = [
    ['vetro', n.glass],
    ['personaggi', n.characters],
    ['segnalibri', n.bookmarks],
    ['autrice', n.author],
    ['contatti', n.contact]
  ];
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <img className="footer__logo" src="/logo.png" alt="AlinneArt" width="72" height="72" />
        <div className="footer__big" aria-hidden="true">AlinneArt</div>
        <nav className="footer__nav" aria-label="Footer">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={e => (e.preventDefault(), scrollToId(id))}>{label}</a>
          ))}
        </nav>
        <div className="footer__social">
          <a href={social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><IconInstagram /></a>
          <a href={social.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"><IconTikTok /></a>
        </div>
        <div className="footer__legal">
          <a href={t.privacyUrl} target="_blank" rel="noreferrer">{t.privacy}</a>
          <span aria-hidden="true">·</span>
          <a href={t.cookieUrl} target="_blank" rel="noreferrer">{t.cookie}</a>
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} AlinneArt · {t.rights}</p>
        <button className="footer__top" onClick={() => scrollToId('top')}>{t.top} ↑</button>
      </div>
    </footer>
  );
}

/* ---------------- app ---------------- */
export default function App() {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [ready, setReady] = useState(false);

  const setLang = (l: Lang) => {
    setLangState(l);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', l);
    window.history.replaceState(null, '', url);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = dict[lang].meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', dict[lang].meta.description);
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(id);
  }, [lang]);

  // Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync
  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, touchMultiplier: 1.4 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // lock scroll during the intro
  useEffect(() => {
    if (ready) {
      window.__lenis?.start();
      document.documentElement.classList.remove('is-loading');
      ScrollTrigger.refresh();
    } else {
      window.__lenis?.stop();
      document.documentElement.classList.add('is-loading');
    }
  }, [ready]);

  // generic reveals
  useGSAP(
    () => {
      if (!ready || reducedMotion()) return;
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        onEnter: els => gsap.fromTo(els, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true })
      });
    },
    { dependencies: [ready, lang] }
  );

  return (
    <>
      <Loader label={dict[lang].loader} onDone={() => setReady(true)} />
      <Nav lang={lang} setLang={setLang} />
      <main>
        <Hero lang={lang} ready={ready} />
        <Marquee lang={lang} />
        <Glass lang={lang} />
        <Characters lang={lang} />
        <Bookmarks lang={lang} />
        <Author lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
