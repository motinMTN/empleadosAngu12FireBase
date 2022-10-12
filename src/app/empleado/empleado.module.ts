import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EmpleadoRoutingModule } from './empleado-routing.module';

import { ListEmpleadosComponent } from './components/list-empleados/list-empleados.component';
import { CreateEmpleadoComponent } from './components/create-empleado/create-empleado.component';
import { FiltroPipe } from './pipes/filtro.pipe';
import { FiltroCountPipe } from './pipes/filtro-count.pipe';


@NgModule({
  declarations: [
    ListEmpleadosComponent,
    CreateEmpleadoComponent,
    FiltroPipe,
    FiltroCountPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmpleadoRoutingModule
  ],
})
export class EmpleadoModule { }
