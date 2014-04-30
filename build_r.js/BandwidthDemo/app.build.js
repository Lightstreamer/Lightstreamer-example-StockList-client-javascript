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
    
    //if using the non-namespaced version of the Lightstreamer library remove the "Lightstreamer/" prefix from LightstreamerClient, Subscription and StatusWidget module names
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