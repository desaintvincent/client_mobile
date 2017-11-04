import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoogleLoginPage } from './google-login';

@NgModule({
  declarations: [
    GoogleLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(GoogleLoginPage),
  ],
})
export class GoogleLoginPageModule {}
