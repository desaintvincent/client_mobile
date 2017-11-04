/* global canvas ctx document */
import IsoMath from './IsoMath';
import Point2D from './Point2D';
import Point3D from './Point3D';
import Api from './Api';
import Config from '../server/Config';
import Canvas from './Canvas';

export default class Map {
    assetManager: any;
    map: any;
    chunks: any;
    requeting: any;
    displayDebug: any;
    needRefresh: any;
    tileSize: any;
    screenOffset: any;
    curentSelection: any;
    minimap: any;
    canvasData: any;
    cData: any;
    mCtx: any;
    mCanvas: any;
    
    constructor(assetManager) {
        if (Canvas === null || Canvas.ctx === null) {
            return null;
        }
        this.assetManager = assetManager;
        this.map = {};
        this.chunks = [];
        this.requeting = false;
        this.displayDebug = false;
        this.needRefresh = true;


        this.tileSize = new Point3D(Config.tile.x, Config.tile.y, Config.tile.z);
        this.screenOffset = new Point2D(0, 0);
        this.curentSelection = new Point2D(0, 0);
        this.minimap = null;
        this.canvasData = Canvas.ctx.createImageData(Canvas.canvas.width, Canvas.canvas.height);
        this.cData = this.canvasData.data;
    }

    init(data) {
        if (data != undefined) {
            for (const index in data) {
                const tile = data[index];
                this.setTile({x: tile.x, y: tile.y}, tile);
            }
            return true;
        }
        return false;
    }

