import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Empleado } from 'src/app/interfaces/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit, OnDestroy {
  createEmpleado: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  textLabel: string = 'Seleccionar archivo';
  fileFromInput!: any;
  imgURL: any = 'https://via.placeholder.com/150x150.png';
  id: string | null;
  titulo: string = 'Agregar';
  listObservers!: Array<Subscription>;
  imgOriginal: any;

  constructor(private fb: FormBuilder,
              private _empleadoService: EmpleadoService,
              private router: Router,
              private toastr: ToastrService,
              private aRoute: ActivatedRoute) {

    this.createEmpleado = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      salario: ['', [Validators.required, Validators.pattern("^[1-9]+[0-9]*(([.][0-9]*))*$")]]
    });
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
  }

  opcionEmpleado(){
    this.submitted = true;
    if (this.createEmpleado.invalid) return;

    if(this.id === null){
      this.agregarEmpleado();
    }else{
      Swal.fire({
        title: '¿Estás seguro de actualizar la información del empleado?',
        text: 'No podrás recuperar la información anterior',
        icon: 'warning',
        heightAuto: false,
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.editarEmpleado(this.id!);
        }
      });
    }

  }

  private agregarEmpleado(){

    this.loading = true;

    const empleado: Empleado = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }

    this._empleadoService.preAddEmpleado(empleado, this.fileFromInput).then(() =>{

      this.toastr.success('El empleado fue registrado con exito!', 'Empleado Registrado',{
        positionClass: 'toast-bottom-right',
      });

      setTimeout(() => {
        this.loading = false;
        this.router.navigate(['/list-empleados']);
      }, 1000);

    }).catch(error => {
      this.toastr.error('No se ha podido registrar el empleado! '+error, 'Empleado no registrado');
      this.loading = false;
    })
    this.createEmpleado.reset();
    this.textLabel = 'Seleccionar archivo';
    console.log(this.createEmpleado.controls['documento']);
    this.createEmpleado.controls['documento'].patchValue('');
    this.submitted = false;
  }

  private editarEmpleado(id:string) {
    this.loading = true;

    const empleado: Empleado = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaActualizacion: new Date()
    }

    if(this.imgURL === this.imgOriginal){
      empleado.documento = this.imgOriginal;
      this.fileFromInput = null;
    }

    this._empleadoService.actualizarEmpleado(id,empleado,this.fileFromInput,this.imgOriginal).then(() =>{

      this.toastr.success('El empleado fue actualizado con exito!', 'Empleado Actualizado',{
        positionClass: 'toast-bottom-right',
      });

      setTimeout(() => {
        this.loading = false;
        this.router.navigate(['/list-empleados']);
      }, 1000);

    }).catch(error => {
      this.toastr.error('No se ha podido actualizar el empleado! '+error, 'Empleado no actualizado');
      console.log({error});

      this.loading = false;
    })
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
    this.createEmpleado.controls['documento'].addValidators([Validators.required]); //requerido para cuando se va a editar algun empleado
    if (event.target.files  && event.target.files[0]){

      this.fileFromInput = event.target.files[0];

      this.textLabel = this.fileFromInput.name;
      var fileName = this.fileFromInput.name;
      var fileSize = this.fileFromInput.size;

      if(fileSize > 2000000){
        this.toastr.error('El archivo no debe superar 2MB, intente con otro de menor peso.','Tamaño máx. superado.');
        this.textLabel = '';
        this.createEmpleado.controls['documento'].patchValue('');
      }else{

        var ext = fileName.split('.').pop();
        ext = ext!.toLowerCase();

        switch (ext) {
          case 'jpg':
          case 'jpeg':
          case 'png':
            let reader = new FileReader();
            reader.onload = () =>
            {
              this.imgURL = reader.result as string;
            }
            reader.readAsDataURL(this.fileFromInput);
            break;
          default:
            this.textLabel = 'Seleccionar archivo';
            this.toastr.error('El archivo no tiene la extensión adecuada.','Formato no válido.');
            this.createEmpleado.controls['documento'].patchValue('');
            this.imgURL = 'https://via.placeholder.com/150x150.png';
        }
      }
    }else{
      this.textLabel = 'Seleccionar archivo';
      this.imgURL = 'https://via.placeholder.com/150x150.png';
    }

  }

  esEditar(){
    if(this.id != null){
      this.loading = true;
      this.titulo = 'Actualizar';
      const loadEmpleado = this._empleadoService.obtenerEmpleado(this.id).subscribe( data => {

        this.createEmpleado.patchValue({
          nombre: data.payload.data()['nombre'],
          apellido: data.payload.data()['apellido'],
          salario: data.payload.data()['salario']
        });

        this.textLabel = data.payload.data()['imageName'];
        this.imgURL = data.payload.data()['documento'];
        this.imgOriginal = this.imgURL;

        if (this.textLabel && this.imgURL) {
          this.createEmpleado.controls['documento'].removeValidators([Validators.required]);
          this.createEmpleado.controls['documento'].updateValueAndValidity();
        }else{
          this.createEmpleado.controls['documento'].markAsTouched();
          this.createEmpleado.controls['documento'].updateValueAndValidity();
        }
        this.loading = false;
      });
      this.listObservers = [loadEmpleado];
    }
  }

  ngOnDestroy(): void {
    console.log(`%c********** ngOnDestroy`, `color:orange`);
    this.listObservers?.forEach(sub => sub.unsubscribe());
  }

}
