import { Component } from '@angular/core';
import { HomePage } from './../home/home';
import { AboutPage } from './../about/about';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  homePage = HomePage;
  aboutPage = AboutPage;
  loginPage = LoginPage;

  constructor() {

  }
}
