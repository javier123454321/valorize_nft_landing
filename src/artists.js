const artistInfo = {
    ant: [
        { name: "Jaye", artSrc: "/img/nfts/ValorizeNFT_01_Silver_Jaye_WEB.jpg" },
        { name: "NFT Sammy", artSrc: "/img/nfts/ValorizeNFT_01_Silver_NFTSammy_WEB.jpg" },
        { name: "Callum", artSrc: "/img/nfts/ValorizeNFT_01_Silver_Callum_WEB.jpg" },
        { name: "Angga", artSrc: "/img/nfts/ValorizeNFT_01_Silver_Angga_WEB.jpg" }
    ],
    octopus: [
        { name: "Iqbal", artSrc: "/img/nfts/ValorizeNFT_01_Silver_Iqbal_WEB.jpg" },
        { name: "Joel", artSrc: "/img/nfts/ValorizeNFT_01_Silver_Joel_WEB.jpg" },
        { name: "Martin", artSrc: "/img/nfts/ValorizeNFT_01_Silver_Mart_WEB.png" },
        { name: "Nahuel", artSrc: "/img/nfts/ValorizeNFT_01_Silver_Nahuel_WEB.jpg" }
    ],
    bee: [
        { name: "Alana", artSrc: "/img/nfts/ValorizeNFT_01_Silver_Alana_WEB.jpg" },
        { name: "Calicho Art", artSrc: "/img/nfts/ValorizeNFT_01_Silver_CalichoArt_WEB.jpg" },
        { name: "Neda", artSrc: "/img/nfts/ValorizeNFT_01_Silver_Neda_WEB.jpg" },
        { name: "QStorm", artSrc: "/img/nfts/ValorizeNFT_01_Silver_Qstom_WEB.jpg" }
    ]
}
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
const shuffledData = {
    octopuses: shuffle(artistInfo.octopus),
    ants: shuffle(artistInfo.ant),
    bees: shuffle(artistInfo.bee),
}

exports.artistsData = () => {
    return {
        ...shuffledData,
        octopus: function() {return this.octopuses[this.indices[0]]},
        bee: function() {return this.bees[this.indices[1]]},
        ant: function() {return this.ants[this.indices[2]]},
        indices: [0, 0, 0],
        next(index) {
            return () => { this.indices[index] = (this.indices[index] + 1) % 4 }
        }
    }
}
exports.test = () => {
    console.log('test')
}