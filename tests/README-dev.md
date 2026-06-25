
./node_modules/.bin/playwright   \
    test    \
    --config=tests/playwright.dev.config.ts   \
    widgets/banner/tests

PWDEBUG=1 ./node_modules/.bin/playwright   \
test    \
--config=tests/playwright.stage.config.ts   \
widgets/banner/tests \
--headed


PWDEBUG=1 ./node_modules/.bin/playwright \
test \
--config=tests/playwright.stage.config.ts \
widgets/banner/tests \
--headed 

DEBUG=pw:api ./node_modules/.bin/playwright \
test \
--config=tests/playwright.stage.config.ts \
widgets/banner/tests \
--headed 