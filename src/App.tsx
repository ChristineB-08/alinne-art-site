import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import Aurora from './components/rb/Aurora';
import SplitText from './components/rb/SplitText';
import ScrollVelocity from './components/rb/ScrollVelocity';
import ScrollFloat from './components/rb/ScrollFloat';
import CircularText from './components/rb/CircularText';
import TiltedCard from './components/rb/TiltedCard';
import Magnet from './components/rb/Magnet';
import ClickSpark from './components/rb/ClickSpark';
import { bookmarks, characters, dict, social, type Lang } from './i18n';

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
function Hero({ lang, ready }: { lang: Lang; ready: boolean }) {
  const t = dict[lang].hero;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ready) return;
      const rm = reducedMotion();
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.hero__eyebrow', { y: 20, autoAlpha: 0, duration: 1 }, 0.3)
        .from('.hero__sub', { y: 24, autoAlpha: 0, duration: 1 }, 0.9)
        .from('.hero__actions > *', { y: 24, autoAlpha: 0, duration: 1, stagger: 0.1 }, 1)
        .from('.hero__art', { y: 160, rotate: (i: number) => [-14, 10, -6][i] ?? 0, autoAlpha: 0, duration: 1.6, stagger: 0.12 }, 0.2)
        .from('.hero__badge', { scale: 0, rotate: -120, duration: 1.4 }, 0.8)
        .from('.hero__scroll', { autoAlpha: 0, duration: 1 }, 1.3);

      if (rm) return;

      // scroll parallax
      gsap.utils.toArray<HTMLElement>('.hero__art').forEach((el, i) => {
        gsap.to(el, {
          yPercent: [-30, -55, -15][i] ?? -20,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
        });
      });
      gsap.to('.hero__title', {
        yPercent: 25,
        autoAlpha: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      });

      // mouse parallax
      const arts = gsap.utils.toArray<HTMLElement>('.hero__art-inner');
      const movers = arts.map(el => ({
        x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' })
      }));
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m, i) => {
          const d = (i + 1) * 14;
          m.x(nx * d);
          m.y(ny * d);
        });
      };
      window.addEventListener('pointermove', onMove);
      return () => window.removeEventListener('pointermove', onMove);
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__aurora" aria-hidden="true">
        <Aurora colorStops={['#3b1d6e', '#eb5b00', '#ff9a3c']} amplitude={1.1} blend={0.55} speed={0.6} />
      </div>
      <div className="hero__grain" aria-hidden="true" />

      <div className="hero__content">
        <p className="hero__eyebrow">
          <span className="dot" /> {t.eyebrow}
        </p>
        <h1 className="hero__title" aria-label="AlinneArt">
          {ready ? (
            <>
              <SplitText key={`a-${lang}`} text={t.line1} tag="span" className="hero__line" splitType="chars" effect="rise" mask trigger="load" delay={0.04} duration={1.1} hoverEffect="wave" />
              <SplitText key={`b-${lang}`} text={t.line2} tag="span" className="hero__line hero__line--italic" splitType="chars" effect="flip" trigger="load" delay={0.06} duration={1.2} />
            </>
          ) : (
            <>
              <span className="hero__line" style={{ opacity: 0 }}>{t.line1}</span>
              <span className="hero__line hero__line--italic" style={{ opacity: 0 }}>{t.line2}</span>
            </>
          )}
        </h1>
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

      <div className="hero__gallery" aria-hidden="true">
        {['/img/background4.jpg', '/img/personaggio7.jpg', '/img/background1.jpg'].map((src, i) => (
          <div className={`hero__art hero__art--${i + 1}`} key={src}>
            <div className="hero__art-inner">
              <img src={src} alt="" />
            </div>
          </div>
        ))}
        <div className="hero__badge">
          <CircularText key={lang} text={t.badge} spinDuration={18} onHover="speedUp" size={150} fontSize={13} color="#f4efe2">
            <img src="/logo.png" alt="" className="hero__badge-logo" />
          </CircularText>
        </div>
      </div>

      <button className="hero__scroll" onClick={() => scrollToId('vetro')}>
        <span>{t.scroll}</span>
        <i />
      </button>
    </section>
  );
}

/* ---------------- shared ---------------- */
function Kicker({ children }: { children: ReactNode }) {
  return <p className="kicker" data-reveal>{children}</p>;
}

