module.exports = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-recess-order',
        'stylelint-config-recommended-scss',
    ],
    rules: {
        indentation: 4,
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
        'scss/comment-no-empty': null,
        'no-empty-source': null,
        'rule-empty-line-before': [
            'always',
            {
                except: 'inside-block',
            },
        ],
        'function-no-unknown': null,
        'value-keyword-case': [
            'lower',
            {
                ignoreFunctions: ['v-bind'],
            },
        ],
    },
    "customSyntax": "postcss-html"
};
