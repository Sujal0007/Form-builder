import { renderLandingPage, renderPreviewPage, renderFormBuilder, renderSavedFormById, renderFormPreview } from './main.js';

const routes = {
  '/': renderLandingPage,
  '/preview': renderPreviewPage,
  '/create': renderFormBuilder,
  '/form/:id': renderSavedFormById,
  '/form-preview/:id': renderFormPreview
};

function getRoute() {
  const path = window.location.pathname;

  if (path.startsWith('/form/')) {
    const parts = path.split('/');
    if (parts.length === 3) {
      return { path: '/form/:id', id: parts[2] };
    }
  } else if (path.startsWith('/form-preview/')) {
    const parts = path.split('/');
    if (parts.length === 3) {
      return { path: '/form-preview/:id', id: parts[2] };
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

  if (path === '/form/:id' || path === '/form-preview/:id') {
    route(id);
  } else {
    route();
  }
}

window.addEventListener('popstate', router);

