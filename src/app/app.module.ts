import {
  ErrorHandler,
  NgModule
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {
  IonicApp,
  IonicErrorHandler,
  IonicModule
} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { VMS } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from './../pages/login/login';
import { SearchPage } from './../pages/search/search';

import { VmsAuthInterceptor } from './middleware/vms.auth.interceptor';
import { RegisterPage } from '../pages/register/register';
import { VmsService } from '../providers/vms.service';
import { TabsPage } from '../pages/tabs/tabs';
import { AboutPage } from '../pages/about/about';
import { HistoriesPage } from '../pages/histories/histories';
import { DetailsPage } from '../pages/detail/details';
import { DashboardPage } from '../pages/dashboard/dashboard';

import { VnDate } from './middleware/vndate.pipe';
import { VnNumber } from './middleware/vnnumber.pipe';

@NgModule({
  declarations: [
    VMS,
    VnDate,
    VnNumber,
    TabsPage,
    HomePage,
    AboutPage,
    LoginPage,
    RegisterPage,
    SearchPage,
    HistoriesPage,
    DetailsPage,
    DashboardPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(VMS)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    VMS,
    TabsPage,
    HomePage,
    AboutPage,
    LoginPage,
    RegisterPage,
    SearchPage,
    HistoriesPage,
    DetailsPage,
    DashboardPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: VmsAuthInterceptor,
      multi: true
    },
    VmsService
  ]
})
export class AppModule { }
