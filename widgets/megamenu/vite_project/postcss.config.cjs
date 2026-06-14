const prefixSelector = require('postcss-prefix-selector');

module.exports = {
    plugins: [
        prefixSelector({
            prefix: '.reactedge-megamenu',
            transform(prefix, selector, prefixedSelector) {
                if (selector.startsWith('html') || selector.startsWith('body')) {
                    return selector;
                }
                return prefixedSelector;
            },
        }),
    ],
};
