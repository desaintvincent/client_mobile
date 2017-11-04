export default {
    // controls
    durationLongPress: 1000,
    durationDoubleTap: 200,
    distDoubleTap: 50,
    coefZoom: 0.1,
    coefPinch: 0.05,
    // Map settings
    maxZoom: 2,
    minZoom: 2,
    // requettes
    data: {
        assets: 'assets/datas/assets.json',
        imgFolder: 'assets/img/iso/'
    },
    api: {
        assetList: 'assetList',
        url: 'http://localhost',
        port: '3000',
        chunk: 'tiles/chunk',
        tile: 'tiles'
    }
};