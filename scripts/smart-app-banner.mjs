// The Smart App Banner (Safari on iPhone and iPad: "Open" / "Get" for the Sober
// Helpline app), shared by the page generator and its validator.
//
// On the pages that have a matching screen in the app, the banner carries an
// app-argument so "Open" lands on that screen instead of the app's home
// screen. The app has routed https://soberhelpline.com/app/* since 4.1 (1).
// Everywhere else the banner just opens the app.

const APP_ID = '6780034996';
const APP_LINK_BASE = 'https://soberhelpline.com/app';

// Website page -> the app screen it corresponds to (same list as
// src/pages/AppLinkFallback.tsx).
const APP_SCREEN_FOR_ROUTE = {
  '/family-squares': 'family-squares',
  '/monday-zoom-registration': 'family-squares',
  '/family-coaching': 'coaching',
  '/family-consultation': 'coaching',
  '/book-consultation': 'coaching',
  '/family-education': 'learn',
};

export const smartAppBannerContent = (route) => {
  const clean = route && route.length > 1 ? route.replace(/\/+$/, '') : route;
  const screen = APP_SCREEN_FOR_ROUTE[clean];
  return screen ? `app-id=${APP_ID}, app-argument=${APP_LINK_BASE}/${screen}` : `app-id=${APP_ID}`;
};

export const smartAppBannerMeta = (route) =>
  `<meta name="apple-itunes-app" content="${smartAppBannerContent(route)}">`;
