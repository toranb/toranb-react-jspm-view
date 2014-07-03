import React from 'react';
import AsyncComponent from './component';

var PreFinal = React.createClass({displayName: 'PreFinal',
    mixins: [AsyncComponent],
    bundle: './app/final',
    preRender: function() {
      return React.DOM.div(null, "Loading final...")
    }
});

export default PreFinal;
