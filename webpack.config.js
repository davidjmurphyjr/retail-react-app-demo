const config = require('@salesforce/pwa-kit-dev/configs/webpack/config')
const path = require('path')

config.forEach((c) => {
    c.resolve = {
        ...c.resolve,
        alias: {
            ...c?.resolve?.alias,
            '~': path.resolve(__dirname, './overrides')
        }
    }
})

module.exports = config
