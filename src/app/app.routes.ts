import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'examen',
    loadComponent: () => import('./pages/examen/examen.page').then(m => m.ExamenPage),
     },
{
  path: 'admin-tabs',
  loadComponent: () => import('./pages/admin-tabs/admin-tabs.page').then(m => m.AdminTabsPage),
  children: [
    {
      path: 'add-users',
      loadComponent: () => import('./pages/add-users/add-users.page').then( m => m.AddUsersPage)
    },
    {
      path: 'admin-tabs',
      loadComponent: () => import('./pages/admin-tabs/admin-tabs.page').then( m => m.AdminTabsPage)
    },
    {
      path: 'question-bank',
      loadComponent: () => import('./pages/question-bank/question-bank.page').then( m => m.QuestionBankPage)
      
    },
    {
      path: 'resultados',
      loadComponent: () => import('./pages/resultados/resultados.page').then( m => m.ResultadosPage)      
    },
    {
      path: '',
      redirectTo: 'add-users',
      pathMatch: 'full'
    },
    {
      path: 'modulos',
      loadComponent: () => import('./pages/modulos/modulos.page').then( m => m.ModulosPage)
    },
    {
      path: 'asignacion',
      loadComponent: () => import('./pages/asignacion/asignacion.page').then( m => m.AsignacionPage)
    },
    ]
  },
 
  
  
];
