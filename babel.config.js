module.exports = function (api) {
    api.cache(true);

    const presets = [ 
        // "@babel/preset-env",
        [
          "@babel/preset-react",
          {
            "pragma": "Fly.createElement", // default pragma is React.createElement
            "pragmaFrag": "Fly.Fragment", // default is React.Fragment
            "throwIfNamespace": false // defaults to true
          }
        ]
    ];
    const plugins = [       
      '@babel/plugin-proposal-class-properties'
    ];
    
    return {
      presets,
      plugins
    };
  }