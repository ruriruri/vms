import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import { Injectable } from "@angular/core";
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/finally';
import { VmsService } from './../../providers/vms.service';
import { KQPhienLamViec } from "../../models/KQPhienLamViec";

@Injectable()
export class VmsAuthInterceptor implements HttpInterceptor {

    constructor(
        public vmsService: VmsService
    ) { }

    assignCredentials(request: HttpRequest<any>, kqPhienLamViec: KQPhienLamViec) {
        if (kqPhienLamViec) {
            console.log('assignCredentials', kqPhienLamViec)

            return request.clone({
                setParams: {
                    username: this.vmsService.username,
                    password: this.vmsService.password,
                    token: kqPhienLamViec.APIKey.access_token,
                    id_token: kqPhienLamViec.APIKey.id_token
                }
            });
        }
        return request;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.includes('rxnav.nlm.nih.gov/REST/'))
            return next.handle(request);
        if (this.vmsService.isTokenExpired()) {
            console.log('token expired.')
            this.vmsService.kqPhienLamViec = null;
            this.vmsService.collectFailedRequest(request);
            return this.vmsService.refreshToken().switchMap((response: any) => {
                console.log('res', response);
                this.vmsService.kqPhienLamViec = response
                return next.handle(this.assignCredentials(request, response));
            })
                .catch(error => this.handleError(error))
                .finally(() => {
                    return next.handle(this.assignCredentials(this.vmsService.cachedRequests[0], this.vmsService.kqPhienLamViec));
                })
        }
        return next.handle(this.assignCredentials(request, this.vmsService.kqPhienLamViec))
    }

    private handleError(error: Response) {
        return Observable.throw(error)
    }
}