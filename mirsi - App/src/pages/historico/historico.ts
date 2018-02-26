import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MonitoramentoService } from '../../domain/monitoramento/monitoramento-service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-historico',
  templateUrl: 'historico.html'
})
export class HistoricoPage {

  private listaFirebase: Observable<any[]>;
  private monitoramento: string;
  private arrayData: string[];
  private arrayDados: any[];

  constructor(public navCtrl: NavController, private service: MonitoramentoService) {
    this.monitoramento = "bpm";
  }

  ngOnInit() {
    this.listaFirebase = this.service.atualizaListaOrdenada();

    this.listaFirebase.subscribe(dados => {
      
      this.arrayDados = [];
      this.arrayData = [];

      if(dados.length > 0) {
        for(let dado of dados) {
          this.criaArrayDados(dado);
        }
      }

    });
    
 
    
  }

  criaArrayDados(dados) {
    let timestamp = dados.timestamp.split(" ");
    let dataAtual: string = dados.data;
    let tamanhoArray = this.arrayData.length;

    if(tamanhoArray == 0 || this.arrayData[tamanhoArray-1] != dataAtual) {
      this.arrayData.push(dataAtual);
      this.arrayData.reverse();
    }

    console.log(this.arrayData);
    
    dados.timestamp = timestamp[1];
    this.arrayDados.push(dados);
    this.arrayDados.reverse();
  }

}
