/* global canvas window document */
import ClientConfig from './ClientConfig';
import Point2D from './Point2D';
import Calc from './Calc';
import ContextualMenu from './ContextualMenu';
import Canvas from './Canvas';

export default class EventManager {
    _map: any;
    longpress: any;
    press: any;
    presstimer: any;
    pinchDistance: any;

    _movingMouse: any;
    _ctxMenu: any;
    lastTouchTileStamp: any;
    lastTouch: any;
    constructor(map, am) {
        this._map = map;
        this.longpress = false;
        this.press = false;
        this.presstimer = null;
        this.pinchDistance = 0;

        this._movingMouse = {x: 0, y: 0};
        this._ctxMenu = new ContextualMenu(map, am);
        this.lastTouchTileStamp = 0;
        this.lastTouch = new Point2D();
    }

    listen() {
        window.addEventListener('resize', () => this.eventResize());
        // comp
        Canvas.canvas.addEventListener('wheel', (e) => this.eventMouseZoom(e));
        Canvas.canvas.addEventListener('mousedown', (e) => this.eventMouseDown(e));
        Canvas.canvas.addEventListener('mouseup', (e) => this.eventMouseUp(e));
        Canvas.canvas.addEventListener('mousemove', (e) => this.eventMouseMove(e));

        // phone
        Canvas.canvas.addEventListener('touchstart', (e) => this.eventTouchDown(e));
        Canvas.canvas.addEventListener('touchend', (e) => this.eventTouchUp(e));
        Canvas.canvas.addEventListener('touchmove', (e) => this.eventTouchMove(e));

        // prevent right click
        Canvas.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        Canvas.canvas.oncontextmenu = (e) => {
            e.preventDefault();
        };
        window.addEventListener('keydown', (e) => this.eventKeyboard(e));
    }

    getPosFromMouse(coord) {
        const rect = Canvas.canvas.getBoundingClientRect();
        return {
            x: (coord.x) - rect.left,
            y: (coord.y) - rect.top
        };
    }

    isTactile() {
        return 'ontouchstart' in window        // works on most browsers
            || navigator.maxTouchPoints;       // works on IE10/11 and Surface
    };

    eventKeyboard(e) {
        switch (e.keyCode) {
        /*
        We don't save map anymore
        case 83:
            this.download();
            break;
            */
        case 68:
            this._map.displayDebug = !this._map.displayDebug;
            this._map.needRefresh = true;
            break;
        default:
            break;
        }
    }

    eventResize() {
        Canvas.canvas.width = window.innerWidth;
        Canvas.canvas.height = window.innerHeight;
        this._map.needRefresh = true;
    }

    eventMouseDown(e) {
        if (this.isTactile()) {
            return;
        }
        const coord = new Point2D(e.clientX, e.clientY);
        // if left group
        if (e.which === 1) {

            if (Math.abs(this.lastTouch.x - coord.x) < ClientConfig.distDoubleTap
                && Math.abs(this.lastTouch.y - coord.y) < ClientConfig.distDoubleTap
                && e.timeStamp - this.lastTouchTileStamp < ClientConfig.durationDoubleTap) {
                this.actionThird(coord);
            } else {
                if (this.press) {
                    return false;
                }
                this._movingMouse = coord;
                this.press = true;
                this.longpress = false;
                this.presstimer = setTimeout(() => {
                    this.actionSecond(coord);
                    this.longpress = true;
                }, ClientConfig.durationLongPress);
            }
            this.lastTouch = coord;
            this.lastTouchTileStamp = e.timeStamp;
        // else if right click
        } else if (e.which === 3) {
            this.actionSecond(coord);
        }
    }

    eventMouseUp(e) {
        if (this.isTactile()) {
            return;
        }
        // only if left click
        if (e.which === 1) {
            this.press = false;
            if (this.presstimer !== null && this.longpress) {
                clearTimeout(this.presstimer);
                this.presstimer = null;
            } else if (this.presstimer !== null && !this.longpress) {
                clearTimeout(this.presstimer);
                this.presstimer = null;
                const coord = this.getPosFromMouse(new Point2D(e.clientX, e.clientY));
                this.actionMain(coord);
            }
        }
    }

    eventMouseMove(e) {
        if (this.isTactile()) {
            return;
        }
        const moved = new Point2D(e.clientX, e.clientY);
        if (this.lastTouchTileStamp + 10 < e.timeStamp) {
            this.lastTouchTileStamp = e.timeStamp;
            if (!this.press) {
                return false;
            }
            clearTimeout(this.presstimer);
            this.presstimer = null;
            const coord = this.getPosFromMouse(moved);
            this.actionSlide(coord);
        }
    }

