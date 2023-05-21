import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: async () =>
      (await import('./client/feature/client.module')).ClientModule,
  },
];
