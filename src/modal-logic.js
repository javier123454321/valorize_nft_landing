const ethers = require("ethers")
const { abi, contractAddress } = require("./consts")
const { BigNumber } = ethers

document.addEventListener('alpine:init', () => {
    Alpine.data('mintModal', () => ({
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
                price: 0.3,
                available: false,
                description: "Conversation with tokenomics expert to define token, access to dashboard for a 2 year minimum and priority customer support.",
            },

        ],
        showDescription: false,
        index: 0,
        deplyTx: {},
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
        mintingStatus: "",
        async mint() {
            this.minting = true
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
                const deployTx = await productNft.rarestBatchMint(this.nfts[this.index].amountToMint, { value: priceInEth })
                this.mintingStatus = "Transaction submitted, might take a few moments"
                receipt = await deployTx.wait()
                this.mintingStatus = `Minted!
                <a 
                    href='https://${networkInfo.chainId == '3'? 'ropsten.':''}etherscan.io/tx/${receipt.transactionHash}'
                    target="_blank"
                    class="border-b pb-1">
                    See your transaction here!
                </a>`
                console.log({ receipt })
            } catch (err) {
                if (err.toString().search(/Batch sold out/) !== -1) {
                    this.setError("Batch is sold out!")
                    return
                }
                this.setError("Error minting, Sorry! Please contact us to figure out what happened")
            }
            const info = await productNft.queryFilter(productNft.filters.MintedTokenInfo(), receipt.blockHash)
            const event = info.find(e => e.transactionHash === receipt.transactionHash)
            if (event) {
                console.log(event.args)
                console.log(event.args.tokenId.toString())
                this.minted = true
                
            } else {
                this.setError(`
                    Somehow we got an error getting your token info. <br>
                    <a class="border-b pb-1" href='https://${networkInfo == '3'? 'ropsten.':''}etherscan.io/tx/${receipt.transactionHash}'>
                        You can see it here: 
                    </a>
                `)
            }
        },
        setError(msg) {
            this.minting = false
            this.mintingError = true
            this.mintingErrorMsg = msg
        }

    })
    )
})
async function sendRequestMethodToEtherObject() {
    try {
        await ethereum.request({ method: "eth_requestAccounts" })
        return true
    } catch (err) {
        return false
    }
}

async function getNetworkInfo(provider) {
    const networkData = await provider.getNetwork()
    const chainId = networkData.chainId.toString()
    console.log({ chainId })

    if (!["1", "3"].includes(chainId)) return { chainId, error: true, msg: "Incorrect Chain" }
    provider.on("network", async (newNetwork, oldNetwork) => {
        if (oldNetwork) {
            if (!["1", "3"].includes(newNetwork.chainId.toString())) {
                console.log("succesfully changed to valid network")
            }
        }
    })
    return { chainId, error: false }
}