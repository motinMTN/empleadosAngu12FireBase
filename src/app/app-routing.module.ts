import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListEmpleadosComponent } from './empleado/components/list-empleados/list-empleados.component';
import { NotFound404Component } from './shared/components/not-found404/not-found404.component';

const routes: Routes = [
  { path: '', pathMatch:'full',  redirectTo:'list-empleados' },
  { path: 'list-empleados', component: ListEmpleadosComponent },
  { path: 'create-empleado', loadChildren: ()=> import('./empleado/empleado.module').then(m => m.EmpleadoModule) },
  { path: 'edit-empleado/:id', loadChildren: ()=> import('./empleado/empleado.module').then(m => m.EmpleadoModule) },
  { path: '**', pathMatch:'full', component: NotFound404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
