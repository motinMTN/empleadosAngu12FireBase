import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Empleado } from '../interfaces/empleado';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  constructor(private firestore: AngularFirestore) { }

  agregarEmpleado(empleado: Empleado): Promise<any>{
    return this.firestore.collection('empleados').add(empleado);
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
