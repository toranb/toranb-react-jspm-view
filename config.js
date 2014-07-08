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
    "react": "npm:react@0.10.0"
  }
});

System.config({
  "versions": {
    "github:toranb/toranb-react-amd-rsvp-promise-mixin": "0.1.2",
    "github:tildeio/rsvp.js": "3.0.7",
    "npm:react": "0.10.0"
  }
});