    eventMouseZoom(e) {
        const coef = (e.deltaY < 0 ? 1 + ClientConfig.coefZoom : 1 - ClientConfig.coefZoom);
        this.actionZoom(coef);
    }

    eventTouchDown(e) {
        if (e.changedTouches.length === 1) {
            const coord = this.getPosFromMouse(new Point2D(e.changedTouches[0].pageX, e.changedTouches[0].pageY));
            if (Math.abs(this.lastTouch.x - coord.x) < ClientConfig.distDoubleTap
                && Math.abs(this.lastTouch.y - coord.y) < ClientConfig.distDoubleTap
                && e.timeStamp - this.lastTouchTileStamp < ClientConfig.durationDoubleTap) {
                this.actionThird(coord);
            } else {
                this._movingMouse = coord;
                if (this.press) {
                    return false;
                }
                this.press = true;
                this.longpress = false;
                this.presstimer = setTimeout(() => {
                    this.actionSecond(coord);
                    this.longpress = true;
                }, ClientConfig.durationLongPress);
            }
            this.lastTouch = coord;
            this.lastTouchTileStamp = e.timeStamp;
        } else {
            this.pinchDistance = Calc.distance2D(e.changedTouches[0], e.changedTouches[1]);
        }
    }

    eventTouchUp(e) {
        if (e.changedTouches.length === 1) {
            this.press = false;
            if (this.presstimer !== null && this.longpress) {
                clearTimeout(this.presstimer);
                this.presstimer = null;
            } else if (this.presstimer !== null && !this.longpress) {
                clearTimeout(this.presstimer);
                this.presstimer = null;
                const coord = this.getPosFromMouse(new Point2D(e.changedTouches[0].pageX, e.changedTouches[0].pageY));
                this.actionMain(coord);
            }
        }
    }

    eventTouchMove(e) {
        if (e.targetTouches.length === 1) {
            if (this.lastTouchTileStamp + 10 < e.timeStamp) {
                this.lastTouchTileStamp = e.timeStamp;
                if (!this.press) {
                    return false;
                }
                clearTimeout(this.presstimer);
                this.presstimer = null;
                const coord = this.getPosFromMouse(new Point2D(e.changedTouches[0].pageX, e.changedTouches[0].pageY));
                this.actionSlide(coord);
            }
        } else {
            const dist = Calc.distance2D(
                {x: e.targetTouches[0].pageX, y: e.targetTouches[0].pageY},
                {x: e.targetTouches[1].pageX, y: e.targetTouches[1].pageY});
            if (dist > Canvas.canvas.width / 5) {
                const coef = dist > this.pinchDistance ? 1 + ClientConfig.coefPinch : 1 - ClientConfig.coefPinch;
                this.pinchDistance = dist;
                this.actionZoom(coef);
            }
        }
    }

    actionMain(o) {
        this._ctxMenu.hide();
        console.log('Action Main');
        this._map.setCurrentTileFromPX(o);
        this._map.needRefresh = true;
    }

    actionSecond(o) {
        console.log('Action Second', o);
        this._ctxMenu.hide();
        this.press = false;
        this._map.setCurrentTileFromPX(o);
        this._map.needRefresh = true;
        this._ctxMenu.show(o, 'MainMenu');
    }

    actionThird(o) {
        /*
        console.log('Action third', o);
        this._ctxMenu.hide();
        this.press = false;
        this._map.setCurrentTileFromPX(o);
        this._map.needRefresh = true;
        this._ctxMenu.show(o, 'MainMenu');
        */
    }

    actionSlide(o) {
        this._ctxMenu.hide();

        // @todo: remove
        const detected = this._map.getTileFromWorld(o);
        if (detected != null) {
            console.log('Action Slide');
            this._map.screenOffset = {
                x: this._map.screenOffset.x += o.x - this._movingMouse.x,
                y: this._map.screenOffset.y += o.y - this._movingMouse.y
            };
            this._movingMouse = o;
            const chunk = this._map.getChunk(detected);
            this._map.checkChunks(chunk);
            this._map.needRefresh = true;
        }
    }

    actionZoom(coef) {
        this._ctxMenu.hide();
        console.log('Action Zoom');
        if (this._map.tileSize.x * coef < 300 && this._map.tileSize.x * coef > 50) {
            this._map.tileSize.times({x: coef, y: coef, z: coef});
            this._map.screenOffset.x *= coef;
            this._map.screenOffset.y *= coef;
            this._map.needRefresh = true;
        }
    }

    download() {
        const filename = 'map.js';
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this._map.map)));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
}
