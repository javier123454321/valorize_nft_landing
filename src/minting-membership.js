const {
    sendRequestMethodToEtherObject,
    getTokenInfo,
    getNetworkInfo,
} = require("./utilities/nftMetadataUtils")
const { contractAddressMembership, abiMembership } = require("./consts")
const ethers = require("ethers")
const { BigNumber } = ethers

const artists = [
    { shortName: "calichoart", fullName: 'Calicho Arevalo' },
    { shortName: "alana", fullName: 'Alana McCarthy' },
    { shortName: "nftsammy", fullName: 'Samantha Pordes' },
    { shortName: "mart", fullName: 'Martin Aveling' },
    { shortName: "nahuel", fullName: 'Nahuel Bardi' },
    { shortName: "callum", fullName: 'Callum Pickard' },
    { shortName: "joel", fullName: 'Joel Ntm' },
    { shortName: "qstom", fullName: 'Carlos Nieto' },
    { shortName: "neda", fullName: 'Neda Mamo' },
    { shortName: "angga", fullName: 'Angga Tantama' },
    { shortName: "jaye", fullName: 'Jaye Kang' },
    { shortName: "iqbal", fullName: 'Iqbal Hakim Boo' },
]
const rarities = ["silver", "gold", "diamond", "obsidian", "mycelia"]
const rarityDescriptors = {
    "SILVER": "Silver rarity is the lowest rarity, there are 100 NFTs that share this art.",
    "GOLD": "Gold rarity is the second lowest rarity, there are 60 NFTs that share this particular artwork. This is the lowest possible rarity for a Seal Mint function.",
    "DIAMOND": "Diamond rarity is the third lowest rarity. There are only 20 NFTs that share this artwork. Diamond is the lowest rarity possible when you use the Whale Mint function.",
    "OBSIDIAN": "Obsidian rarity is the second highest rarity. Only 5 NFTs will share this art.",
    "MYCELIA": "Mycelia is the highest rarity. The mycelia NFTs are completely unique 1 of 1 artworks."
}

exports.mintMembership = function membership() {
    return {
        init() {
            this.setupRandomPreview()
        },
        nfts: [
            {
                title: "Whale",
                price: .3,
                description: "Whale mint function is for whales",
                mechanicsGraphic: "/img/mechanicsWhale.jpg",
                previous: "Plankton",
                next: "Seal",
            },
            {
                title: "Seal",
                price: .2,
                description: "Seal mint function is for whales",
                mechanicsGraphic: "/img/mechanicsSeal.jpg",
                previous: "Whale",
                next: "Plankton",
            },
            {
                title: "Plankton",
                price: .1,
                description: "Plankton mint function is for everyone",
                mechanicsGraphic: "/img/mechanicsPlankton.jpg",
                previous: "Seal",
                next: "Whale",
            },
        ],
        randomRarity: 0,
        randomArtistIndex: 0,
        randomArtDescription: '',
        setupRandomPreview() {
            this.randomRarity = Math.round(Math.random() * 4)
            this.randomArtistIndex = Math.round(Math.random() * 11)
            this.randomArtDescription = rarityDescriptors[this.rarityString()]
        },
        nftPreviewImage() {
            return '/img/nfts/' + rarities[this.randomRarity] + '/' + artists[this.randomArtistIndex].shortName + '.jpg'
        },
        rarityString() {
            return rarities[this.randomRarity].toLocaleUpperCase()
        },
        randomArtist() {
            return artists[this.randomArtistIndex].fullName
        },
        showDescription: false,
        previousMint: '',
        nextMint: '',
        index: 0,
        deployTx: {},
        txLink: '',
        nft() {
            return this.nfts[this.index]
        },
        mintingErrorMsg: "",
        mintingError: false,
        minting: false,
        minted: false,
        mintingStatus: "",
        async mint() {
            this.mintingError = false
            this.mintingErrorMsg = ''
            this.mintingStatus = "Requesting your wallet to connect"
            const hasProvider = await sendRequestMethodToEtherObject()
            if (!hasProvider) {
                this.setError("We requested you to connect your wallet, please do to continue")
                return
            }
            this.mintingStatus = "Getting contract info"
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const networkInfo = await getNetworkInfo(provider)
            if (networkInfo.error) {
                this.setError("Please connect to mainnet")
                return
            }
            const membershipNft = new ethers.Contract(
                contractAddressMembership[networkInfo.chainId],
                abiMembership,
                signer
            )
            const priceInEth = ethers.utils.parseEther(this.nfts[this.index].price.toString())
            let receipt;
            try {
                this.mintingStatus = "Requesting transaction"
                console.log("sending", priceInEth.toString())
                this.mintingStatus = "Waiting for transaction to confirm"
                const mintingFunction = ["randomWhaleMint", "randomSealMint", "randomPlanktonMint"][this.index]
                const deployTx = await membershipNft[mintingFunction]({ value: priceInEth })
                this.minting = true
                this.mintingStatus = `<div class="pt-8 pb-2">Transaction submitted, minting now!</div>
<div class="p-4 flex justify-center">
    <img src="/img/puff.svg">
</div>`
                receipt = await deployTx.wait()
                this.deployTx = receipt
                this.txLink = `https://${networkInfo.chainId == '3' ? 'ropsten.' : ''}etherscan.io/tx/${receipt.transactionHash}`
                setTimeout(() => this.minted = true, 3000)
                this.mintingStatus = `Minted!
                <a 
                    href='${this.txLink}'
                    target="_blank"
                    class="border-b pb-1">
                    See your transaction here!
                </a>`
                console.log({ receipt })
            } catch (err) {
                if (err.toString().search(/Batch sold out/) !== -1) {
                    this.setError("Batch is sold out! Check soon and follow our twitter to find out about next batches")
                    return
                } else if (err.toString().search(/rarity is sold out/) !== -1) {
                    this.setError("We are sold out of " + this.nft().title + " NFTS!")
                    return
                }
                console.error(err)
                this.setError("Error minting, Sorry! Please contact us to figure out what happened")
            }
            const info = await membershipNft.queryFilter(membershipNft.filters.MintedTokenInfo(), receipt.blockHash)
            const event = info.find(e => e.transactionHash === receipt.transactionHash)
            if (event) {
                console.log({ event })
                const tokenId = event.args.tokenId.toString()
                const tokenInfo = await getTokenInfo(membershipNft, tokenId)
                if (tokenInfo) {
                    tokenInfo.urlPublic = getUrlPublic(this.nft().title.toLowerCase())
                    this.tokenInfo = tokenInfo
                    return
                }
            }
            this.setError(`
                    Somehow we got an error getting your token info. <br>
                    <a class="border-b pb-1" href='${this.txLink}}'>
                        You can see it here: 
                    </a>
                `)
        },
        setError(msg) {
            this.minting = false
            this.mintingError = true
            this.mintingErrorMsg = msg
        },
    }
}