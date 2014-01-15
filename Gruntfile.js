module.exports = function(grunt){
    "use strict";
    grunt.initConfig({
        "jshint" : {
            files : {
                src : "src/*"
            }
        },
        "karma" : {
            unit : {
                configFile : "karma.conf.js",
                singleRun : true,
                browsers : ["PhantomJS"]
            }
        },
        "uglify" : {
            my_targe : {
                files : {
                    "dist/Validator.min.js" : "src/Validator.js"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask("default", ["jshint", "uglify", "karma:unit"]);
};