import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Empleado } from 'src/app/empleado/interfaces/empleado';
import { EmpleadoService } from 'src/app/empleado/services/empleado.service';
import Swal from 'sweetalert2';
import { FiltroCountPipe } from '../../pipes/filtro-count.pipe';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css'],
})
export class ListEmpleadosComponent implements OnInit, OnDestroy {

  @ViewChild('empleadosCount') empleadosCount!: ElementRef;
  empleados: Empleado[] = [];
  loading: boolean = false;
  listObservers!: Array<Subscription>;
  page: number = 0;
  elementsByPage: number = 3;
  currentPage: number = 1;
  totalElements!: number;
  lastPage!: number;
  search: string = '';

  constructor(private _empleadoService: EmpleadoService,
              private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.obtenerEmpleados();
  }

  obtenerEmpleados(){
    this.loading = true;
    const loadEmpleados = this._empleadoService.obtenerEmpleados().subscribe(data => {
      this.empleados = data;
      this.setPaginate(data.length);
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

  nextPage(){
    if(this.currentPage < this.lastPage){
      this.currentPage++;
      this.page += this.elementsByPage;
    }
  }

  prevPage(){
    if(this.currentPage > 1){
      this.currentPage--;
      this.page -= this.elementsByPage;
    }
  }

  onSearchEmpleado( search:string ){
    this.page = 0;
    this.currentPage = 1;
    this.search = search;

    setTimeout(() => {
      this.setPaginate(Number(this.empleadosCount.nativeElement.innerText));
    }, 200);
  }

  setPaginate(totalElements: number){
    if(totalElements === 0)
      this.currentPage = 0;

    this.totalElements = totalElements;
    this.lastPage = Math.ceil(this.totalElements/this.elementsByPage);
  }

  ngOnDestroy(): void {
    this.listObservers.forEach(sub => sub.unsubscribe());
  }

}
