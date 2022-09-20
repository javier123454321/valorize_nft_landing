
const fs = require('fs');

const BASE_URI = "";
for (let i = 1; i <= 2010; i++) {
    let rarity, title, animation_url 
    if (i <= 10) {
        rarity = {
            type: "string",
            value: "Mycelia",
            description: "Valorize Mycelia NFTs are a collection of 12 1 of 1 NFTs by artist Valerii Spornikov which grant you the benefits described in the benefits property",
            benefits: [
                "5 Hours of consultation time with one of our tokenomics experts where we define project parameters, deliverables, KPIs and next steps",
                "Access to Valorize Admin Dashboard for a 3 year minimum",
                "Premium Customer Support for the first 3 months guaranteed",
                "Draft of tokenomic distribution portion of technical communication (whitepaper, blog post, etc...)",
                "Token launch on the Valorize platform if applicable"
            ]
        }
        title = `ValorizeDAO Mycelia Product NFT`
        animation_url = "https://nft.valorize.app/metadata/video/mycelia/"
    } else if (i <= 1010) {
        rarity = {
            type: "string",
            value: "Diamond",
            description: "Valorize Diamond NFTs are a collection of 1000 NFTs by artist Valerii Spornikov which grant you the benefits described in the benefits property",
            benefits: [
                "Token launch on the Valorize platform",
                "Access to Valorize Admin Dashboard for a 2 year minimum",
                "Conversation with tokenomics expert to define token within the parameters of the Valorize platform",
                "Priority Customer Support",
            ]
        }
        title = `ValorizeDAO Diamond Product NFT`
        animation_url = "https://nft.valorize.app/metadata/video/diamond/"
    } else {
        rarity = {
            type: "string",
            value: "Silver",
            description: "Valorize Silver NFTs are a collection of 1000 NFTs by artist Valerii Spornikov which grant you the benefits described in the benefits property",
            benefits: [
                "Token launch on the Valorize platform",
                "Access to Valorize Admin Dashboard for a 1 year minimum",
            ]
        }
        title = `ValorizeDAO Silver Product NFT`
        animation_url = "https://nft.valorize.app/metadata/video/silver/"
    }
    for (let k = 0; k < 3; k++) {
        const status = ["not-ready", "ready", "redeemed"][k]
        const product_status = {
            value: ["Not Ready", "Ready", "Redeemed"][k],
            description: [
                "The token cannot be redeemed until the product status is ready",
                "Token is ready, proceed to Valorize to redeem it for its benefits",
                "Token is now redeemed, welcome to the future"
            ][k]
        }
        let data = {
            title,
            animation_url: animation_url + status + '.mp4',
            properties: {
                token_id: i,
                rarity,
                product_status,
            }
        }
        const output = JSON.stringify(data);

        const outputDir = "./metadata/" + JSON.stringify(i)
        if (!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir, { recursive: true });
        }
        fs.writeFile(outputDir + "/" + status + ".json", output, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    }
}