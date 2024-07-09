import { renderLandingPage, renderPreviewPage, renderFormBuilder, renderSavedFormById } from './main.js';

const routes = {
  '/': renderLandingPage,
  '/preview': renderPreviewPage,
  '/create': renderFormBuilder,
  '/form/:id': renderSavedFormById
};

function getRoute() {
  const path = window.location.pathname;

  if (path.startsWith('/form/')) {
    const parts = path.split('/');
    if (parts.length === 3) {
      return { path: '/form/:id', id: parts[2] };
    }
  }

  return { path };
}
export function navigate(path) {
  history.pushState({}, "", path);
  router();
}

export function router() {
  const { path, id } = getRoute();
  const route = routes[path] || renderLandingPage;

  if (path === '/form/:id') {
    route(id);
  } else {
    route();
  }
}

window.addEventListener('popstate', router);
