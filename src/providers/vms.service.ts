import { LoadingController } from 'ionic-angular';
import { Injectable } from "@angular/core";
import { Buffer } from 'buffer';
import { KQNhanLichSuKCBBS } from './../models/KQNhanLichSuKCBBS';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';

import { KQPhienLamViec } from './../models/KQPhienLamViec';
import { UrlVss } from '../models/UrlVss';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HoSoKCB } from '../models/HoSoKCB';

@Injectable()
export class VmsService {
    private urlVss = new UrlVss();
    public username: string;
    public password: string;
    public kqPhienLamViec: KQPhienLamViec;
    public loading: LoadingController;

    constructor(
        private httpClient: HttpClient,
    ) { }

    bodyOptions() {
        return {
            username: this.username,
            password: this.password
        }
    }

    login(): Observable<KQPhienLamViec> {
        return this.httpClient.post<KQPhienLamViec>(this.urlVss.layPhienLamViec, this.bodyOptions())
            .map(response => this.kqPhienLamViec = response);
    }

    parseQrCode(encodeText: string) {
        const qra = encodeText.split('|');
        return {
            Code: qra[0],
            FullName: new Buffer(('' + qra[1]), 'hex').toString('utf8'),
            DateOfBirth: qra[2].length == 4 ? qra[2] : qra[2]//new Date(+qra[2].split('/')[2], + qra[2].split('/')[1] - 1, +qra[2].split('/')[0])
        }
    }

    getNhanLichSuKCB(mathe: string, hoten: string, ngaysinh: string) {
        const body = {
            "maThe": mathe,
            "hoTen": hoten,
            "ngaySinh": ngaysinh
        }
        return this.httpClient.post<KQNhanLichSuKCBBS>('http://egw.baohiemxahoi.gov.vn/api/egw/NhanLichSuKCB2018', body)
    }

    getNhanHoSoKCBChiTiet(mahoso) {
        let params = new HttpParams().set('maHoSo', mahoso);
        return this.httpClient.post<HoSoKCB>(this.urlVss.nhanHoSoKCBChiTiet, {}, { params: params })
    }

    getNhanChiTietHSNgay4210(loaiHoSo: string, maCSKCB: string, ngayGui: string) {
        let params = new HttpParams()
            .set('loaiHoSo', loaiHoSo)
            .set('maCSKCB', maCSKCB)
            .set('ngayGui', ngayGui);
        return this.httpClient.post(this.urlVss.nhanChiTietHSNgay4210, {}, { params: params })
    }

    getNhanKQTiepNhanHS4210(loaiHoSo: string, maCSKCB: string, tuNgay: string, denNgay: string) {
        let params = new HttpParams()
            .set('loaiHoSo', loaiHoSo)
            .set('maCSKCB', maCSKCB)
            .set('tuNgay', tuNgay)
            .set('denNgay', denNgay);
        return this.httpClient.post(this.urlVss.nhanKQTiepNhanHS4210, {}, { params: params })
    }

    public isTokenExpired(): boolean {
        if (this.kqPhienLamViec) {
            let current = new Date();
            let expire = new Date(this.kqPhienLamViec.APIKey.expires_in);
            return current > expire;
        }
        return false
    }

    public refreshToken() {
        // this.cachedRequests = [];
        const body = {
            "username": this.username,
            "password": this.password
        }
        return this.httpClient.post<KQPhienLamViec>(this.urlVss.layPhienLamViec, body)
            .map(response => {
                this.kqPhienLamViec = response;
                console.log('token from refreshToken()', this.kqPhienLamViec);
                return response;
            });
    }

    public cachedRequests: HttpRequest<any>[];
    public collectFailedRequest(request: HttpRequest<any>): void {
        console.log('collectFailedRequest', request);
        this.cachedRequests = [];
        this.cachedRequests.push(request);
    }

    public retryFailedRequests(): void {
        // retry the requests. this method can
        // be called after the token is refreshed
    }

    getDrugList() {
        // return this.httpClient.get('https://rxnav.nlm.nih.gov/REST/allconcepts?tty=BN')
        return this.httpClient.get('https://rxnav.nlm.nih.gov/REST/classes?src=ATC')
    }
}