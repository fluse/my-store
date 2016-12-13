'use strict';

import Moment from 'moment';
import extend from 'extend';
import CryptoJS from 'crypto-js';

export default class Storage {

    constructor() {
        this.isClient = (typeof window !== 'undefined');

        this.defaultOptions = {
            expiration: 24,
            secret: 'myStore'
        }
    }

    setStore(name, data, options = {}) {

        if (!this.isClient) {
            return null;
        }

        options = extend({}, this.defaultOptions, options);

        let store = {
            expiredAt: Moment().add(options.expiration, 'h').toDate(),
            data
        }

        try {
            let stringified = JSON.stringify(store);
            let encrypedStore = CryptoJS.AES.encrypt(stringified, options.secret);
            localStorage.setItem(name, encrypedStore);
        } catch (e) {

        }
    }

    getStore(name, callback = () => {}, options = {}) {

        if (!this.isClient) {
            return null;
        }

        options = extend({}, this.defaultOptions, options);

        try {
            let store = localStorage.getItem(name);

            if (!store) {
                return null;
            }

            let encrypedStore = CryptoJS.AES.decrypt(ciphertext.toString(), options.secret);

            store = JSON.parse(encrypedStore);
            let now = Moment();

            if (Moment(store.expiredAt).isBefore(now)) {
                this.removeStore(name);
                return null;
            }

            setTimeout(() => {
                callback(store.data);
            }, 1);

            return store.data;
        } catch (e) {
            return null;
        }
    }

    removeStore(name) {

        if (!this.isClient) {
            return null;
        }

        try {
            localStorage.removeItem(name);
        } catch (e) {

        }
    }

}
