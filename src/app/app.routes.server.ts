import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
    {
    path: '',
    renderMode: RenderMode.Prerender
  },
   {
    path: 'users',
    renderMode: RenderMode.Server
  },
  {
    path: 'user-details/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
