const ethers = require("ethers")
const { abi } = require("./consts")
const { BigNumber } = ethers
document.addEventListener('alpine:init', () => {
    Alpine.data('mintModal', () => ({
        nfts: [
            {
                title: 'Mycelia',
                imageSrc: './img/product-mycelia.png',
                amountToMint: 1,
                price: 0.5,
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
        async mint() {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner();
            const mintingContract = new ethers.Contract(
                "0x166d81bed86d601149092d031b33e4bd0c77921c",
                abi,
                signer
            )
            const priceInEth = BigNumber.from(this.nfts[this.index].price)
                .mul(BigNumber.from(1_000_000_000_000_000_000))
                .mul(BigNumber.from(this.nfts[this.index].amountToMint));
            console.log(priceInEth)
            try {
                this.deployTx = await mintingContract.rarestBatchMint(BigNumber.from(this.amountToMint), { value: priceInEth })
                this.statuses.next()
            } catch (err) {
                this.error = err
                return false
            }
        },
        statuses: {
            "INIT": {
                success: "PROVIDER_AVAILABLE",
                fail: "PROVIDER_UNAVAILABLE",
                transition: function checkProviderAvailabiliy() {
                    return !!window.ethereum
                },
            },
            "PROVIDER_UNAVAILABLE": {
                next: "INIT"
            },
            "PROVIDER_AVAILABLE": {
                success: "TRANSACTION_REQUESTED",
                fail: "REQUESTED_PROVIDER_DENIED",
                transition: sendRequestMethodToEtherObject
            },
            "REQUESTED_PROVIDER_DENIED": {
                next: "PROVIDER_AVAILABLE",
                transition: sendRequestMethodToEtherObject
            },
            "REQUESTED_PROVIDER_APPROVED": {
                success: "TRANSACTION_REQUESTED",
                fail: "REQUESTED_PROVIDER_DENIED",
                transition: this.mint
            },
            "TRANSACTION_REQUESTED": {
                success: "TRANSACTION_REQUEST_SUCCESS",
                fail: "TRANSACTION_REQUEST_FAIL",
                transition: function checkTransactionStatus() {
                        
                }
            },
            "TRANSACTION_REQUEST_SUCCESS": {
                success: "TRANSACTION_APPROVED",
                fail: "TRANSACTION_DENIED",
            },
            "TRANSACTION_REQUEST_FAIL": {
                next: "TRANSACTION_REQUESTED",
            },
            "TRANSACTION_APPROVED": {
                success: "TRANSACTION_SUCCESS",
                fail: "TRANSACTION_FAILED",
            },
            "TRANSACTION_DENIED": {
                next: "TRANSACTION_REQUESTED"
            },
            "TRANSACTION_FAILED": {
                next: "TRANSACTION_REQUESTED"
            },
            "TRANSACTION_SUCCESS": {
    
            }
        },
        currentStatus: "INIT",
        next: async function stateTransition() {
            if (this.statuses[this.currentStatus].hasOwnProperty("next")) {
                this.currentStatus = this.statuses[this.currentStatus].next
                return
            } else {
                const success = await this.statuses[this.currentStatus].transition()
                this.currentStatus = this.statuses[this.currentStatus][success ? "success" : "fail"]
                if (success) next()
            }
        }
    }))
})

class MintingStatus {
    statuses = {
        "INIT": {
            success: "PROVIDER_AVAILABLE",
            fail: "PROVIDER_UNAVAILABLE",
        },
        "PROVIDER_UNAVAILABLE": {
            next: "INIT"
        },
        "PROVIDER_AVAILABLE": {
            success: "REQUESTED_PROVIDER_SUCCESS",
            fail: "REQUESTED_PROVIDER_DENIED",
        },
        "REQUESTED_PROVIDER_DENIED": {
            success: "REQUESTED_PROVIDER_SUCCESS",
            fail: "PROVIDER_AVAILABLE",
        },    //3
        "REQUESTED_PROVIDER_SUCCESS": {
            next: "TRANSACTION_REQUESTED",
        },   //4
        "TRANSACTION_REQUESTED": {
            success: "TRANSACTION_REQUEST_SUCCESS",
            fail: "TRANSACTION_REQUEST_FAIL",
        },        //5
        "TRANSACTION_REQUEST_SUCCESS": {
            success: "TRANSACTION_APPROVED",
            fail: "TRANSACTION_DENIED",
        },
        "TRANSACTION_REQUEST_FAIL": {
            next: "TRANSACTION_REQUESTED",
        },
        "TRANSACTION_APPROVED": {
            success: "TRANSACTION_SUCCESS",
            fail: "TRANSACTION_FAILED",
        },
        "TRANSACTION_DENIED": {
            next: "TRANSACTION_REQUESTED"
        },            //6
        "TRANSACTION_FAILED": {
            next: "TRANSACTION_REQUESTED"
        },           //8
        "TRANSACTION_SUCCESS": {

        }
    }
    currentStatus = "INIT"
    constructor() { }
    async next(success = true) {
        if (this.statuses[this.currentStatus].hasOwnProperty("next")) {
            this.currentStatus = this.statuses[this.currentStatus].next
        } else if (this.statuses[this.currentStatus].hasOwnProperty("next")) {
            const success = await this.statuses[this.currentStatus].transition()
            this.currentStatus = this.statuses[this.currentStatus][success ? "success" : "fail"]
        }
    }
    get currentStatus() {
        return this.currentStatus
    }
}
async function sendRequestMethodToEtherObject() {
    try {
        await ethereum.request({ method: "eth_requestAccounts" })
        return true
    } catch (err) {
        return false
    }
}

