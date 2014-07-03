var React = require('react');
var AsyncComponent = require('./component');

var PreFinal = React.createClass({displayName: 'PreFinal',
    mixins: [AsyncComponent],
    bundle: 'jspm_packages/github/toranb/toranb-react-jspm-view@0.1.2/final',
    preRender: function() {
      return React.DOM.div(null, "Loading final...")
    }
});

module.exports = PreFinal;
