import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/interfaces/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css']
})
export class ListEmpleadosComponent implements OnInit {

  empleados: Empleado[] = [];

  constructor(private _empleadoService: EmpleadoService) { }

  ngOnInit(): void {
    this.obtenerEmpleados();
  }

  obtenerEmpleados(){
    this._empleadoService.obtenerEmpleados().subscribe(data => {
      this.empleados = data;
      console.log(this.empleados);
    });
  }

}
