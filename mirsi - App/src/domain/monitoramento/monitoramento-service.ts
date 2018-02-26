import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class MonitoramentoService {
    private listaComLimite: Observable<any[]>;
    private listaComOrdenacao: Observable<any[]>;
    
    constructor(private db: AngularFireDatabase) {
      this.listaComLimite = this.db.list('/mirsi', ref => ref.limitToLast(5)).valueChanges();
      this.listaComOrdenacao = this.db.list('/mirsi', ref => ref.orderByChild('data')).valueChanges();
    }

    atualizaListaMonitoramento() {
        return this.listaComLimite;
    }

    atualizaListaOrdenada() {
        return this.listaComOrdenacao;
    }


}