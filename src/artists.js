const artistInfo = {
    ant: [
        { name: "Jaye", artSrc: "/img/nfts/diamond/jaye.jpg" },
        { name: "NFT Sammy", artSrc: "/img/nfts/diamond/nftsammy.jpg" },
        { name: "Callum", artSrc: "/img/nfts/diamond/callum.jpg" },
        { name: "Angga", artSrc: "/img/nfts/diamond/angga.jpg" }
    ],
    octopus: [
        { name: "Iqbal", artSrc: "/img/nfts/diamond/iqbal.jpg" },
        { name: "Joel", artSrc: "/img/nfts/diamond/joel.jpg" },
        { name: "Martin", artSrc: "/img/nfts/diamond/mart.jpg" },
        { name: "Nahuel", artSrc: "/img/nfts/diamond/nahuel.jpg" }
    ],
    bee: [
        { name: "Alana", artSrc: "/img/nfts/diamond/alana.jpg" },
        { name: "Calicho Art", artSrc: "/img/nfts/diamond/calichoArt.jpg" },
        { name: "Neda", artSrc: "/img/nfts/diamond/neda.jpg" },
        { name: "QStorm", artSrc: "/img/nfts/diamond/qstom.jpg" }
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
        },
        nextAll() {
            this.indices[0] = (this.indices[0] + 1) % 4
            this.indices[1] = (this.indices[1] + 1) % 4
            this.indices[2] = (this.indices[2] + 1) % 4
        }
    }
}
exports.test = () => {
    console.log('test')
}