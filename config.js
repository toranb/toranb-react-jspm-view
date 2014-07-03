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
    "npm:react": "npm:react@^0.10.0",
    "npm:react@0.10.0": {},
    "github:jspm/nodelibs@0.0.2": {
      "base64-js": "npm:base64-js@^0.0.4",
      "ieee754": "npm:ieee754@^1.1.1",
      "inherits": "npm:inherits@^2.0.1",
      "json": "github:systemjs/plugin-json@master",
      "Base64": "npm:Base64@0.2"
    },
    "npm:ieee754@1.1.3": {},
    "npm:inherits@2.0.1": {},
    "npm:base64-js@0.0.4": {},
    "npm:Base64@0.2.1": {}
  }
});

System.config({
  "versions": {
    "github:toranb/toranb-react-amd-rsvp-promise-mixin": "0.1.2",
    "github:tildeio/rsvp.js": "3.0.7",
    "npm:react": "0.10.0",
    "github:jspm/nodelibs": "0.0.2",
    "npm:base64-js": "0.0.4",
    "npm:ieee754": "1.1.3",
    "npm:inherits": "2.0.1",
    "github:systemjs/plugin-json": "master",
    "npm:Base64": "0.2.1"
  }
});

