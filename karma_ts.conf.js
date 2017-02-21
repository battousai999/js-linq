module.exports = function(config) {
    config.set({

        frameworks: ["jasmine", "karma-typescript"],

        files: [
            { pattern: "spec-ts/jslinq.spec.ts" },
            { pattern: "jslinq.ts" }
        ],

        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },

        reporters: ["progress", "karma-typescript"],

        browsers: ["Chrome"],
        
        karmaTypescriptConfig: {
            exclude: [ "testing/*" ],
            include: [ 
                "spec-ts/jslinq.spec.ts",
                "jslinq.ts"
            ]
        }
    });
};
