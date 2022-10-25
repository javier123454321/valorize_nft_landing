const animation = require('./animation')
const Alpine = require('alpinejs')
const { mintModalProductNft } = require('./modal-logic')
const { artistsData } = require('./artists')
const { mintMembership } = require('./minting-membership')

console.log(Alpine)
Window.Alpine = Alpine.default
Window.Alpine.data('mintModal', mintModalProductNft)
Window.Alpine.data('artistsData', artistsData)
Window.Alpine.data('mintMembership', mintMembership)
Window.Alpine.start()