const prefixSelector = require('postcss-prefix-selector');

module.exports = {
    plugins: [
        prefixSelector({
            prefix: '.reactedge-usp',
            transform(prefix, selector, prefixedSelector) {
                if (selector.startsWith('html') || selector.startsWith('body')) {
                    return selector;
                }
                return prefixedSelector;
            },
        }),
    ],
};
