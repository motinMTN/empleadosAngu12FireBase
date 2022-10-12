import { NgModule } from '@angular/core';
import { CreateEmpleadoComponent } from './components/create-empleado/create-empleado.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: CreateEmpleadoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadoRoutingModule { }
