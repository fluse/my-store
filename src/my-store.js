'use strict';

import Moment from 'moment';
import extend from 'extend';

export default class Storage {

    constructor() {
        this.isClient = (typeof window !== 'undefined');

        this.defaultOptions = {
            expiration: 24
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
            localStorage.setItem(name, JSON.stringify(store));
        } catch (e) {

        }
    }

    getStore(name, callback = () => {}) {

        if (!this.isClient) {
            return null;
        }

        try {
            let store = localStorage.getItem(name);

            if (!store) {
                return null;
            }

            store = JSON.parse(store);
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
