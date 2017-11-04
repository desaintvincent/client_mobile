import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, Loading, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
import { EmailValidator } from "../../validators/email";
import { HomePage } from "../home/home";

@IonicPage({
    name: 'SignupPage'
})
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage {
  public loading: Loading;
  public signupForm: FormGroup;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
              public loadingCtrl: LoadingController, public authProvider: AuthProvider,
              public formBuilder: FormBuilder) {
    this.signupForm = formBuilder.group({
        email: ['',
            Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['',
            Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }


  signupUser(){
    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {
      this.authProvider.signupUser(this.signupForm.value.email, this.signupForm.value.password).then(() => {
        this.loading.dismiss().then( () => {
          this.navCtrl.setRoot(HomePage);
        });
      }, (error) => {
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                  {
                    text: "Ok",
                      role: 'cancel'
                  }
              ]
          });
          alert.present();
        });
      });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }
}
