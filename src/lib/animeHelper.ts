import { animate, stagger } from 'animejs';

export function anime(paramsOrTarget: unknown, maybeParams?: Record<string, unknown>) {
  try {
    let targets: unknown;
    let options: Record<string, unknown>;

    if (maybeParams) {
      targets = paramsOrTarget;
      options = { ...maybeParams };
    } else if (typeof paramsOrTarget === 'object' && paramsOrTarget !== null) {
      const { targets: t, ...rest } = paramsOrTarget as { targets?: unknown; [key: string]: unknown };
      targets = t;
      options = rest;
    } else {
      targets = paramsOrTarget;
      options = {};
    }

    if (options.easing && !options.ease) {
      let e = String(options.easing).replace(/^ease/i, '');
      if (e) {
        e = e.charAt(0).toLowerCase() + e.slice(1);
      }
      options.ease = e || 'outQuad';
    }

    return animate(targets as Parameters<typeof animate>[0], options as Parameters<typeof animate>[1]);
  } catch (err) {
    console.warn('Anime execution error:', err);
  }
}

anime.stagger = stagger;
anime.setDashoffset = (el: SVGGeometryElement | null) => {
  if (el && typeof el.getTotalLength === 'function') {
    return el.getTotalLength();
  }
  return 1000;
};

export default anime;

