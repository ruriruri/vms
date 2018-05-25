import { Component, ViewChild } from '@angular/core';
import {
  NavController,
  NavParams,
  LoadingController
} from 'ionic-angular';
import { VmsService } from '../../providers/vms.service'
import { Chart } from 'chart.js';
import 'rxjs/add/operator/map';
import moment from 'moment';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  public ngay;
  public thangNam: any;
  public tuNgay;
  public denNgay;
  public dsHoSoLoi: any[];

  @ViewChild('lineCanvas') lineCanvas;

  lineChart: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public vmsService: VmsService,
    public loadingCtrl: LoadingController) {
    this.thangNam = moment().format('YYYY-MM');
    this.tuNgay = moment().startOf('month').format('DD/MM/YYYY');
    this.denNgay = moment().endOf('month').format('DD/MM/YYYY');
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Đang tải dữ liệu...'
    });
    loading.present();

    this.vmsService.getNhanChiTietHSNgay4210('3', this.vmsService.maCSKCB, moment().format('DD/MM/YYYY'))
      .subscribe(result => {
        this.dsHoSoLoi = result['dsHoSo'];
        this.dsHoSoLoi = this.dsHoSoLoi.filter(loi => loi.slHoSoLoi !== 0);
      });
    this.vmsService.getNhanKQTiepNhanHS4210('3', this.vmsService.maCSKCB, this.tuNgay, this.denNgay)
      .subscribe(
        result => {
          if (result) {
            let ds = result['dsKQGuiHosoNgay'];
            let ngaygui = ds.map(a => a.ngayGui.substr(0, 2));
            let tong = ds.map(a => a.tongSo);
            let hsthanhcong = ds.map(a => a.soHSThanhCong);
            let hsxoa = ds.map(a => a.tongSo - (a.soHSThanhCong + a.soHSLoi));
            let hsloi = ds.map(a => a.soHSLoi);
            this.createNhanKQTiepNhanHS4210Chart(ngaygui, tong, hsthanhcong, hsxoa, hsloi)
          }
          loading.dismiss();
        },
        (error) => {
          console.log(error);
          loading.dismiss();
        })
  }

  onDateChanged(e) {
    let loading = this.loadingCtrl.create({
      content: 'Đang tải dữ liệu...'
    });

    loading.present();

    this.tuNgay = moment(e + '-01').startOf('month').format('DD/MM/YYYY');
    this.denNgay = moment(e + '-01').endOf('month').format('DD/MM/YYYY');

    this.vmsService.getNhanKQTiepNhanHS4210('3', this.vmsService.maCSKCB, this.tuNgay, this.denNgay).subscribe(
      result => {
        let ds = result['dsKQGuiHosoNgay'];
        let ngaygui = ds.map(a => a.ngayGui.substr(0, 2));
        let tong = ds.map(a => a.tongSo);
        let hsthanhcong = ds.map(a => a.soHSThanhCong);
        let hsxoa = ds.map(a => a.tongSo - (a.soHSThanhCong + a.soHSLoi));
        let hsloi = ds.map(a => a.soHSLoi);
        this.lineChart.data.labels = ngaygui;
        this.lineChart.data.datasets[0].data = tong;
        this.lineChart.data.datasets[1].data = hsthanhcong;
        this.lineChart.data.datasets[2].data = hsxoa;
        this.lineChart.data.datasets[3].data = hsloi;
        loading.dismiss();
        this.lineChart.update();
      },
      error => {
        console.log(error);
        loading.dismiss();
      })
  }

  createNhanKQTiepNhanHS4210Chart(ngaygui, tong, hsthanhcong, hsxoa, hsloi) {
    let totalLine = {
      label: "Tổng số",
      data: tong,
      lineTension: 0.2,
      fill: false,
      borderColor: 'blue',
      backgroundColor: 'transparent',
      pointBorderColor: 'blue',
      pointBackgroundColor: 'blue',
      pointRadius: 2,
      pointHoverRadius: 5,
      pointHitRadius: 20,
      pointBorderWidth: 1,
      pointStyle: 'rect',
      borderWidth: 1
    };

    let successLine = {
      label: "Thành công",
      data: hsthanhcong,
      lineTension: 0.2,
      fill: false,
      borderColor: 'green',
      backgroundColor: 'transparent',
      pointBorderColor: 'green',
      pointBackgroundColor: 'lightgreen',
      pointRadius: 2,
      pointHoverRadius: 5,
      pointHitRadius: 20,
      pointBorderWidth: 1,
      borderWidth: 1,
      borderCapStyle: "butt"
    };

    let deletedLine = {
      label: "Xóa",
      data: hsxoa,
      lineTension: 0.2,
      fill: false,
      borderColor: 'gray',
      backgroundColor: 'transparent',
      pointBorderColor: 'gray',
      pointBackgroundColor: 'gray',
      pointRadius: 2,
      pointHoverRadius: 5,
      pointHitRadius: 20,
      pointBorderWidth: 1,
      borderWidth: 1
    };

    let errorsLine = {
      label: "Lỗi",
      data: hsloi,
      lineTension: 0.2,
      fill: false,
      borderColor: 'red',
      backgroundColor: 'transparent',
      pointBorderColor: 'red',
      pointBackgroundColor: 'red',
      pointRadius: 2,
      pointHoverRadius: 5,
      pointHitRadius: 20,
      pointBorderWidth: 1,
      borderWidth: 1
    };

    let data = {
      labels: ngaygui,
      datasets: [totalLine, successLine, deletedLine, errorsLine]
    };

    let chartOptions = {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 30,
          fontColor: 'black'
        }
      },
      onClick: this.clickHandler.bind(this)
    };

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: data,
      options: chartOptions
    });
  }

  clickHandler(e) {
    let firstPoint = this.lineChart.getElementAtEvent(e)[0];
    if (firstPoint) {
      let loading = this.loadingCtrl.create({
        content: 'Đang tải dữ liệu...'
      });
      loading.present();

      console.log(this.lineChart.data.labels[firstPoint._index])
      console.log(moment(this.thangNam + '-' + this.lineChart.data.labels[firstPoint._index]).format('DD/MM/YYYY'))
      this.ngay = moment(this.thangNam + '-' + this.lineChart.data.labels[firstPoint._index]).format('DD/MM/YYYY');
      this.vmsService.getNhanChiTietHSNgay4210('3', this.vmsService.maCSKCB, this.ngay)
        .subscribe(result => {
          console.log(result);
          this.dsHoSoLoi = result['dsHoSo'];
          this.dsHoSoLoi = this.dsHoSoLoi.filter(loi => loi.slHoSoLoi !== 0);
          loading.dismiss();
        })
      console.log(this.lineChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index])
    }
  }
}
