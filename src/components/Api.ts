import ClientConfig from './ClientConfig';
import axios from 'axios';
import Socket from './Socket';
import swal from 'sweetalert2';

export default class Api {
    static init() {
        // axios.defaults.timeout = 1000;
    }

    static ApiCheck(response) {
        if (response !== undefined && response.data !== undefined && !response.data) {
            return null;
        }
        return response;
    }

    static ApiError(error, callback = null) {
        if ((error.response === undefined || error.response === 404)) {
            if (callback) {
                callback();
            } else {
                swal({
                    title: 'Network error',
                    type: 'error',
                    showCancelButton: false,
                    html: `An error occured`,
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                });
            }
        } else {
            swal({
                title: error.response.statusText,
                type: 'warning',
                showCancelButton: false,
                html: `You shouldn't try to do that!`,
                confirmButtonText: 'OK, sorry',
            });
        }
        return error;
    }

    static chunk(o) {
        Socket.io.emit('getChunk', o);
    }

    static updateTile(tile) {
        Socket.io.emit('setTile', tile);
    }

    static assetFile() {
        return axios.get(`${ClientConfig.api.url}:${ClientConfig.api.port}/${ClientConfig.api.assetList}`)
            .then(response => Api.ApiCheck(response))
            .catch(response => Api.ApiError(response));
    }
}
