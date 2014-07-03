var PromiseMixin = require('promise-mixin');

var AjaxMixin = (function() {
    var mixin = function() {
    };
    mixin.prototype.xhr = function(url, type, hash) {
        hash = hash || {};
        hash.url = url;
        hash.type = type;
        hash.dataType = "json";
        var helper = new PromiseMixin();
        return helper.promise(url, type, hash);
    }
    return mixin;
})();

module.exports = AjaxMixin;
