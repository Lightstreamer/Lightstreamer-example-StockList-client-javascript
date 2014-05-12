({
    appDir: "../../src/BandwidthDemo",
    baseUrl: ".",
    dir: "../../built",
    
    //if using node to build the project this setting must be changed to "uglify"
    optimize: "closure",
    closure: {
        CompilationLevel: 'SIMPLE_OPTIMIZATIONS',
        loggingLevel: 'WARNING',
    },
    
    skipDirOptimize: true,
    
    normalizeDirDefines: "skip",
    
    optimizeCss: "standard.keepLines",
    
    paths: {
      "LightstreamerClient": "empty:",
      "Subscription": "empty:",
      "StatusWidget": "empty:",
      "DynaGrid": "empty:"
    },
    
    modules: [
        {
            name: "index",
            includeRequire: false
        }
    ],
    
    preserveLicenseComments: false
})