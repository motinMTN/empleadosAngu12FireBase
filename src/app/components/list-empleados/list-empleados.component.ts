import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Empleado } from 'src/app/interfaces/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css']
})
export class ListEmpleadosComponent implements OnInit, OnDestroy {

  empleados: Empleado[] = [];
  loading: boolean = false;
  listObservers!: Array<Subscription>;

  constructor(private _empleadoService: EmpleadoService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.obtenerEmpleados();
  }

  obtenerEmpleados(){
    this.loading = true;
    const loadEmpleados = this._empleadoService.obtenerEmpleados().subscribe(data => {
      this.empleados = data;
      console.log(this.empleados);
      this.loading = false;
    });
    this.listObservers = [loadEmpleados];
  }

  eliminarEmpleado(empleado: Empleado){
    Swal.fire({
      title: `¿Estás seguro de eliminar al empleado: ${empleado.nombre}?`,
      text: 'No podrás recuperar esta información',
      icon: 'warning',
      heightAuto: false,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      this.loading = true;
      if (result.value) {
        this._empleadoService.eliminarEmpleado(empleado).then( () => {
          this.toastr.info('El empleado fue eliminado con exito!', 'Empleado Eliminado',{
            positionClass: 'toast-bottom-right',
          });
        }).catch(error => {
          this.toastr.error('No se ha podido eliminar el empleado! '+error, 'Empleado no eliminado');
        })
      }
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    console.log(`%c********** ngOnDestroy`, `color:blue`);
    this.listObservers.forEach(sub => sub.unsubscribe());
  }

}
