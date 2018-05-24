import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LichSuKCB2018 } from '../../models/LichSuKCB2018';
import { DetailsPage } from '../detail/details';

@Component({
  selector: 'page-histories',
  templateUrl: 'histories.html',
})
export class HistoriesPage {
  dsLichSuKCB2018: LichSuKCB2018[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.dsLichSuKCB2018 = this.navParams.get('histoties');
  }

  navDetailsPage(mahoso: string) {
    this.navCtrl.push(DetailsPage, { mahoso });
  }

  ionViewDidLoad() {
    // console.log(this.navParams.data)
  }
}
