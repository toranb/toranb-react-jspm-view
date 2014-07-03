var React = require('react');
var AsyncComponent = require('./component');

var PreFinal = React.createClass({displayName: 'PreFinal',
    mixins: [AsyncComponent],
    bundle: './final',
    preRender: function() {
      return React.DOM.div(null, "Loading final...")
    }
});

module.exports = PreFinal;
