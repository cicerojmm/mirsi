import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { DatePicker } from "@ionic-native/date-picker";

import { TabsPage } from '../tabs/tabs';
import { Usuario } from '../../domain/usuario/usuario';
import { UsuarioDao } from '../../domain/usuario/usuario-dao';


@Component({
  selector: 'page-formulario',
  templateUrl: 'formulario.html',
})
export class FormularioPage {

  private usuario: Usuario;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController,
                private usuarioDao: UsuarioDao, private datePicker: DatePicker) {
    this.usuario = new Usuario();

  }

  ngOnInit() {

  }

  salvarFormulario() {

    if (!this.usuario.nome || !this.usuario.dataNascimento || !this.usuario.sexo ||
         !this.usuario.peso || !this.usuario.tipoSanguineo ||  !this.usuario.altura ) {
      this.criarAlerta('Preenchimento obrigatório', 'Você deve preencher todas as informações')
      .present();

      return;
    }

    this.usuarioDao.salva(this.usuario);
    this.criarAlerta('Bem Vindo =)', 'Configuração completa, agora é só acompanhar o monitoramento!')
        .present();

    
    this.usuarioDao.consulta();
    this.navCtrl.setRoot(TabsPage);
  }

  selecionarData () {
    this.datePicker.show({
      date: new Date(),
      mode: 'date'
    })
    .then(date => this.usuario.dataNascimento = date.toISOString())
  }

  criarAlerta(titulo: string, mensagem: string) {
    return this.alertCtrl.create({
      title: titulo,
      subTitle: mensagem,
      buttons: [{ text: 'OK' }]
    });
  }

}
