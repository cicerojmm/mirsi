import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HistoricoPage } from '../pages/historico/historico';
import { PerfilPage } from '../pages/perfil/perfil';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { FormularioPage } from '../pages/formulario/formulario';
import { TabsPage } from '../pages/tabs/tabs';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from "@ionic-native/fcm";
import { DatePicker } from "@ionic-native/date-picker";
import { Camera } from "@ionic-native/camera";
import { Vibration } from "@ionic-native/vibration"
import { Storage } from '@ionic/storage';

import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { MonitoramentoService } from '../domain/monitoramento/monitoramento-service';
import { UsuarioDao } from '../domain/usuario/usuario-dao';


export const environment = {
  //necessário acrestar as informações
  firebase: {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: ""
  }

};

function provideStorage() {
  return new Storage({
    name: 'mirsi_db',
    storeName: 'usuario'
  });
                    
}



@NgModule({
  declarations: [
    MyApp,
    HistoricoPage,
    PerfilPage,
    DashboardPage,
    TabsPage,
    FormularioPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, 
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HistoricoPage,
    PerfilPage,
    DashboardPage,
    TabsPage,
    FormularioPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: Storage, useFactory: provideStorage},
    MonitoramentoService,
    FCM,
    DatePicker,
    UsuarioDao,
    Camera,
    Vibration
  ]
})
export class AppModule {}
