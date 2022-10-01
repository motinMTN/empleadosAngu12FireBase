import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Empleado } from '../interfaces/empleado';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  uploadPercent!: Observable<number | undefined>;
  downloadURL!: Observable<string>;

  constructor(private firestore: AngularFirestore,
              private storage: AngularFireStorage) { }

  preAddAndUpdateEmpleado(empleado: Empleado, fileFromInput: File): Promise<any>{
    return new Promise((resolve) =>{
      resolve(this.uploadImage(empleado, fileFromInput));
    })
  }

  private uploadImage(empleado: Empleado, fileFromInput: File){
    const id = Math.random().toString(36).substring(2);
    const fileName = `profile_${fileFromInput.name.split('.')[0]+id}`;
    const file = fileFromInput;
    const filePath = `uploads/${fileName}`;
    const ref =  this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges();

    task.snapshotChanges()
    .pipe(
      finalize( () => {
        ref.getDownloadURL().subscribe( urlImage => {
          this.downloadURL = urlImage;
          this.agregarEmpleado(empleado);
        })
      })
    ).subscribe();

  }

  private agregarEmpleado(empleado: Empleado): Promise<DocumentReference<unknown>>{
    const empleadoObj = {
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      documento: this.downloadURL,
      salario: empleado.salario,
      fechaCreacion: empleado.fechaCreacion,
      fechaActualizacion: empleado.fechaActualizacion
    }
    return this.firestore.collection('empleados').add(empleadoObj);
  }

  obtenerEmpleados(): Observable<Empleado[]>{
    return this.firestore.collection<Empleado>('empleados', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Empleado;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  eliminarEmpleado(id: string): Promise<any>{
    return this.firestore.collection<Empleado>('empleados').doc(id).delete();
  }

}
