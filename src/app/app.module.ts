import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from "ngx-toastr";
import { EmpleadoModule } from './empleado/empleado.module';

import { AppComponent } from './app.component';

import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { NotFound404Component } from './shared/components/not-found404/not-found404.component';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NotFound404Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    EmpleadoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
