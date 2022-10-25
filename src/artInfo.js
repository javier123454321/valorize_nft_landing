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
const artists = [
    "calichoart",
    "alana",
    "nftsammy",
    "mart",
    "nahuel",
    "callum",
    "joel",
    "qstom",
    "neda",
    "angga",
    "jaye",
    "iqbal",
]
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
    const dirname = './dist/metadata/membership/' + rarity + '/'
    
    const dir = fs.readdir(dirname, function(err, filenames) {
        console.log(filenames)
        if (err) {
            console.error(err)
          return;
        }
        filenames.forEach(function(filename, i) {
            fileNameNoSuffix = filename.split(".")[0]
            let newName = [animals[i % 12], fileNameNoSuffix.split('_')[2]].join('_').toLowerCase()
            // console.log("would name: \n", dirname + filename, "\n", dirname + newName + "\n")
            console.log("would name: \n", fileNameNoSuffix, "\n", newName + "\n")
            fs.rename(dirname + filename, dirname + newName + ".png", function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });
        })
    })
})
