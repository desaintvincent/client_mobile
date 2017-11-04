import { Component, ViewChild } from '@angular/core';
import { AuthProvider } from "../../providers/auth/auth";
import { Platform } from 'ionic-angular';
import { NavController } from "ionic-angular";
import { AllLoginPage } from "../all-login/all-login";
import { SharePage } from '../share/share';
import Game from '../../components/Game';
import Canvas from '../../components/Canvas';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
    @ViewChild('canvas') canvasEl;
    private game: any;
    sharePage = SharePage;

    constructor(public platform: Platform, public authProvider: AuthProvider, public navCtrl: NavController){
    }

    ngOnInit(){
        Canvas.canvas = this.canvasEl.nativeElement;
        if (Canvas.canvas) {
            Canvas.ctx = Canvas.canvas.getContext('2d');
            Canvas.canvas.width = window.innerWidth;
            Canvas.canvas.height = window.innerHeight;
            this.game = new Game(this.platform, 60);
            this.game.init();
        }
    }

    goToSharePage(){
        this.navCtrl.push('SharePage');
    }

    logout(){
        this.authProvider.logoutUser().then( () => {
            this.navCtrl.setRoot(AllLoginPage);
        });
    }
}
