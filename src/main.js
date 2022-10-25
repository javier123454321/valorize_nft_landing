const animation = require('./animation')
const { mintModalProductNft } = require('./modal-logic')
const { artistsData } = require('./artists')
const { mintMembership } = require('./minting-membership')

Window.Alpine.data('mintModal', mintModalProductNft)
Window.Alpine.data('artistsData', artistsData)
Window.Alpine.data('mintMembership', mintMembership)
Window.Alpine.start()