    buildMiniMap() {
        const tmpCanvas = document.createElement('canvas');
        const mapSize = this.getMapSize();
        tmpCanvas.width = mapSize.x * 4;
        tmpCanvas.height = mapSize.y;
        const tmpCtx = tmpCanvas.getContext('2d');

        for (let y = 0; y < mapSize.y; y++) {
            for (let x = 0; x < mapSize.x; x++) {
                const tile = new Point2D(x, y);
                if (this.isTile(tile)) {
                    const c = this.assetManager.getTile(this.getTile(tile).tile).color;
                    tmpCtx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, 1)`;
                    tmpCtx.fillRect(x * 4, y, 4, 1);
                }
            }
        }

        // this.minimap = tmpCanvas;
    }

    drawTile(o = {x: 0, y: 0, z: 0}) {
        const worldPosition = this.getPxFromTile(o);
        const tile = this.getTile(o);
        const tileAsset = this.assetManager.getTile(tile.type);
        if (tileAsset !== undefined && tileAsset !== null) {
            const assetToUse = (o.z % 2 ? tileAsset.img : tileAsset.darker);
            this.mCtx.drawImage(
                assetToUse,
                0,
                0,
                tileAsset.imgWidth,
                tileAsset.imgHeight,
                worldPosition.x,
                worldPosition.y,
                this.tileSize.x,
                this.tileSize.y + this.tileSize.z
            );
        }
    }

    drawClock(obj, o = {x: 0, y: 0, z: 0}) {
        if (obj.start !== undefined && obj.end !== undefined) {

            const p = this.getPxFromTile(o);
            const w = this.tileSize.x * 0.2;

            const circ = Math.PI * 2;
            const quart = Math.PI / 2;

            const pos = {
                x: p.x + this.tileSize.x * 0.5,
                y: p.y + this.tileSize.y * 0.5
            };

            const now = new Date();
            const percent = (now.getTime() - obj.start) / (obj.end - obj.start);
            const remainingTime = new Date(obj.end - now.getTime() + 1000 - 3600000);

            this.mCtx.beginPath();
            this.mCtx.strokeStyle = '#fff';
            this.mCtx.fillStyle = '#fff';
            this.mCtx.font = `${Math.floor(this.tileSize.x * 0.05)}pt Calibri`;
            this.mCtx.lineWidth = 10.0;
            this.mCtx.arc(pos.x, pos.y, w, -(quart), ((circ) * percent) - quart, false);

            if (percent < 1) {
                this.mCtx.fillText(remainingTime.toTimeString().split(' ')[0], p.x + this.tileSize.x * 0.4, pos.y);
                this.needRefresh = true;
            }
            this.mCtx.stroke();
        }
    }

    drawObject(id, o = {x: 0, y: 0, z: 0}) {
        const worldPosition = this.getPxFromTile(o);
        const object = this.assetManager.getObject(id);
        const height = this.tileSize.x * object.img.height / object.img.width;
        this.mCtx.drawImage(
            object.img,
            0,
            0,
            object.imgWidth,
            object.imgHeight,
            worldPosition.x,
            worldPosition.y - height + this.tileSize.y,
            this.tileSize.x,
            height
        );
    }

    drawDebug(o = {x: 0, y: 0, z: 0}) {
        const worldPosition = this.getPxFromTile(o);
        const TextTilePosition = '[' + o.x + ',' + o.y + ',' + o.z + ']';
        const TextWorldPosition = '[' + Math.floor(worldPosition.x) + ',' + Math.floor(worldPosition.y) + ']';
        worldPosition.x += this.tileSize.x / 3;
        worldPosition.y += this.tileSize.y / 2;

        this.mCtx.beginPath();
        this.mCtx.fillStyle = '#f0f';
        this.mCtx.fillText(TextTilePosition, worldPosition.x, worldPosition.y);
        worldPosition.y += 15;
        this.mCtx.fillText(TextWorldPosition, worldPosition.x, worldPosition.y);
        this.mCtx.stroke();
    }

    drawPolygone(poly = []) {
        this.mCtx.beginPath();
        this.mCtx.strokeStyle = '#f00';
        this.mCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        this.mCtx.lineWidth = 2;
        this.mCtx.moveTo(poly[0][0], poly[0][1]);
        for (let i = 1; i < poly.length; i++) {
            this.mCtx.lineTo(poly[i][0], poly[i][1]);
        }


        if (poly.length > 4) {
            this.mCtx.lineTo(poly[0][0], poly[0][1]);
            this.mCtx.lineTo(poly[0][0] + this.tileSize.x / 2, poly[0][1] + this.tileSize.y / 2);
            this.mCtx.lineTo(poly[0][0] + this.tileSize.x, poly[0][1]);
            this.mCtx.lineTo(poly[0][0] + this.tileSize.x / 2, poly[0][1] + this.tileSize.y / 2);
            this.mCtx.lineTo(poly[0][0] + this.tileSize.x / 2, poly[3][1] + this.tileSize.y / 2);
            this.mCtx.lineTo(poly[0][0] + this.tileSize.x / 2, poly[0][1] + this.tileSize.y / 2);

        }
        this.mCtx.closePath();

        this.mCtx.stroke();
    }

    getChunk(o = {x: 0, y: 0}) {
        return new Point2D(
            Math.floor(o.x / Config.chunkSize.x),
            Math.floor(o.y / Config.chunkSize.y));
    }

    isChunkLoaded(o = {x: 0, y: 0}) {
        for (const i in this.chunks) {
            if (this.chunks[i].x === o.x && this.chunks[i].y === o.y) {
                return true;
            }
        }

        return false;
    }

    checkChunks(o = {x: 0, y: 0}) {
        for (let x = o.x - 1; x <= o.x + 1; x++) {
            for (let y = o.y - 1; y <= o.y + 1; y++) {
                const chunkToCheck = {x: x, y: y};
                this.loadChunk(chunkToCheck);
            }
        }
    }

    loadChunk(o = {x: 0, y: 0}, tentatives = 0) {
        if (!o || this.isChunkLoaded(o)) {
            return;
        }

        this.chunks.push(o);
        Api.chunk(o);
    }

    checkNeighbors(o = {x: 0, y: 0, z: 0}) {
        const tile = this.getTile(o);
        const tileLeft = this.getTile({x: o.x, y: o.y + 1});
        const tileRight = this.getTile({x: o.x + 1, y: o.y + 1});

        if (tileLeft && tileRight) {
            return tile.z - tileLeft.z > 1 || tile.z - tileRight.z > 1;
        }
        return false;
    }

    draw(forceDraw = false) {
        if (!forceDraw && !this.needRefresh) {
            return;
        }

        if (Canvas === null || Canvas.ctx === null) {
            return;
        }

        this.needRefresh = false;
        Canvas.ctx.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
        this.mCanvas = document.createElement('canvas');
        this.mCanvas.width = Canvas.canvas.width;
        this.mCanvas.height = Canvas.canvas.height;
        this.mCtx = this.mCanvas.getContext('2d');
        const bounds = this.getDrawableBounds();
        for (let y = bounds.y; y < bounds.y + bounds.h; y++) {
            for (let x = bounds.x; x < bounds.x + bounds.w; x++) {
                if (this.isTile(new Point2D(x, y))) {
                    const tilePos = new Point3D(x, y, 0);
                    const tile = this.getTile(tilePos);
                    tilePos.z = tile.z;

                    if (this.checkNeighbors(tilePos)) {
                        this.drawTile({x: tilePos.x, y: tilePos.y, z: tilePos.z - 1});
                    }

                    this.drawTile(tilePos);
                    if (this.displayDebug) {
                        this.drawDebug(tilePos);
                    }

                    if (this.curentSelection && this.curentSelection.is({x: x, y: y, z: this.curentSelection.z})) {
                        const poly = this.getPolygonFromTile(tilePos);
                        this.drawPolygone(poly);
                    }

                    for (let i = 0; i < tile.content.length; i++) {
                        const obj = tile.content[i];
                        this.drawObject(obj.id, tilePos);

                        if (obj.id === 3) {
                            this.drawClock(obj, tilePos);
                        }
                    }
                }
            }
        }

        Canvas.ctx.drawImage(this.mCanvas,0, 0);

        // Canvas.ctx.putImageData(this.canvasData, 0, 0);
    }

    setTile(o = {x: 0, y: 0}, tile) {
        if (!this.map.hasOwnProperty(o.y)) {
            this.map[o.y] = {};
        }
        this.map[o.y][o.x] = tile;
        this.needRefresh = true;
    }

    setCurrentTileFromPX(o = {x: 0, y: 0}) {
        const detected = this.getTileFromWorld(o);
        if (this.isTile(detected)) {
            this.curentSelection = detected;
        } else {
            this.curentSelection = null;
        }
        return detected;
    }

    isTile(o = {x: 0, y: 0}) {
        if (!o) {
            return false;
        }
        if (this.map[o.y] !== undefined && this.map[o.y][o.x] !== undefined) {
            const tile = this.map[o.y][o.x];
            return (tile.z !== undefined);
        }

        return false;
    }

    getMapSize() {
        return new Point2D(this.map[0].length, this.map.length);
    }

    getTile(o = {x: 0, y: 0}) {
        if (this.isTile(o)) {
            return this.map[o.y][o.x];
        } else {
            return null;
        }

    }

    getDrawableBounds() {
        const begin = this.getTile2DFromWorld(new Point2D(this.tileSize.x, this.tileSize.y), true);

        return {
            x: begin.x - 2,
            y: begin.y - 2,
            w: Math.floor(Canvas.canvas.width / (this.tileSize.x)) + 3,
            h: Math.floor(Canvas.canvas.height / (this.tileSize.y / 2)) + Config.maxHeight + 1
        };
    }

    getTile2DFromWorld(o = {x: 0, y: 0}, withOffset = true) {
        const hWidth = this.tileSize.x / 2;
        const hHeight = this.tileSize.y / 2;

        let pX = o.x - hWidth;
        let pY = o.y - hHeight;

        if (withOffset) {
            pX -= this.screenOffset.x;
            pY -= this.screenOffset.y;
        }

        const x = Math.floor((pX + (pY - hHeight) * 2) / this.tileSize.x);
        const y = Math.floor((pY - (pX - hWidth) * 0.5) / this.tileSize.y);

        const ty = y + x + 2 - 1;
        const xOffset = ty % 2 !== 0 ? -1 : 0;
        const tx = Math.floor((x + xOffset - y) / 2) + 1;

        return new Point3D(tx, ty, 0);
    }

    getPxFromTile(o = {x: 0, y: 0, z: 0}) {
        const xOffset = o.y % 2 !== 0 ? this.tileSize.x / 2 : 0;
        return {
            x: o.x * this.tileSize.x + xOffset + this.screenOffset.x,
            y: o.y * this.tileSize.y / 2 - (o.z ? o.z : 0) * this.tileSize.z + this.screenOffset.y
        };
    }

    getTileFromWorld(o = {x: 0, y: 0}) {
        const tileToTest = this.getTile2DFromWorld(o);
        let result = null;

        if (this.isTile(tileToTest)) {
            tileToTest.z = this.getTile(tileToTest).z;
        } else {
            tileToTest.z = 0;
        }

        for (let y = 0; y < Config.maxHeight; y++) {
            if (y % 2 === 0) {
                const coord = new Point2D(tileToTest.x, tileToTest.y + y);
                if (!this.isTile(coord)) {
                    continue;
                }
                const polygon = this.getPolygonFromTile(coord);
                if (IsoMath.isPointInPolygon(o, polygon)) {
                    result = new Point3D(coord.x, coord.y, this.getTile(coord).z);
                }
            } else {
                const offset = 1 - tileToTest.y % 2;
                for (let x = -offset; x <= 1 - offset; x++) {
                    const coord = new Point2D(tileToTest.x + x, tileToTest.y + y);
                    if (!this.isTile(coord)) {
                        continue;
                    }
                    const polygon = this.getPolygonFromTile(coord);
                    if (IsoMath.isPointInPolygon(o, polygon)) {
                        result = new Point3D(coord.x, coord.y, this.getTile(coord).z);
                    }
                }
            }
        }

        if (!result && this.isTile(new Point2D(tileToTest.x, tileToTest.y))) {
            return new Point3D(tileToTest.x, tileToTest.y, this.getTile(tileToTest).z);
        }

        return result;
    }

    getPolygonFromTile(o: any) {
        const result = [];
        let z = 0;

        if (!o.z) {
            z = this.getTile(o).z;
        } else {
            z = o.z;
        }

        const pt = this.getPxFromTile(new Point3D(o.x, o.y, z));

        // letf top
        result.push([
            pt.x,
            pt.y + this.tileSize.y / 2
        ]);

        /*
        if (z !== 0) {
            // letf bot
            result.push([
                pt.x,
                pt.y + this.tileSize.y / 2 + z * this.tileSize.z
            ]);
        }
        */

        // bottom
        result.push([
            pt.x + this.tileSize.x / 2,
            pt.y + this.tileSize.y /* + z * this.tileSize.z */
        ]);

        // right bot

        /*
        if (z !== 0) {
        result.push([
            pt.x + this.tileSize.x,
            pt.y + this.tileSize.y / 2 + z * this.tileSize.z
        ]);
        }
        */

        // right top
        result.push([
            pt.x + this.tileSize.x,
            pt.y + this.tileSize.y / 2
        ]);

        // top
        result.push([
            pt.x + this.tileSize.x / 2,
            pt.y
        ]);
        return result;
    }
}
