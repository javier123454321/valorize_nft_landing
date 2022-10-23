const artistFullNames = [
    'Calicho Arevalo',
    'Alana McCarthy',
    'Samantha Pordes',
    'Martin Aveling',
    'Nahuel Bardi',
    'Callum Pickard',
    'Joel Ntm',
    'Carlos Nieto',
    'Neda Mamo',
    'Angga Tantama',
    'Jaye Kang',
    'Iqbal Hakim Boo',
]
const artists = [
    { shortName: "calichoart", fullName:'Calicho Arevalo', },
    { shortName: "alana", fullName: 'Alana McCarthy'},
    { shortName: "nftsammy", fullName: 'Samantha Pordes' },
    { shortName: "mart", fullName:'Martin Aveling', },
    { shortName: "nahuel", fullName:'Nahuel Bardi', },
    { shortName: "callum", fullName:'Callum Pickard', },
    { shortName: "joel", fullName:'Joel Ntm', },
    { shortName: "qstom", fullName:'Carlos Nieto', },
    { shortName: "neda", fullName:  'Neda Mamo',},
    { shortName: "angga", fullName:'Angga Tantama', },
    { shortName: "jaye", fullName: 'Jaye Kang', },
    { shortName: "iqbal", fullName:'Iqbal Hakim Boo', },
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
                price: .01,
                description: "Whale mint function is for whales",
                mechanicsGraphic: "/img/mechanicsWhale.jpg"
            },
            {
                title: "Seal",
                price: .5,
                description: "Seal mint function is for whales",
                mechanicsGraphic: "/img/mechanicsSeal.jpg"
            },
            {
                title: "Plankton",
                price: .02,
                description: "Plankton mint function is for everyone",
                mechanicsGraphic: "/img/mechanicsPlankton.jpg"
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
        index: 0,
        deployTx: {},
        txLink: '',
        nextNft() {
            this.index = ++this.index % this.nfts.length;
        },
        previousNft() {
            this.index = Math.abs(--this.index % this.nfts.length);
        },
        nft() {
            return this.nfts[this.index]
        },
        mintLess() {
            this.nfts[this.index].amountToMint > 1 && this.nfts[this.index].amountToMint--
        },
        mintMore() {
            this.nfts[this.index].amountToMint < 10 && this.nfts[this.index].amountToMint++
        },
        price() {
            const price = (this.nfts[this.index].price * this.nfts[this.index].amountToMint).toPrecision(2)
            return price
        },
        mintingErrorMsg: "",
        mintingError: false,
        minting: false,
        minted: false,
        mintingStatus: "",
    }
}