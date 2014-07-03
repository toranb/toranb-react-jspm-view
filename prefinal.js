var React = require('react');
var AsyncComponent = require('./component');

var PreFinal = React.createClass({displayName: 'PreFinal',
    mixins: [AsyncComponent],
    bundle: 'github:toranb/toranb-react-jspm-view@0.1.5/final',
    preRender: function() {
      return React.DOM.div(null, "Loading final...")
    }
});

module.exports = PreFinal;
