// Loads all-panels.json and flattens the Relay edges/node nesting into plain
// arrays/objects, so components read `panel.hotspots` instead of
// `panel.hotspotSet.edges[i].node`. Shape is otherwise unchanged.

import raw from '../data/all-panels.json';

const nodes = (set) => (set?.edges ?? []).map((e) => e.node);

function flattenLearnmore(n) {
  return {
    title: n.title,
    learnmoreType: n.learnmoreType, // images | objects | voices | video | credits
    caption: n.caption,
    narrative: n.narrative,
    slides: nodes(n.slideSet).map((s) => ({
      title: s.title,
      caption: s.caption,
      narrative: s.narrative,
    })),
    voices: nodes(n.voiceSet).map((v) => ({
      title: v.title,
      partNum: v.partNum,
      narrative: v.narrative,
    })),
  };
}

function flattenArticle(n) {
  return {
    title: n.title,
    articleType: n.articleType, // intro | fore
    caption: n.caption,
    narrative: n.narrative,
    learnmores: nodes(n.learnmoreSet).map(flattenLearnmore),
  };
}

function flattenPanel(n) {
  return {
    slug: n.slug,
    title: n.panelTitle,
    blurb: n.panelBlurb,
    ordinal: n.ordinal,
    hotspots: nodes(n.hotspotSet).map((h) => ({
      slug: h.slug,
      title: h.title,
      altTag: h.altTag,
      caption: h.caption,
      narrative: h.narrative,
      x: h.xPosition,
      y: h.yPosition,
    })),
    articles: nodes(n.articleSet).map(flattenArticle),
    // "Visit Our Exhibit" links — shown in the kiosk article view (5 of the 11
    // panels have one); each opens a visit pop.
    visits: nodes(n.visitSet).map((v) => ({ title: v.title, narrative: v.narrative })),
  };
}

const all = nodes(raw.data.allPanels).map(flattenPanel);

// The 11 routed panels (ordinal < 50), in ordinal order.
export const panels = all
  .filter((p) => p.ordinal < 50)
  .sort((a, b) => a.ordinal - b.ordinal);

// The home panel (ordinal 99) — sourced from the same JSON, replaces HomePopContent.js.
export const home = all.find((p) => p.ordinal === 99) ?? null;

export const bySlug = Object.fromEntries(panels.map((p) => [p.slug, p]));
export const slugOrder = panels.map((p) => p.slug);
