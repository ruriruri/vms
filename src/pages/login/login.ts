import { VmsService } from './../../providers/vms.service';
import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  ToastController,
  LoadingController
} from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';

import { HomePage } from './../home/home';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private username: string = "79024_BV";
  private password: string = "Bvnd115@22789";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private vmsService: VmsService,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) { }

  login() {
    let loading = this.loadingCtrl.create({
      content: 'Đang xác thực...'
    });

    loading.present();

    this.vmsService.username = this.username;
    this.vmsService.password = Md5.hashStr(this.password).toString().toUpperCase();

    this.vmsService.login().subscribe(
      result => {
        this.vmsService.kqPhienLamViec = result;
        console.log('result',result)
        loading.dismiss();
        this.navCtrl.push(HomePage);
      },
      error => {
        loading.dismiss();
        console.log(error);
        this.presentToast('lỗi')
      });
  }

  register(e) {
    this.navCtrl.push(RegisterPage)
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });

    toast.present();
  }

  ionViewDidLoad() {
    this.presentToast('finish...')
  }
}
