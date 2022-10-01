import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Empleado } from 'src/app/interfaces/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {
  createEmpleado: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  textLabel = 'Seleccionar archivo';
  fileFromInput!: File;
  urlImage!: Observable<string>;

  constructor(private fb: FormBuilder,
              private _empleadoService: EmpleadoService,
              private router: Router,
              private toastr: ToastrService) {

    this.createEmpleado = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      salario: ['', [Validators.required, Validators.pattern("^[1-9]+[0-9]*(([.][0-9]*))*$")]]
    });
  }

  ngOnInit(): void {
  }

  agregarEmpleado(){
    this.submitted = true;
    if (this.createEmpleado.invalid) return;

    this.loading = true;

    const empleado: Empleado = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }

    this._empleadoService.preAddAndUpdateEmpleado(empleado, this.fileFromInput).then(() =>{

      this.toastr.success('El empleado fue registrado con exito!', 'Empleado Registrado',{
        positionClass: 'toast-bottom-right',
      });

      this.loading = false;
      this.router.navigate(['/list-empleados']);
    }).catch(error => {
      this.toastr.error('No se ha podido registrar el empleado! '+error, 'Empleado no registrado');
      this.loading = false;
    })
    this.createEmpleado.reset();
    this.textLabel = 'Seleccionar archivo';
    this.createEmpleado.controls['documento'].patchValue('');
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

  loadImage(event: any){

    if (event.target.files.length>0){

      this.textLabel = event.target.files[0].name;
      var fileName = event.target.files[0].name;
      var fileSize = event.target.files[0].size;
      this.fileFromInput = event.target.files[0];

      if(fileSize > 2000000){
        this.toastr.error('El archivo no debe superar 2MB, intente con otro de menor peso.','Tamaño máx. superado.');
        this.textLabel = '';
        this.createEmpleado.controls['documento'].patchValue('');
      }else{

        var ext = fileName.split('.').pop();
        ext = ext.toLowerCase();

        switch (ext) {
          case 'jpg':
          case 'jpeg':
          case 'png': break;
          default:
            this.textLabel = 'Seleccionar archivo';
            this.toastr.error('El archivo no tiene la extensión adecuada.','Formato no válido.');
            this.createEmpleado.controls['documento'].patchValue('');
        }
      }
    }else{
      this.textLabel = 'Seleccionar archivo';
    }

  }

}
