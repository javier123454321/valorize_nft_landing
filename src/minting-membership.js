
exports.mintMembership = function membership() {
    return {
        nfts: [
            {
                title: "Whale",
                price: .01,
                description: "Whale mint function is for whales",
                mechanicsGraphic: "/img/whaleMechanics.jpg"
            },
            {
                title: "Seal",
                price: .5,
                description: "Seal mint function is for whales",
                mechanicsGraphic: "/img/whaleMechanics.jpg"
            },
            {
                title: "Plankton",
                price: .02,
                description: "Plankton mint function is for everyone",
                mechanicsGraphic: "/img/whaleMechanics.jpg"
            },
        ],
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