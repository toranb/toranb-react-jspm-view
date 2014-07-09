System.config({
  "paths": {
    "*": "*.js",
    "npm:*": "jspm_packages/npm/*.js",
    "github:*": "jspm_packages/github/*.js"
  }
});

System.config({
  "map": {
    "promise-mixin": "github:toranb/toranb-react-amd-rsvp-promise-mixin@0.1.2",
    "github:toranb/toranb-react-amd-rsvp-promise-mixin@0.1.2": {
      "rsvp": "github:tildeio/rsvp.js@3.0.7"
    },
    "react": "npm:react@0.10.0",
    "npm:react@0.10.0": {},
    "github:jspm/nodelibs@0.0.2": {
      "json": "github:systemjs/plugin-json@master",
      "base64-js": "npm:base64-js@^0.0.4",
      "ieee754": "npm:ieee754@^1.1.1",
      "Base64": "npm:Base64@0.2",
      "inherits": "npm:inherits@^2.0.1"
    },
    "npm:ieee754@1.1.3": {},
    "npm:base64-js@0.0.4": {},
    "npm:Base64@0.2.1": {},
    "npm:inherits@2.0.1": {},
    "rsvp": "github:tildeio/rsvp.js@3.0.7"
  }
});

System.config({
  "versions": {
    "github:toranb/toranb-react-amd-rsvp-promise-mixin": "0.1.2",
    "github:tildeio/rsvp.js": "3.0.7",
    "npm:react": "0.10.0",
    "github:jspm/nodelibs": "0.0.2",
    "github:systemjs/plugin-json": "master",
    "npm:base64-js": "0.0.4",
    "npm:ieee754": "1.1.3",
    "npm:Base64": "0.2.1",
    "npm:inherits": "2.0.1"
  }
});

