import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import {HomePage} from "../home/home";

/**
 * Generated class for the GoogleLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-google-login',
  templateUrl: 'google-login.html',
})
export class GoogleLoginPage {
  public userProfil: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      firebase.auth().onAuthStateChanged( user => {
          if (user) {
              console.log(user);
              this.userProfil = user;
              this.navCtrl.push(HomePage);
          }
      });
  }

  googleLogin(): void {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithRedirect(provider).then( () => {
      firebase.auth().getRedirectResult().then( result => {
          this.navCtrl.push(HomePage);
      }).catch((error) => {
        console.log(error.message);
      });
    });
  }
}
