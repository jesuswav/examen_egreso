import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'examen',
    loadComponent: () =>
      import('./pages/examen/examen.page').then((m) => m.ExamenPage),
    children: [
      {
        path: 'modulo/:id',
        loadComponent: () =>
          import('./pages/examen-modulo/examen-modulo.component').then(
            (m) => m.ExamenModuloComponent
          ),
      },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./pages/inicio-examen/inicio-examen.component').then(
            (m) => m.InicioExamenComponent
          ),
      },
      {
        path: 'final',
        loadComponent: () =>
          import('./pages/final-examen/final-examen.component').then(
            (m) => m.FinalExamenComponent
          ),
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'admin-tabs',
    loadComponent: () =>
      import('./pages/admin-tabs/admin-tabs.page').then((m) => m.AdminTabsPage),
    children: [
      {
        path: 'add-users',
        loadComponent: () =>
          import('./pages/add-users/add-users.page').then(
            (m) => m.AddUsersPage
          ),
      },
      {
        path: 'admin-tabs',
        loadComponent: () =>
          import('./pages/admin-tabs/admin-tabs.page').then(
            (m) => m.AdminTabsPage
          ),
      },
      {
        path: 'question-bank',
        loadComponent: () =>
          import('./pages/question-bank/question-bank.page').then(
            (m) => m.QuestionBankPage
          ),
      },
      {
        path: 'resultados',
        loadComponent: () =>
          import('./pages/resultados/resultados.page').then(
            (m) => m.ResultadosPage
          ),
      },
      {
        path: '',
        redirectTo: 'add-users',
        pathMatch: 'full',
      },
      {
        path: 'modulos',
        loadComponent: () =>
          import('./pages/modulos/modulos.page').then((m) => m.ModulosPage),
      },
    ],
  },
];
