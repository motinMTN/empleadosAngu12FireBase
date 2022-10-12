import { Pipe, PipeTransform } from '@angular/core';
import { Empleado } from '../interfaces/empleado';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(empleados: Empleado[], page:number = 0, elementsByPage:number, search: string = ''): Empleado[] {
    if( search.length === 0)
      return empleados.slice(page,page+elementsByPage);

    search = search.toLowerCase();
    let filteredEmpleados = empleados.filter( empleado => empleado.nombre.toLowerCase().includes( search ) || empleado.apellido.toLowerCase().includes( search ) );

    return filteredEmpleados.slice(page,page+elementsByPage);
  }

}
