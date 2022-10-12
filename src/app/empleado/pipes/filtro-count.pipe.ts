import { Pipe, PipeTransform } from '@angular/core';
import { Empleado } from '../interfaces/empleado';

@Pipe({
  name: 'filtroCount'
})
export class FiltroCountPipe implements PipeTransform {
  public countData = 0;

  transform(empleados: Empleado[], search: string = ''): any {
    if( search.length === 0)
      return this.countData = empleados.length;

    search = search.toLowerCase();
    let filteredEmpleados = empleados.filter( empleado => empleado.nombre.toLowerCase().includes( search ) || empleado.apellido.toLowerCase().includes( search ) );
    this.countData = filteredEmpleados.length;

    return this.countData;
  }

}
