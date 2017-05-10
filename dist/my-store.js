'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Storage = function () {
    function Storage() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Storage);

        this.isClient = typeof window !== 'undefined';

        this.defaultOptions = (0, _extend2.default)({
            expiration: 24,
            secret: 'myStore'
        }, options);
    }

    _createClass(Storage, [{
        key: 'setStore',
        value: function setStore(name, data) {
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


            if (!this.isClient) {
                return null;
            }

            options = (0, _extend2.default)({}, this.defaultOptions, options);

            var store = {
                expiredAt: (0, _moment2.default)().add(options.expiration, 'h').toDate(),
                data: data
            };

            try {
                localStorage.setItem(name, JSON.stringify(store));
            } catch (e) {}
        }
    }, {
        key: 'cleanStores',
        value: function cleanStores() {
            try {
                var storages = localStorage;

                for (var name in storages) {
                    var store = this.decrypt(storage[name], this.defaultOptions);
                    this.removeOnExpiration(name, store);
                }
            } catch (e) {}
        }
    }, {
        key: 'onlyOnClient',
        value: function onlyOnClient() {
            var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};


            if (!this.isClient) {
                return null;
            }

            cb();
        }
    }, {
        key: 'decrypt',
        value: function decrypt(store, options) {
            if (!store) return null;

            try {
                return JSON.parse(store);
            } catch (e) {
                return null;
            }
        }
    }, {
        key: 'getStore',
        value: function getStore(name) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


            if (!this.isClient) {
                return null;
            }

            options = (0, _extend2.default)({}, this.defaultOptions, options);

            try {
                var store = localStorage.getItem(name);

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
    }, {
        key: 'removeOnExpiration',
        value: function removeOnExpiration(name, store) {

            if (!store) return null;

            var now = (0, _moment2.default)();

            if ((0, _moment2.default)(store.expiredAt).isBefore(now)) {
                this.removeStore(name);
                return null;
            }

            return store;
        }
    }, {
        key: 'removeStore',
        value: function removeStore(name) {

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
    }]);

    return Storage;
}();

exports.default = Storage;
