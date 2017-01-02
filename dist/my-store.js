'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

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
                var stringified = JSON.stringify(store);
                var encrypedStore = _cryptoJs2.default.AES.encrypt(stringified, options.secret);
                localStorage.setItem(name, encrypedStore);
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
        key: 'getStore',
        value: function getStore(name) {
            var _this = this;

            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


            if (!this.isClient) {
                return null;
            }

            options = (0, _extend2.default)({}, this.defaultOptions, options);

            try {
                var _ret = function () {
                    var store = localStorage.getItem(name);

                    if (!store) {
                        return {
                            v: null
                        };
                    }

                    var encrypedStore = _cryptoJs2.default.AES.decrypt(store.toString(), options.secret);
                    var stringifiedStore = encrypedStore.toString(_cryptoJs2.default.enc.Utf8);
                    store = JSON.parse(stringifiedStore);
                    var now = (0, _moment2.default)();

                    if ((0, _moment2.default)(store.expiredAt).isBefore(now)) {
                        _this.removeStore(name);
                        return {
                            v: null
                        };
                    }

                    setTimeout(function () {
                        callback(store.data);
                    }, 1);

                    return {
                        v: store.data
                    };
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            } catch (e) {
                return null;
            }
        }
    }, {
        key: 'removeStore',
        value: function removeStore(name) {

            if (!this.isClient) {
                return null;
            }

            try {
                localStorage.removeItem(name);
            } catch (e) {}
        }
    }]);

    return Storage;
}();

exports.default = Storage;
