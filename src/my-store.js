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

    cleanStores() {
        try {
            let storages = localStorage;

            for (let name in storages) {
                let store = this.decrypt(storage[name], this.defaultOptions);
                this.removeOnExpiration(name, store);
            }
        } catch (e) {

        }
    }

    onlyOnClient(cb = () => {}) {

        if (!this.isClient) {
            return null;
        }

        cb();
    }

    decrypt(store, options) {
        if (!store) return null;

        try {
            return JSON.parse(store);
        } catch (e) {
            return null;
        }
    }

    getStore(name, callback = () => {}, options = {}) {

        if (!this.isClient) {
            return null;
        }

        options = extend({}, this.defaultOptions, options);

        try {
            let store = localStorage.getItem(name);

            store = this.decrypt(store, options);
            store = this.removeOnExpiration(name, store);

            if (!store) {
                return null;
            }

            callback(store.data);

            return store.data;
        } catch (e) {
            return null;
        }
    }

    removeOnExpiration(name, store) {

        if (!store) return null;

        let now = Moment();

        if (Moment(store.expiredAt).isBefore(now)) {
            this.removeStore(name);
            return null;
        }

        return store;
    }

    removeStore(name) {

        if (!this.isClient) {
            return null;
        }

        try {
            localStorage.removeItem(name);
            return true;
        } catch (e) {
            return false;
        }
    }

}
