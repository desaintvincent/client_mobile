/* global canvas ctx document requestAnimationFrame window */

import { Platform }     from 'ionic-angular';
import swal             from 'sweetalert2';
import API              from './Api';
import Map              from './Map';
import EventManager     from './EventManager';
import AssetManager     from './AssetManager';
import FPS              from './FPS';
import ClientConfig     from './ClientConfig';
import io               from 'socket.io-client';
import Socket           from './Socket';
import SocketListenner  from './SocketListenner';

export default class Game {
    isLooping: boolean = true;
    FPS: FPS;
    assetManager: AssetManager;
    map: Map;
    eventManager: EventManager;
    socketListenner: SocketListenner;
    $loading: any;
    $loader: any;
    $cancel: any;
    platform: Platform;

    constructor(platform: Platform, fps) {
        this.platform = platform;
        // game
        this.FPS = new FPS(fps);
        this.assetManager = new AssetManager();
        this.map = new Map(this.assetManager);
        this.eventManager = new EventManager(this.map, this.assetManager);
        this.eventManager.listen();
        this.socketListenner = new SocketListenner(this.map);
        this.$loader = document.getElementById('loaderContainer');
        this.$loading = document.getElementById('loadingText');
        this.$cancel = document.getElementById('cancelConnect');

        this.$cancel.innerHTML = 'Cancel';
        this.$cancel.addEventListener('click', () => {
            if (Socket.io !== null && Socket.io.connected !== undefined && Socket.io.connected) {
                Socket.io.disconnect();
                this.reconnect();
            }
        });
        if (localStorage.getItem("swal-input-server") !== null) {
            ClientConfig.api.url = localStorage.getItem("swal-input-server");
        }
        API.init();
    }

    connect() {
        this.$loading.innerHTML = `Contacting server`;
        this.assetManager.load().then((res) => {
            if (res !== undefined || res === null) {
                for (let i = 0; i < res.length; i++) {
                    if (res[i] === null) {
                        return this.reconnect();
                    }
                }
                this.$loading.innerHTML = `Loading server datas`;
                Socket.io = io.connect(`${ClientConfig.api.url}:${ClientConfig.api.port}`, {
                    reconnection: false
                });

                Socket.io.on('connect_error', () => {
                    this.reconnect();
                });

                Socket.io.on('disconnect', () => {
                    this.reconnect('Disconnected', 'Try to reconnect?');
                });

                Socket.io.on('connect', () => {
                    this.initGame();
                });
            } else {
                this.reconnect();
            }
        });

    }

    init() {
        this.connect();
    }

    initGame() {
        Socket.io.emit('initMap', {x: 0, y: 0});
        Socket.io.on('initMap', (data) => {
            if (this.map.init(data)) {
                this.socketListenner.listen();
                this.startLoop();
            } else {
                this.reconnect('Unable to load datas', 'Try to reconnect?');
            }
        });
    }

    reconnect(title = null, msg = null, cancelButton = true) {
        this.$loader.style.display = 'block';
        this.$loader.style.opacity = 1;
        this.$loader.style.filter = 'none';
        const message = msg ? msg : 'This is an Alpha, maybe server is somewhere else?';
        const inputText = `<input id="swal-input-server" value="${ ClientConfig.api.url }">`;
        const remember = localStorage.getItem("swal-input-remember");
        const checkbox = `<label for="swal-input-remember">Remember server<input type="checkbox" id="swal-input-remember" ${(remember === 'true') ? 'checked' : ''}></label>`;
        swal({
            title: title ? title : 'Unable to connect',
            type: 'error',
            showCancelButton: cancelButton,
            html: `${message}<br>${inputText}<br>${checkbox}`,
            confirmButtonText: 'Yes, reconnect',
            cancelButtonText: 'No, leave app',
            allowOutsideClick: false,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    resolve({
                        ip: (<HTMLInputElement>document.getElementById('swal-input-server')).value,
                        remember: (<HTMLInputElement>document.getElementById('swal-input-remember')).checked
                    });
                })
            },
        }).then((result) => {
            ClientConfig.api.url = result.ip;
            localStorage.setItem("swal-input-remember", result.remember);
            if (result.remember) {
                localStorage.setItem("swal-input-server", ClientConfig.api.url);
            }
            this.connect();
        }, (dismiss) => {
            this.platform.exitApp();
        })
    }

    update() {
        this.map.draw();
    }

    loop() {
        if (!this.isLooping) {
            return;
        }
        requestAnimationFrame(() => this.loop());
        this.FPS.run(() => this.update());

    }

    fade(element) {
        let op = 1;  // initial opacity
        const timer = setInterval(() => {
            if (op <= 0.01) {
                clearInterval(timer);
                element.style.display = 'none';
                return;
            }
            element.style.opacity = op;
            element.style.filter = `alpha(opacity=${op * 100})`;
            op -= op * 0.15;
        }, 50);
    }

    startLoop() {
        this.map.draw(true);
        this.fade(this.$loader);
        this.loop();
    }
}
