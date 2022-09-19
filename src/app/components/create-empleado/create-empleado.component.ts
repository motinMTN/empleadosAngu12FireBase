import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Empleado } from 'src/app/interfaces/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {
  createEmpleado: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder,
              private _empleadoService: EmpleadoService,
              private router: Router,
              private toastr: ToastrService) {

    this.createEmpleado = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      salario: ['', [Validators.required, Validators.pattern("^[1-9]+(([.][0-9]*))*$")]]
    });
  }

  ngOnInit(): void {
  }

  agregarEmpleado(){
    this.submitted = true;
    if (this.createEmpleado.invalid) return;

    const empleado: Empleado = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }

    this._empleadoService.agregarEmpleado(empleado).then(() =>{
      this.toastr.success('El empleado fue registrado con exito!', 'Empleado Registrado',{
        positionClass: 'toast-bottom-right',
      });
      this.router.navigate(['/list-empleados']);
    }).catch(error => {
      this.toastr.error('No se ha podido registrar el empleado! '+error, 'Empleado no registrado');
    })
    this.createEmpleado.reset();
    this.submitted = false;
  }

  onlyLetters(event: any){
    return (event.charCode == 209 || event.charCode == 241 || event.charCode == 32 || (event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122));
  }

  onlyNumbers(event: any): Boolean{
    let charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

}
