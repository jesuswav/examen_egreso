import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTabsPage } from './admin-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: AdminTabsPage,
    children: [
      {
        path: 'add-users',
        loadChildren: () => import('../add-users/add-users.page').then(m => m.AddUsersPage)
      },
      {
        path: 'question-bank',
        loadChildren: () => import('../question-bank/question-bank.page').then(m => m.QuestionBankPage)
      },
      {
        path: 'modulos',
        loadChildren: () => import('../modulos/modulos.page').then(m => m.ModulosPage)
      },
      {
        path: 'resultados',
        loadChildren: () => import('../resultados/resultados.page').then(m => m.ResultadosPage)
      },
      {
        path: '',
        redirectTo: '/admin-tabs/add-users',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminTabsPageRoutingModule {}