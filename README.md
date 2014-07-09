how to build a new jspm library like this

    jspm install

    cd jspm_packages/github/tildeio/rsvp.js@3.0.7
    mv rsvp.js rsvp.js.js
    cd -

    jspm bundle final bundle.js
    
    //next open bundle.js file and manually remove any react@0.10 System.register block
    //finally rename the "final" module name to the full name used to reference it
    //github:toranb/toranb-react-jspm-view@0.2.2/final

The intent behind this module (long term) is to show how jspm can bundle without react

**What I did to build the config file/package.json file (when I started the library)**

    jspm install promise-mixin=github:toranb/toranb-react-amd-rsvp-promise-mixin@0.1.2
    jspm install react=npm:react@0.10.0
    jspm install rsvp=github:tildeio/rsvp.js@3.0.7 -o "{main: 'lib/rsvp.js'}"
