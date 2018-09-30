module.exports = {
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": ["error", 4],
        "linebreak-style": ["error", "windows"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "no-unused-vars": "off",
        "no-undef": "error",
        "no-self-assign": "off",
        "no-trailing-spaces": "error",
        "comma-dangle": "error",
        "curly": "error",
        "no-plusplus": "error",
        "strict": ["error", "global"],
        "no-use-before-define": "error",
        "eqeqeq": "error",
        "no-inner-declarations": ["error", "both"],
        "no-invalid-this": "error",
        "block-spacing": "error",
        "brace-style": "error",
        "space-infix-ops": "error",
        "space-before-function-paren": "error",
        "no-multi-spaces": "error",
        "space-in-parens": "error",
        "no-unused-vars": ["error", {"args": "after-used"}],
        "comma-spacing": "error"
    }
};