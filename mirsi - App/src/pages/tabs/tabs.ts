import { Component } from '@angular/core';

import { HistoricoPage } from '../historico/historico';
import { PerfilPage } from '../perfil/perfil';
import { DashboardPage } from '../dashboard/dashboard';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = DashboardPage;
  tab2Root = HistoricoPage;
  tab3Root = PerfilPage;

  constructor() {

  }
}
