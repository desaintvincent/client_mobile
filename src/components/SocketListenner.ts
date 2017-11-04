import Map from './Map';
import Socket from './Socket';

export default class SocketListenner {
    map: Map;
    constructor(map) {
        this.map = map;
    }

    listen() {
        Socket.io.on('setChunk', (data) => { this.setChunk(data) });
        Socket.io.on('updateTile', (data) => { this.updateTile(data) });
    }

    setChunk(data) {
        const tiles = data.tiles;
        for (const index in tiles) {
            const tile = tiles[index];
            this.map.setTile({x: tile.x, y: tile.y}, tile);
        }
        this.map.chunks.push(data.chunk);
    }

    updateTile(data) {
        this.map.setTile({x: data.x, y: data.y}, data);
    }
}
