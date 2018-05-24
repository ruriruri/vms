import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SearchPage } from '../search/search';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController) { }
  goSearch() {
    this.navCtrl.push(SearchPage)
  }
  openCamera() { }

  openQrScanner() { }

  navDashboard() {
    this.navCtrl.push(DashboardPage);
  }
}
