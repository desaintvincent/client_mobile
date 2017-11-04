import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import { LoginPage } from "../login/login";
import { GoogleLoginPage } from "../google-login/google-login";

/**
 * Generated class for the AllLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-login',
  templateUrl: 'all-login.html',
})
export class AllLoginPage {

  constructor(public navCtrl: NavController) {
  }

  goToLogin(): void {
    this.navCtrl.push(LoginPage);
  }

  goToGoogle(): void {
    this.navCtrl.push(GoogleLoginPage);
  }
}
