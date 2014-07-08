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
    "react": "npm:react@0.10.0"
  }
});

System.config({
  "versions": {
    "github:toranb/toranb-react-amd-rsvp-promise-mixin": "0.1.2",
    "npm:react": "0.10.0"
  }
});

