var React = require('react');

var PreFinal = React.createClass({displayName: 'PreFinal',
    loadedComponent: null,
    load: function() {
      var self = this;
      if (this.constructor.loadedComponent) {
        return;
      }
      System.import("github:toranb/toranb-react-jspm-view@0.1.6/final")
      .then(function(es6_module) {
        return es6_module.default;
      })
      .then(function(component) {
        self.constructor.loadedComponent = component;
        self.forceUpdate();
      })
      .catch(function(e) {
        console.log("error loading the final module");
        console.log(e);
      });
    },

    componentDidMount: function() {
      setTimeout(this.load, 500);
    },

    render: function() {
      var component = this.constructor.loadedComponent;
      return component ? component(this.props) : this.preRender();
    },
    preRender: function() {
      return React.DOM.div(null, "Loading final...")
    }
});

module.exports = PreFinal;
