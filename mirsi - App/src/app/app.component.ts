import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Vibration } from "@ionic-native/vibration"

import { TabsPage } from '../pages/tabs/tabs';
import { FormularioPage } from '../pages/formulario/formulario';
import { FCM, NotificationData } from "@ionic-native/fcm";
import { UsuarioDao } from '../domain/usuario/usuario-dao';

//ionic cordova run android --device -lc --debug

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private rootPage: any;

  constructor(private platform: Platform, private statusBar: StatusBar, 
                private splashScreen: SplashScreen, private fcm: FCM, private vibration: Vibration,
                private usuarioDao: UsuarioDao) {
   
    this.definePaginaInicial();
    this.inicializaApp();
  }

  inicializaApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.fcm.getToken()
        .then((token:string)=>{
          console.log("O token é: ",token);
        })
        .catch(error=>{
          console.error(error);
        });

      this.fcm.onTokenRefresh().subscribe(
        (token: string) => console.log("Novo token", token),
        error => console.error(error)
      );

      this.fcm.onNotification().subscribe(
        (data: NotificationData) => {
          this.vibration.vibrate(1000);
          
          if(data.wasTapped) {
            console.log("Received in background", JSON.stringify(data));
          } else {
            console.log("Received in foreground", JSON.stringify(data));
          }
          
          

         }, error => {
          console.error("Error in notification", error);
         }
      );

    });
  }

  definePaginaInicial() {
    let usuario = this.usuarioDao.consulta();

    usuario.then(data  => {
      if(data != null) {
        this.rootPage = TabsPage;
      } else {
        this.rootPage = FormularioPage;
      }
    });
    

  }

}