/* ---------------- glass section ---------------- */
function Glass({ lang }: { lang: Lang }) {
  const t = dict[lang].glass;
  const p = dict[lang].process;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.fromTo(
        '.glass__video',
        { clipPath: 'inset(18% 14% 18% 14% round 28px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 28px)',
          ease: 'none',
          scrollTrigger: { trigger: '.glass__media', start: 'top 90%', end: 'center 55%', scrub: true }
        }
      );
      gsap.fromTo('.glass__video video', { scale: 1.35 }, {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.glass__media', start: 'top bottom', end: 'bottom top', scrub: true }
      });
      // process line draw
      const path = root.current?.querySelector<SVGPathElement>('.process__line path');
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.process__grid', start: 'top 80%', end: 'bottom 60%', scrub: true }
        });
      }
      gsap.from('.process__step', {
        y: 60,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.process__grid', start: 'top 78%' }
      });
    },
    { scope: root, dependencies: [lang] }
  );

  return (
    <section className="section glass" id="vetro" ref={root}>
      <div className="wrap glass__grid">
        <div className="glass__text">
          <Kicker>{t.kicker}</Kicker>
          <SplitText key={lang} text={t.title} tag="h2" className="h2" splitType="words" effect="blur" textAlign="left" />
          <p data-reveal>{t.p1}</p>
          <p data-reveal>{t.p2}</p>
        </div>
        <div className="glass__media">
          <div className="glass__video">
            <video src="/video/video1.mp4" autoPlay muted loop playsInline preload="metadata" poster="/img/disegno-sul-vetro.jpg" />
          </div>
          <div className="glass__phone" data-reveal>
            <video src="/video/video2.mp4" autoPlay muted loop playsInline preload="metadata" />
          </div>
        </div>
      </div>

      <div className="glass__quote wrap">
        <ScrollFloat key={lang} effect="float" splitBy="chars" textClassName="quote" animationDuration={1} ease="back.inOut(2)" scrollStart="center bottom+=50%" scrollEnd="bottom bottom-=40%" stagger={0.03}>
          {t.quote}
        </ScrollFloat>
      </div>

      <div className="wrap process">
        <div className="process__head">
          <Kicker>{p.kicker}</Kicker>
          <h3 className="h3" data-reveal>{p.title}</h3>
        </div>
        <div className="process__grid">
          <svg className="process__line" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 20 C 160 -10, 330 50, 500 20 S 840 -10, 1000 20" />
          </svg>
          {p.steps.map((s, i) => (
            <article className="process__step" key={s.t}>
              <span className="process__num">0{i + 1}</span>
              <h4>{s.t}</h4>
              <p>{s.d}</p>
            </article>
          ))}
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
        const dist = () => el.scrollWidth - window.innerWidth + 48;
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
          gsap.fromTo(card, { y: i % 2 ? 60 : -30, rotate: i % 2 ? 3 : -3 }, {
            y: i % 2 ? -40 : 30,
            rotate: i % 2 ? -2 : 2,
            ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true }
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lang] }
  );

  return (
    <section className="section chars" id="personaggi" ref={root}>
      <div className="chars__pin">
        <div className="wrap chars__head">
          <div>
            <Kicker>{t.kicker}</Kicker>
            <SplitText key={lang} text={t.title} tag="h2" className="h2" splitType="words" effect="rise" mask textAlign="left" />
          </div>
          <p className="chars__intro" data-reveal>{t.text}</p>
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
          <div className="chars__end">
            <p>{t.cta}</p>
            <a className="btn" href="#contatti" onClick={e => (e.preventDefault(), scrollToId('contatti'))}>
              {t.ctaLink} <Arrow />
            </a>
          </div>
        </div>
        <div className="wrap chars__foot">
          <span className="chars__hint">{t.hint}</span>
          <div className="chars__progress"><i /></div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- bookmarks ---------------- */
function Bookmarks({ lang }: { lang: Lang }) {
  const t = dict[lang].bookmarks;
  const root = useRef<HTMLElement>(null);
  const cols = useMemo(() => [0, 1, 2].map(c => bookmarks.filter((_, i) => i % 3 === c)), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.bm__col').forEach((col, i) => {
          gsap.fromTo(col, { yPercent: [8, -6, 14][i] }, {
            yPercent: [-14, 6, -22][i],
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true }
          });
        });
      });
      gsap.utils.toArray<HTMLElement>('.bm__item').forEach(el => {
        gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 92%' }
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lang] }
  );

  return (
    <section className="section bm" id="segnalibri" ref={root}>
      <div className="wrap bm__grid">
        <div className="bm__text">
          <Kicker>{t.kicker}</Kicker>
          <SplitText key={lang} text={t.title} tag="h2" className="h2" splitType="chars" effect="wave" textAlign="left" />
          <p data-reveal>{t.text}</p>
          <ul className="bm__features" data-reveal>
            {t.features.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div data-reveal>
            <a className="btn btn--dark" href="#contatti" onClick={e => (e.preventDefault(), scrollToId('contatti'))}>
              {t.cta} <Arrow />
            </a>
          </div>
        </div>
        <div className="bm__cols">
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
  return (
    <footer className="footer">
      <div className="footer__big" aria-hidden="true">AlinneArt</div>
      <div className="wrap footer__row">
        <span>© {new Date().getFullYear()} AlinneArt · {t.rights}</span>
        <div className="footer__links">
          <a href={t.privacyUrl} target="_blank" rel="noreferrer">{t.privacy}</a>
          <a href={t.cookieUrl} target="_blank" rel="noreferrer">{t.cookie}</a>
          <a href={social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><IconInstagram /></a>
          <a href={social.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"><IconTikTok /></a>
          <button onClick={() => scrollToId('top')}>{t.top} ↑</button>
        </div>
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
