import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
import { EmailValidator } from "../../validators/email";

@IonicPage({
    name: 'ResetPasswordPage'
})
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})

export class ResetPasswordPage {
  public resetPasswordForm: FormGroup;

  constructor(public navCtrl: NavController, public authProvider: AuthProvider,
              public alertCtrl: AlertController, public formBuilder: FormBuilder) {
    this.resetPasswordForm = formBuilder.group({
        email:['', Validators.compose([Validators.required, EmailValidator.isValid])]
    });
  }
  resetPassword() {
    if (!this.resetPasswordForm.valid){
      console.log(this.resetPasswordForm.value);
    } else {
      this.authProvider.resetPassword(this.resetPasswordForm.value.email).then( (user) => {
        let alert = this.alertCtrl.create({
            message: "Sending a reset link by email!",
            buttons: [
                {
                  text: "Ok",
                    role: 'Cancel',
                    handler: () => {
                        this.navCtrl.pop();
                    }
                }
            ]
        });
        alert.present();
      }, error => {
            let alert = this.alertCtrl.create({
                message: error.message,
                buttons: [
                    {
                      text: "Ok",
                        role: 'Cancel'
                    }
                ]
            });
            alert.present();
          }
      );

    }
  }
}
