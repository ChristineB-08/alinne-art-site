export type Lang = 'it' | 'en';

const it = {
  meta: {
    title: 'AlinneArt | Disegni sul Vetro – Arte unica e personalizzata',
    description:
      "Scopri l'arte dei disegni su vetro di AlinneArt: creazioni uniche e personalizzate, dipinte a mano e ispirate ad anime e manga."
  },
  nav: {
    glass: 'Il Vetro',
    characters: 'Personaggi',
    bookmarks: 'Segnalibri',
    author: 'Autrice',
    contact: 'Contatti',
    cta: 'Commissiona'
  },
  loader: 'Disegni sul vetro',
  hero: {
    eyebrow: 'Disegni sul vetro · Dipinti a mano',
    line1: 'Alinne',
    line2: 'Art',
    sub: "L'arte che dà vita ai personaggi dei tuoi anime e manga preferiti.",
    ctaPrimary: 'Commissiona un’opera',
    ctaSecondary: 'Guarda le opere',
    badge: 'DISEGNI SUL VETRO ✦ FATTO A MANO ✦ ',
    scroll: 'Scorri'
  },
  marquee: ['Disegni sul vetro', 'Anime', 'Manga', 'Segnalibri', 'Pezzi unici', 'Su commissione'],
  glass: {
    kicker: '01 — La tecnica',
    title: 'Il Disegno sul Vetro',
    p1: "Immagina di avere tra le mani una superficie di vetro trasparente, che aspetta solo di essere trasformata in un'opera d'arte. Con i colori acrilici, ogni pennellata diventa un sussurro di creatività che si fonde con la luce, dando vita a un mondo di immagini che sembrano danzare sul vetro.",
    p2: "Il vetro, un materiale freddo e silenzioso, si trasforma sotto il tocco dell'artista, diventando un palcoscenico per storie ed emozioni. Quando il disegno prende forma, il vetro non è più solo vetro. È un oggetto che vive, respira, racconta.",
    quote: 'Il vetro non è più solo vetro.'
  },
  process: {
    kicker: 'Come nasce un’opera',
    title: 'Dal tuo personaggio al vetro',
    steps: [
      { t: 'L’idea', d: 'Mi racconti il personaggio, la scena o il momento che ami. Insieme scegliamo formato e stile.' },
      { t: 'Il contorno', d: 'Traccio a mano le linee del disegno direttamente sul vetro, con cura per ogni dettaglio.' },
      { t: 'Il colore', d: 'Gli acrilici vengono stesi strato dopo strato: luci, ombre e sfumature prendono vita.' },
      { t: 'La consegna', d: 'L’opera viene rifinita, protetta e imballata con attenzione per arrivare perfetta da te.' }
    ]
  },
  characters: {
    kicker: '02 — Galleria',
    title: 'I personaggi che respirano sul vetro',
    text: "Sul vetro, il pennello intreccia il silenzio, dove il tratto non è solo mano, ma pensiero che prende forma. Ogni disegno è un respiro sospeso tra il mondo e l'idea, un'anima che nasce dal nulla, intrappolata nel cristallo.",
    hint: 'Trascina o scorri',
    cta: 'Vuoi vedere il tuo personaggio preferito prendere vita sul vetro?',
    ctaLink: 'Contattami',
    alt: 'Disegno su vetro di un personaggio anime'
  },
  bookmarks: {
    kicker: '03 — Segnalibri',
    title: 'Ordina il tuo segnalibro',
    text: 'Piccole opere da portare sempre con te, tra le pagine del tuo libro o manga preferito. Ogni segnalibro è dipinto a mano e rifinito con una nappina scintillante: puoi sceglierne uno della collezione o chiederne uno personalizzato.',
    features: ['Dipinti a mano', 'Nappina in tinta', 'Personalizzabili', 'Idea regalo perfetta'],
    cta: 'Ordina il tuo',
    alt: 'Segnalibro dipinto a mano'
  },
  author: {
    kicker: '04 — L’autrice',
    title: 'Sono Alinne',
    p1: "Un'artista che ama trasformare il silenzio del vetro in un mondo di colori e immagini.",
    p2: 'La passione per anime e manga mi accompagna da sempre: con i pennelli cerco di catturare l’anima dei personaggi che hanno segnato le nostre storie, perché ognuno possa tenerne un frammento tra le mani.',
    stats: [
      { n: '100%', l: 'fatto a mano' },
      { n: '1', l: 'pezzo unico, ogni volta' },
      { n: '∞', l: 'personaggi possibili' }
    ],
    alt: 'Alinne, l’artista'
  },
  contact: {
    kicker: '05 — Contatti',
    title: 'Creiamo qualcosa di unico',
    text: 'Sei un vero appassionato di anime e manga? Immagina il tuo personaggio preferito con un tocco artistico speciale! Ogni disegno è fatto a mano con cura, trasformando il cristallo in una finestra sul tuo mondo immaginario. Scrivimi: sarò felice di creare qualcosa di unico per te.',
    name: 'Nome',
    email: 'Email',
    type: 'Cosa desideri?',
    types: ['Disegno sul vetro', 'Segnalibro', 'Altro'],
    message: 'Raccontami la tua idea…',
    send: 'Invia messaggio',
    sending: 'Invio…',
    ok: 'Grazie! Il tuo messaggio è stato inviato. Ti risponderò al più presto.',
    err: 'Qualcosa è andato storto. Riprova o scrivimi su Instagram.',
    follow: 'Seguimi'
  },
  footer: {
    rights: 'Tutti i diritti riservati.',
    privacy: 'Privacy Policy',
    cookie: 'Cookie Policy',
    top: 'Torna su',
    privacyUrl: 'https://www.iubenda.com/privacy-policy/99034147',
    cookieUrl: 'https://www.iubenda.com/privacy-policy/99034147/cookie-policy'
  }
};

