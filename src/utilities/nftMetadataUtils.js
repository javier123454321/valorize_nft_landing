const ethers = require("ethers")

async function sendRequestMethodToEtherObject() {
    try {
        await ethereum.request({ method: "eth_requestAccounts" })
        return true
    } catch (err) {
        return false
    }
}

/**
 * Needs the instantiated contract object and returns the metadata
 * @param {ethers.Contract} nftContractInstance
 * @param {string} tokenId
 * @returns {{title: string, animation_url:string, properties:object}}
 */
async function getTokenInfo1155(nftContractInstance, tokenId) {
    const url = await nftContractInstance.uri(tokenId)
    const req = await fetch(url)
    console.log({url})
    if (!req.ok) return 
    console.log({req})
    return req.json()
}

/**
 * Needs the instantiated contract object and returns the metadata
 * @param {ethers.Contract} nftContractInstance
 * @param {string} tokenId
 * @returns {{title: string, animation_url:string, properties:object}}
 */
 async function getTokenInfo721(nftContractInstance, tokenId) {
    const url = await nftContractInstance.tokenURI(tokenId)
    const req = await fetch(url)
    console.log({url})
    if (!req.ok) return 
    console.log({req})
    return req.json()
}

async function getNetworkInfo(provider) {
    const networkData = await provider.getNetwork()
    const chainId = networkData.chainId.toString()
    console.log("connected to network: ", { chainId })

    if (!["1", "3", "5"].includes(chainId)) return { chainId, error: true, msg: "Incorrect Chain" }
    provider.on("network", async (newNetwork, oldNetwork) => {
        if (oldNetwork) {
            if (!["1", "3"].includes(newNetwork.chainId.toString())) {
                console.log("succesfully changed to valid network")
            }
        }
    })
    return { chainId, error: false }
}

module.exports = {
    sendRequestMethodToEtherObject,
    getTokenInfo1155,
    getTokenInfo721,
    getNetworkInfo,
}
    