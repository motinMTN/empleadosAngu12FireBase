import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empleado } from 'src/app/interfaces/empleado';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {
  createEmpleado: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
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

    console.log({empleado});
    this.createEmpleado.reset();

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