export type Dict = typeof it;

const en: Dict = {
  meta: {
    title: 'AlinneArt | Glass Drawings – Unique, personalised art',
    description:
      'Discover the art of glass drawing with AlinneArt: unique, personalised, hand-painted pieces inspired by anime and manga.'
  },
  nav: {
    glass: 'Glass',
    characters: 'Characters',
    bookmarks: 'Bookmarks',
    author: 'Artist',
    contact: 'Contact',
    cta: 'Commission'
  },
  loader: 'Glass drawings',
  hero: {
    eyebrow: 'Glass drawings · Hand painted',
    line1: 'Alinne',
    line2: 'Art',
    sub: 'Art that brings your favourite anime and manga characters to life.',
    ctaPrimary: 'Commission a piece',
    ctaSecondary: 'See the work',
    badge: 'GLASS DRAWINGS ✦ HANDMADE ✦ ',
    scroll: 'Scroll'
  },
  marquee: ['Glass drawings', 'Anime', 'Manga', 'Bookmarks', 'One of a kind', 'Made to order'],
  glass: {
    kicker: '01 — The technique',
    title: 'Glass Drawing',
    p1: 'Imagine holding a transparent glass surface, just waiting to be transformed into a work of art. With acrylic colours, every brushstroke becomes a whisper of creativity that blends with light, bringing images to life as if they were dancing on the glass.',
    p2: "Glass, a cold and silent material, transforms under the artist's touch, becoming a stage for stories and emotions. Once the drawing takes shape, the glass is no longer just glass. It becomes a living, breathing, storytelling object.",
    quote: 'The glass is no longer just glass.'
  },
  process: {
    kicker: 'How a piece is born',
    title: 'From your character to the glass',
    steps: [
      { t: 'The idea', d: 'Tell me about the character, scene or moment you love. Together we choose the size and style.' },
      { t: 'The outline', d: 'I trace the line art by hand directly onto the glass, paying attention to every detail.' },
      { t: 'The colour', d: 'Acrylics go on layer after layer: light, shadow and shading slowly come alive.' },
      { t: 'Delivery', d: 'The piece is finished, protected and carefully packed so it reaches you in perfect shape.' }
    ]
  },
  characters: {
    kicker: '02 — Gallery',
    title: 'Characters who breathe on glass',
    text: 'On the glass, the brush weaves silence, where the stroke is not just a hand, but a thought taking shape. Each drawing is a breath suspended between the world and the idea, a soul born from nothing, trapped in the crystal.',
    hint: 'Drag or scroll',
    cta: 'Want to see your favourite character come to life on glass?',
    ctaLink: 'Contact me',
    alt: 'Glass drawing of an anime character'
  },
  bookmarks: {
    kicker: '03 — Bookmarks',
    title: 'Order your bookmark',
    text: 'Little artworks to keep with you, between the pages of your favourite book or manga. Every bookmark is hand painted and finished with a sparkling tassel: pick one from the collection or ask for a custom one.',
    features: ['Hand painted', 'Matching tassel', 'Customisable', 'The perfect gift'],
    cta: 'Order yours',
    alt: 'Hand-painted bookmark'
  },
  author: {
    kicker: '04 — The artist',
    title: "I'm Alinne",
    p1: 'An artist who loves turning the silence of glass into a world of colours and images.',
    p2: 'Anime and manga have always been part of my life: with my brushes I try to capture the soul of the characters who shaped our stories, so that everyone can hold a fragment of them in their hands.',
    stats: [
      { n: '100%', l: 'handmade' },
      { n: '1', l: 'unique piece, every time' },
      { n: '∞', l: 'possible characters' }
    ],
    alt: 'Alinne, the artist'
  },
  contact: {
    kicker: '05 — Contact',
    title: "Let's create something unique",
    text: "Are you a true anime and manga fan? Imagine your favourite character with a special artistic touch! Every drawing is handmade with care, turning glass into a window onto your imaginary world. Write to me: I'll be happy to create something unique for you.",
    name: 'Name',
    email: 'Email',
    type: 'What would you like?',
    types: ['Glass drawing', 'Bookmark', 'Something else'],
    message: 'Tell me about your idea…',
    send: 'Send message',
    sending: 'Sending…',
    ok: "Thank you! Your message has been sent. I'll get back to you soon.",
    err: 'Something went wrong. Please try again or message me on Instagram.',
    follow: 'Follow me'
  },
  footer: {
    rights: 'All rights reserved.',
    privacy: 'Privacy Policy',
    cookie: 'Cookie Policy',
    top: 'Back to top',
    privacyUrl: 'https://www.iubenda.com/privacy-policy/91296605',
    cookieUrl: 'https://www.iubenda.com/privacy-policy/91296605/cookie-policy'
  }
};

export const dict: Record<Lang, Dict> = { it, en };

export const characters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => `/img/personaggio${n}.jpg`);
export const bookmarks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => `/img/segnalibri${n}.jpg`);

export const social = {
  instagram: 'https://www.instagram.com/alinne.art/',
  tiktok: 'https://www.tiktok.com/@alinne.art'
};
