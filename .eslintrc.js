module.exports = {
    "extends": [
        "eslint:recommended",
        "plugin:node/recommended"
    ],
    "rules": {
        "no-undef": "warn", // Couldn't find a preset that could handle Mocha's "it" well.
                            // Also: I check for "window" and that was one of the errors as well.
        "node/no-unpublished-require": "warn",
                            // node-webcrypto-ossl is marked as "not published", but I'm 100% sure it's in the NPM.
    }
};