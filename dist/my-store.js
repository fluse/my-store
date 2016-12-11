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
        _classCallCheck(this, Storage);

        this.isClient = typeof window !== 'undefined';

        this.defaultOptions = {
            expiration: 24
        };
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
        key: 'getStore',
        value: function getStore(name) {

            if (!this.isClient) {
                return null;
            }

            try {
                var store = localStorage.getItem(name);

                if (!store) {
                    return null;
                }

                store = JSON.parse(store);

                if (moment(store.expiredAt) < moment()) {
                    this.removeStore(name);
                    return null;
                }

                return JSON.parse(store);
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
