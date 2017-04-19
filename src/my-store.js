'use strict';

import Moment from 'moment';
import extend from 'extend';

export default class Storage {

    constructor(options = {}) {
        this.isClient = (typeof window !== 'undefined');

        this.defaultOptions = extend({
            expiration: 24,
            secret: 'myStore'
        }, options);
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

    onlyOnClient(cb = () => {}) {

        if (!this.isClient) {
            return null;
        }

        cb();
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
