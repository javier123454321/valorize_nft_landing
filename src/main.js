const animation = require('./animation')
const Alpine = require('alpinejs')
const { mintModalProductNft } = require('./modal-logic')
const { artistsData } = require('./artists')

console.log(Alpine)
Window.Alpine = Alpine.default
Window.Alpine.data('mintModal', mintModalProductNft)
Window.Alpine.data('artistsData', artistsData)
Window.Alpine.start()