var React = require('react');

var PreFinal = React.createClass({displayName: 'PreFinal',
    loadedComponent: null,
    load: function() {
      var self = this;
      if (this.constructor.loadedComponent) {
        return;
      }
      System.import("github:toranb/toranb-react-jspm-view@0.2.0/final")
      .then(function(cjs_module) {
        return cjs_module;
      })
      .then(function(component) {
        self.constructor.loadedComponent = component;
        self.forceUpdate();
      })
      .catch(function(e) {
        console.log("an error occurred loading the final react component");
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
