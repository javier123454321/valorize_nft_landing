exports.artistInfo = [
    {
        name: "",
        social: "",
    }
]

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
const artists = {
    "calichoart": "bee",
    "alana": "bee",
    "nftsammy": "ant",
    "mart": "octopus",
    "nahuel": "octopus",
    "callum": "ant",
    "joel": "octopus",
    "qstom": "bee",
    "neda": "bee",
    "angga": "ant",
    "jaye": "ant",
    "iqbal": "octopus",
}
const animals = [
  'Bee',
  'Bee',
  'Ant',
  'Octopus',
  'Octopus',
  'Ant',
  'Octopus',
  'Bee',
  'Bee',
  'Ant',
  'Ant',
  'Octopus'
]
const fs = require('fs')
const rarities = ["silver", "gold", "diamond", "obsidian", "mycelia"]

rarities.forEach((rarity) => {
    const dirname = './metadata/membership/' + rarity + '/'
    
    const dir = fs.readdir(dirname, function(err, filenames) {
        console.log(filenames)
        if (err) {
            console.error(err)
          return;
        }
        filenames.forEach(function(filename, i) {
            let fileNameNoSuffix = filename.split(".")[0]
            let artist = fileNameNoSuffix.split("_")[1]
            let newName = artists[artist] + "_" + artist
            // console.log("would name: \n", dirname + filename, "\n", dirname + newName + "\n")
            console.log("would name: \n", fileNameNoSuffix, "\n", newName + "\n")
            fs.rename(dirname + filename, dirname + newName + ".png", function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });
        })
    })
})
