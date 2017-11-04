/* global document */
export default class FPS {
    _fpsInterval: any;
    _loopThen: any;
    _loopNow: any;
    _loopStartTime: any;
    _loopElapsedTime: any;
    _frameCount: any;
    _$displayFPS: any;

    constructor(fps) {
        this._fpsInterval = 0;
        this._loopThen = null;
        this._loopNow = null;
        this._loopStartTime = null;
        this._loopElapsedTime = null;
        this._frameCount = 0;
        this._$displayFPS = document.getElementById('displayFPS');
        this._fpsInterval = 1000 / fps;
        this._loopThen = Date.now();
        this._loopStartTime = this._loopThen;
    }

    run(callback) {
        this._loopNow = Date.now();
        this._loopElapsedTime = this._loopNow - this._loopThen;
        // if enough time has elapsed, draw the next frame
        if (this._loopElapsedTime > this._fpsInterval) {
            // Get ready for next frame by setting then=now, but...
            // Also, adjust for fpsInterval not being multiple of 16.67
            this._loopThen = this._loopNow - (this._loopElapsedTime % this._fpsInterval);

            callback();

            // TESTING...Report #seconds since start and achieved fps.
            // const sinceStart = this._loopNow - this._loopStartTime;
            // const currentFps = Math.round(1000 / (sinceStart / ++this._frameCount) * 100) / 100;
            // this._$displayFPS.innerHTML = `FPS = ${currentFps}. (${Math.round(sinceStart / 1000) /*  * 100) / 100*/} secs)`;

        }
    }
}
