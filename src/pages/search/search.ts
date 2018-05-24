import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

import { VmsService } from './../../providers/vms.service';
import 'rxjs/add/operator/catch';

import { KQNhanLichSuKCBBS } from '../../models/KQNhanLichSuKCBBS';
import { HistoriesPage } from '../histories/histories';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  options: BarcodeScannerOptions;
  scannerData: string;
  private mathe: string = 'GD4898923103137';
  private hoten: string = 'HÀ VĂN HOÀNG';
  private ngaysinh: string = '1948';
  private kqNhanLichSuKCBBS: KQNhanLichSuKCBBS;
  private loading = this.loadingCtrl.create({
    content: 'Please wait...'
  });

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private vmsService: VmsService,
    public scanner: BarcodeScanner,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {

    this.loading.present();
  }

  getNhanLichSuKCB() {
    this.vmsService.getNhanLichSuKCB(this.mathe, this.hoten, this.ngaysinh)
      .subscribe(
        result => this.kqNhanLichSuKCBBS = result,
        error => {
          console.log('throw from getNhanLichSuKCB', error.message);
          this.presentToast(error.message)
        })
  }

  getNhanHoSoKCBChiTiet(mahoso) {
    this.vmsService.getNhanHoSoKCBChiTiet(mahoso)
      .subscribe(
        result => { console.log(result) },
        error => {
          console.log('throw from getNhanHoSoKCBChiTiet', error.message);
          this.presentToast(error.message)
        })
  }

  scan() {
    this.options = {
      prompt: 'Quét mã vạch trên thẻ BHYT'
    }
    this.scanner.scan(this.options)
      .then(result => {
        this.scannerData = result.text;
        if (this.scannerData) {
          const fields = this.vmsService.parseQrCode(this.scannerData);
          this.mathe = fields.Code;
          this.hoten = fields.FullName;
          this.ngaysinh = fields.DateOfBirth;
        }
      })
      .catch(err => console.log(err))
  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  navHistoriesPage() {
    this.vmsService.getNhanLichSuKCB(this.mathe, this.hoten, this.ngaysinh)
      .subscribe(
        result => {
          this.kqNhanLichSuKCBBS = result;
          this.navCtrl.push(HistoriesPage, { histoties: result.dsLichSuKCB2018 });
        },
        error => {
          console.log('throw from getNhanLichSuKCB', error.message);
          this.presentToast(error.message)
        })
  }

  ionViewDidLoad() {
    this.loading.dismiss();
  }
}
