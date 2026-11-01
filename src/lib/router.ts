import { useEffect, useState } from 'react';
import { chapters } from '../content/chapters';

export type Route = { view: 'home' } | { view: 'chapter'; id: string };

const HOME_HASH = '#/';
const ids = new Set(chapters.map((chapter) => chapter.id));

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#\/?/, '').trim();
  return ids.has(raw) ? { view: 'chapter', id: raw } : { view: 'home' };
}

export function hrefFor(id: string) {
  return `#${id}`;
}

export const homeHref = HOME_HASH;

export function goToChapter(id: string) {
  if (window.location.hash === `#${id}`) return false;
  window.location.hash = `#${id}`;
  return true;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}
