import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Observable } from 'rxjs/Observable';

import { MonitoramentoService } from '../../domain/monitoramento/monitoramento-service';
import { UsuarioDao } from '../../domain/usuario/usuario-dao';



@Component({
  selector: 'page-dashborad',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  @ViewChild('graficoBPM') graficoBPM;
  @ViewChild('graficoTemperatura') graficoTemperatura;

  private graficoLinha: any;
  private graficoDonut: any;
  private listaFirebase: Observable<any[]>;
  private temperaturaAtual: number;
  private bpmAtual: number;
  private arrayBpm: number[];
  private arrayTemperatura: number[];
  private arrayTime: string[];
  private urlImagem: any;
  private situacaoSaude: string;
  private dataUltimoMonitoramento: string;

  constructor(public navCtrl: NavController, private service: MonitoramentoService,
              private usuarioDao: UsuarioDao) {
    Chart.defaults.global.legend.display = false;
    this.bpmAtual = 0;
    this.temperaturaAtual = 0.0;
    this.arrayBpm = [];
    this.arrayTemperatura = [];
    this.arrayTime = [];
    this.dataUltimoMonitoramento = "";
    this.situacaoSaude = "";

    
  }

  ionViewDidLoad() {
      this.defineAvatar();
  }

  ngOnInit() {
    this.listaFirebase = this.service.atualizaListaMonitoramento();

    this.listaFirebase.subscribe(dados => {

      if(dados.length > 0) {
        let ultimosDados = dados[dados.length-1];
        
        this.temperaturaAtual = ultimosDados.temp;
        this.bpmAtual = ultimosDados.bpm;
        this.situacaoSaude = ultimosDados.situacaoSaude;
  
        for(let dado of dados) {
          this.criaArrayDados(dado);
        }

        this.arrayBpm = [];
        this.arrayTime = []; 
        this.arrayTemperatura = [];

      }

    });
      
  }


  criaArrayDados(array) {
    let time = array.timestamp.split(" ");
    
    this.arrayBpm.push(Number(array.bpm));
    this.arrayTemperatura.push(Number(array.temp));
    this.arrayTime.push(time[1]);
    this.dataUltimoMonitoramento = time[0];

    this.criaGraficoBPM(this.arrayBpm, this.arrayTime);
    this.criaGraficoTemperatura(this.arrayTemperatura, this.arrayTime);  

  }

  
  criaGraficoBPM(arrayBpm, arrayTime) {
    this.graficoLinha = new Chart(this.graficoBPM.nativeElement, {
      type: 'line',
      data: {
          labels: arrayTime,
          datasets: [
              {
                  label: "bpm",
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "rgba(75,192,192,0.4)",
                  borderColor: "rgba(75,192,192,1)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(75,192,192,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgba(75,192,192,1)",
                  pointHoverBorderColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: arrayBpm,
                  spanGaps: false
              }
          ]
      }
 
    });
  }

  criaGraficoTemperatura(arrayTemperatura, arrayTime) {
    this.graficoDonut = new Chart(this.graficoTemperatura.nativeElement, {
 
      type: 'bar',
        data: {
            labels: arrayTime,
            datasets: [{
                label: 'temperatura',
                data: arrayTemperatura,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
  }
 
  defineAvatar() {
    this.urlImagem = this.usuarioDao.retornarAvatar();
   
    if(this.urlImagem == "") {
      this.urlImagem = "http://www.deltasuper.com.br/img/interface/icone-idosos.png";
    }
  }

}