import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VmsService } from '../../providers/vms.service';
import { HoSoKCB } from '../../models/HoSoKCB';
import { Xml1 } from '../../models/Xml1';
import { Xml2 } from '../../models/Xml2';
import { Xml3 } from '../../models/Xml3';
import { Xml4 } from '../../models/Xml4';
import { Xml5 } from '../../models/Xml5';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  hoSoKCB: HoSoKCB;
  xml1: Xml1;
  dsXml2: Xml2[];
  dsXml3: Xml3[];
  dsXml4: Xml4[];
  dsXml5: Xml5[];
  dsXetNghiem: any[];
  dsDichVu: any[];
  dsVatTuYTe: any[];
  dsDichVuKyThuat: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private vmsService: VmsService) {
    this.vmsService.getNhanHoSoKCBChiTiet(this.navParams.get('mahoso'))
      .subscribe(
        result => {
          this.hoSoKCB = result['hoSoKCB'];
          this.xml1 = this.hoSoKCB.xml1;
          this.dsXml2 = this.hoSoKCB.dsXml2;
          this.dsXml3 = this.hoSoKCB.dsXml3;
          this.dsVatTuYTe = this.dsXml3.filter(x => x.MaVatTu !== null)
          this.dsDichVuKyThuat = this.dsXml3.filter(x => x.MaDichVu !== null)
          // console.log(this.dsVatTuYTe)
          this.dsXml4 = this.hoSoKCB.dsXml4;
          this.dsXml5 = this.hoSoKCB.dsXml5;
          this.dsXetNghiem = this.dsXml4.filter(x => x.TenChiSo !== null)
          this.dsDichVu = this.dsXml4.filter(x => x.TenChiSo == null)
        },
        error => console.log(error)
      )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }
}
