/* global Image Promise document */
import Api from './Api';
import ClientConfig from './ClientConfig';
export default class AssetManager {
    $loading: any;
    srcs: any;
    _assets: any;
    constructor() {
        this.$loading = document.getElementById('loadingText');
        this.srcs = null;

        this._assets = {
            tile: new Array(20),
            object: new Array(20)
        };
    }

    load() {
        const ArrayPromise = [];
        return Api.assetFile().then(res => {
            if (res.data != undefined && res.data) {
                this.srcs = res.data;
                for (const type in this.srcs) {
                    const obj = this.srcs[type];
                    Object.keys(obj).map((key) => {
                        ArrayPromise.push(this.promiseImage(obj[key].img, obj[key].id, type, obj[key].color || 0, obj[key]));
                    });
                }

                return Promise.all(ArrayPromise);
            }
        });
    }

    promiseImage(name, id, type = 'tile', color = 0, conf) {
        const src = `${ClientConfig.api.url}:${ClientConfig.api.port}/${ClientConfig.data.imgFolder}${type}/${name}.png`;
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                // les canvas
                const imageCanvas = document.createElement('canvas');
                const darkerCanvas = document.createElement('canvas');
                const redCanvas = document.createElement('canvas');
                const greenCanvas = document.createElement('canvas');

                // les contextes
                const imageCtx = imageCanvas.getContext('2d');
                const darkerCtx = darkerCanvas.getContext('2d');
                const redCtx = redCanvas.getContext('2d');
                const greenCtx = greenCanvas.getContext('2d');

                // les tailles
                darkerCanvas.width = img.width;
                darkerCanvas.height = img.height;
                redCanvas.width = img.width;
                redCanvas.height = img.height;
                greenCanvas.width = img.width;
                greenCanvas.height = img.height;
                imageCanvas.width = img.width;
                imageCanvas.height = img.height;

                // origine image
                imageCtx.drawImage(img, 0, 0);
                darkerCtx.drawImage(img, 0, 0);
                redCtx.drawImage(img, 0, 0);
                greenCtx.drawImage(img, 0, 0);

                // get datas
                const imageData = imageCtx.getImageData(0, 0, img.width, img.height).data;
                const darkerData = darkerCtx.getImageData(0, 0, img.width, img.height);
                const greenData = greenCtx.getImageData(0, 0, img.width, img.height);
                const redData = redCtx.getImageData(0, 0, img.width, img.height);


                // get pixels
                const darkerPixels = darkerData.data;
                const redPixels = redData.data;
                const greenPixels = greenData.data;

                // transformations
                const coef = 0.875;
                for (let i = 0; i < darkerPixels.length; i += 4) {
                    darkerPixels[i] = darkerPixels[i] * coef;
                    darkerPixels[i + 1] = darkerPixels[i + 1] * coef;
                    darkerPixels[i + 2] = darkerPixels[i + 2] * coef;


                    redPixels[i] = redPixels[i];
                    redPixels[i + 1] = redPixels[i + 1] * 0.25;
                    redPixels[i + 2] = redPixels[i + 2] * 0.25;
                    redPixels[i + 3] = redPixels[i + 3] * 0.75;

                    greenPixels[i] = greenPixels[i] * 0.25;
                    greenPixels[i + 1] = greenPixels[i + 1];
                    greenPixels[i + 2] = greenPixels[i + 2] * 0.25;
                    greenPixels[i + 3] = greenPixels[i + 3] * 0.75;
                }

                // save transformations
                darkerCtx.putImageData(darkerData, 0, 0);
                redCtx.putImageData(redData, 0, 0);
                greenCtx.putImageData(greenData, 0, 0);


                const tile = {
                    id: id,
                    img: imageCanvas,
                    darker: darkerCanvas,
                    red: redCanvas,
                    green: greenCanvas,
                    name: name,
                    color: color,
                    imagePixData: imageData,
                    imgWidth: img.width,
                    imgHeight: img.height,
                    src: src,
                    usable: (conf.usable === undefined ? false : conf.usable)
                };

                this.$loading.innerHTML = `Loading assets:<br>[${type}]: ${name}`;
                this._assets[type][id] = tile;
                resolve(src);

            };
            img.onerror = () => {
                this.$loading.innerHTML = `Unable to load ${type} '${name}' from '${src}'`;
                resolve(null);
            };
            img.crossOrigin = "Anonymous";
            img.src = src;
        });
    }

    getTile(index) {
        if (index >= 0 && index <= this._assets.tile.length) {
            return this._assets.tile[index];
        }
        console.warn(index);
        return null;
    }

    getObject(index) {
        if (index >= 0 && index <= this._assets.object.length) {
            return this._assets.object[index];
        } else {
            console.warn(index);
        }
    }
}
