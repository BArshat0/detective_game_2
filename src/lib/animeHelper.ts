import { animate, stagger } from 'animejs';

export function anime(paramsOrTarget: any, maybeParams?: any) {
  try {
    let targets: any;
    let options: any;

    if (maybeParams) {
      targets = paramsOrTarget;
      options = { ...maybeParams };
    } else if (typeof paramsOrTarget === 'object' && paramsOrTarget !== null) {
      const { targets: t, ...rest } = paramsOrTarget;
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

    return animate(targets, options);
  } catch (err) {
    console.warn('Anime execution error:', err);
  }
}

anime.stagger = stagger;
anime.setDashoffset = (el: any) => {
  if (typeof el?.getTotalLength === 'function') {
    return el.getTotalLength();
  }
  return 1000;
};

export default anime;
