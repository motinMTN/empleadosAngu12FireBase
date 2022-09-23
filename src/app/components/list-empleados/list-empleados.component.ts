import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Empleado } from 'src/app/interfaces/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css']
})
export class ListEmpleadosComponent implements OnInit {

  empleados: Empleado[] = [];

  constructor(private _empleadoService: EmpleadoService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.obtenerEmpleados();
  }

  obtenerEmpleados(){
    this._empleadoService.obtenerEmpleados().subscribe(data => {
      this.empleados = data;
      console.log(this.empleados);
    });
  }

  eliminarEmpleado(id: string){
    Swal.fire({
      title: '¿Estás seguro de eliminar al empleado?',
      text: 'No podrás recuperar esta información',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this._empleadoService.eliminarEmpleado(id).then( () => {
          this.toastr.info('El empleado fue eliminado con exito!', 'Empleado Eliminado',{
            positionClass: 'toast-bottom-right',
          });
        }).catch(error => {
          this.toastr.error('No se ha podido eliminar el empleado! '+error, 'Empleado no eliminado');
        })
      }
    })
  }

}
