import React from 'react';
import PromiseMixin from 'promise-mixin';

var Final = React.createClass({
    render: function() {
        var hash = {};
        hash.url = "/api/incoming";
        hash.type = "GET";
        hash.dataType = "json";
        var mixin = new PromiseMixin();
        mixin.promise("/api/incoming", "GET", hash).then(function(response) {
            response.forEach(function(item) {
                console.log("final promise-mixin invoked!");
                console.log(item);
            });
        });
        return (
            React.DOM.div(null, 
                React.DOM.h1(null, "Final!")
            )
        );
    }
});

export default Final;
