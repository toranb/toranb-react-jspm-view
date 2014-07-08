how to build a new jspm library like this

    jspm install promise-mixin=github:toranb/toranb-react-amd-rsvp-promise-mixin@0.1.2
    jspm install react=npm:react@0.10.0

    jspm bundle prefinal wat.js //todo (exclude React from this bundle?)

The intent behind this module is to show if jspm can bundle w/ configuration

ie -we want to "bundle" without the react dependency
