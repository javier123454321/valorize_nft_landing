const ethers = require("ethers")
console.log({ethers})
const { abi, contractAddress } = require("./consts")
const { BigNumber } = ethers
const {
    sendRequestMethodToEtherObject,
    getTokenInfo,
    getNetworkInfo,
} = require("./utilities/nftMetadataUtils")

exports.mintModalProductNft = function mintModalProductNFT() {
    return {
        nfts: [
            {
                title: 'Mycelia',
                imageSrc: './img/product-mycelia.png',
                amountToMint: 1,
                price: 1.5,
                available: true,
                description: "Get 5 hours of consultation time with our team of tokenomics experts and we will help you define a token's parameters, needs, KPIs, as well as next steps.",
            },
            {
                title: 'Silver',
                imageSrc: './img/product-silver.png',
                amountToMint: 1,
                price: 0.1,
                available: true,
                description: "Token launch in our platform, today (normal price of 0.3 ETH) and 1 year access to our platform.",
            },
            {
                title: 'Diamond',
                imageSrc: './img/product-diamond.png',
                amountToMint: 0,
                price: 0.5,
                available: false,
                description: "Conversation with tokenomics expert to define token, access to dashboard for a 2 year minimum and priority customer support.",
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
            const signer = provider.getSigner();
            const networkInfo = await getNetworkInfo(provider)
            if (networkInfo.error) {
                this.setError("Please connect to mainnet")
            }
            const productNft = new ethers.Contract(
                contractAddress[networkInfo.chainId],
                abi,
                signer
            )
            const priceInEth = ethers.utils.parseEther(this.nfts[this.index].price.toString())
                .mul(BigNumber.from(this.nfts[this.index].amountToMint));
            let receipt;
            try {
                this.mintingStatus = "Requesting transaction"
                console.log("sending", priceInEth.toString())
                this.mintingStatus = "Waiting for transaction to confirm"
                const mintingFunction = ["rarestBatchMint", "rareBatchMint", "rarerBatchMint"][this.index]
                const deployTx = await productNft[mintingFunction](this.nfts[this.index].amountToMint, { value: priceInEth })
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
                this.setError("Error minting, Sorry! Please contact us to figure out what happened")
            }
            const info = await productNft.queryFilter(productNft.filters.MintedTokenInfo(), receipt.blockHash)
            const event = info.find(e => e.transactionHash === receipt.transactionHash)
            if (event) {
                const tokenId = event.args.tokenId.toString()
                const tokenInfo = await getTokenInfo(productNft, tokenId)
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
        tokenInfo: {
            properties: {
                token_id: 0
            }
        }
    }
}

/**
 * @param {string} rarity
 * @returns {string} url of vimeo player
 */
function getUrlPublic(rarity) {
    const urls = {
        mycelia: "https://player.vimeo.com/video/751511053?h=284ef138605&amp;title=0&amp;byline=0&amp;portrait=0&amp;speed=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&autoplay=1&loop=1&quality=720p",
        silver: "https://player.vimeo.com/video/751516045?h=a6bb1b7b05&amp;title=0&amp;byline=0&amp;portrait=0&amp;speed=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&autoplay=1&loop=1&quality=720p",
        diamond: "https://player.vimeo.com/video/751516045?h=a6bb1b7b05&amp;title=0&amp;byline=0&amp;portrait=0&amp;speed=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&autoplay=1&loop=1&quality=720p"
    }
    return urls[rarity]
}