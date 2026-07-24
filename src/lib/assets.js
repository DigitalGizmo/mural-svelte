// Asset path helpers — encodes the deployed naming convention.
// Assets live in public/ (panels/, pops/, images/) and are served at BASE_URL.
// Replaces the old Gatsby GATSBY_ASSET_PATH indirection; every path is derived
// purely from JSON fields (ordinal, slug, articleType, learnmoreType, indices).

const BASE = import.meta.env.BASE_URL.replace(/\/$/, ''); // '' when served at root

const p = (n) => `p${n}`; // panelNum prefix, n = panel ordinal

// Panel background + prev/next preview strips
export const panelBg = (slug) => `${BASE}/panels/panelpics/${slug}.jpg`;
export const panelPrev = (slug) => `${BASE}/panels/panelpics/${slug}-prev.jpg`;
export const panelNext = (slug) => `${BASE}/panels/panelpics/${slug}-next.jpg`;

// Article intro/fore image
export const articleImg = (ordinal, articleType) =>
  `${BASE}/panels/articlepics/${p(ordinal)}-${articleType}.jpg`;

// Hotspot object image (hotspot slug is an accession number)
export const hotspotImg = (ordinal, hotspotSlug) =>
  `${BASE}/pops/hotspot/${p(ordinal)}-${hotspotSlug}.jpg`;

// Learn-more thumbnail (grid tile that opens the learn-more pop)
export const learnmoreThumb = (ordinal, articleType, learnmoreType) =>
  `${BASE}/pops/learnmore/thumbpics/${p(ordinal)}-${articleType}-${learnmoreType}.jpg`;

// Learn-more full slide image (n is 1-based slide index)
export const learnmoreSlide = (ordinal, articleType, learnmoreType, n) =>
  `${BASE}/pops/learnmore/fullpics/${p(ordinal)}-${articleType}-${learnmoreType}-${n}.jpg`;

// Voice audio clip (partNum from voiceSet node)
export const voiceAudio = (ordinal, articleType, learnmoreType, partNum) =>
  `${BASE}/pops/learnmore/media/${p(ordinal)}-${articleType}-${learnmoreType}-${partNum}.mp3`;

// Video + poster (learnmoreType === 'video')
export const videoSrc = (ordinal, articleType, learnmoreType) =>
  `${BASE}/pops/learnmore/media/${p(ordinal)}-${articleType}-${learnmoreType}.mp4`;
export const videoPoster = (ordinal, articleType, learnmoreType) =>
  `${BASE}/pops/learnmore/media/${p(ordinal)}-${articleType}-${learnmoreType}.jpg`;

// Prev/next arrow images (panel navigation + slideshow)
export const arrowPrev = `${BASE}/panels/panelpics/arrow-prev.png`;
export const arrowNext = `${BASE}/panels/panelpics/arrow-next.png`;
export const arrowGrayPrev = `${BASE}/panels/panelpics/arrow-gray-prev.png`;
export const arrowGrayNext = `${BASE}/panels/panelpics/arrow-gray-next.png`;

// Site chrome
export const miniNav = (ordinal) => `${BASE}/images/mini-nav-${ordinal}.jpg`;
export const logo = () => `${BASE}/images/msm-logo.svg`;
