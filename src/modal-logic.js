
document.addEventListener('alpine:init', () => {
    Alpine.data('mintModal', () => ({
        nfts: [
            {
                title: 'Mycelia',
                imageSrc: '/dist/img/product-mycelia.png',
                amountToMint: 0,
                price: 0.5,
                available: true
            },
            {
                title: 'Silver',
                imageSrc: '/dist/img/product-silver.png',
                amountToMint: 0,
                price: 0.3,
                available: true
            },
            {
                title: 'Gold',
                imageSrc: '/dist/img/product-gold.png',
                amountToMint: 0,
                price: 0.3,
                available: false
            },

        ],
        index: 0,
        next() {
            this.index++;
        },
        previous() {
            this.index--;
        },
        nft() {
            console.log(this.index)
            return this.nfts[this.index]
        }
    }))
})