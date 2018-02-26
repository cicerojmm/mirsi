import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Camera } from "@ionic-native/camera";

import { Usuario } from '../../domain/usuario/usuario';
import { UsuarioDao } from '../../domain/usuario/usuario-dao';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html'
})
export class PerfilPage {

  private url: any;

  constructor(public navCtrl: NavController, private camera: Camera, 
                private usuarioDao: UsuarioDao) {
    
  }

  get usuario() {
    return this.usuarioDao.retornaUsuarioLogado();
  }

  ngOnInit() {
    this.url = this.usuarioDao.retornarAvatar();
  }

  tiraFoto () {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.FILE_URI,
      saveToPhotoAlbum: true,
      correctOrientation: true
    }).then(url => {
      this.usuarioDao.salvarAvatar(url);
      this.url = url;
    })
    .catch(err => console.log(err))
  }

}
