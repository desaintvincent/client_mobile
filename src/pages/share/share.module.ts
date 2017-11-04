import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharePage } from './share';
import { Contacts } from '@ionic-native/contacts';

@NgModule({
  declarations: [
    SharePage,
  ],
  imports: [
    IonicPageModule.forChild(SharePage),
  ],
  providers: [
        Contacts
  ]
})
export class SharePageModule {}
