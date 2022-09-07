"use strict";

document.addEventListener('alpine:init', () => {
    Alpine.data('mintModal', () => ({
        nfts: [
            {
                title: 'Mycelia',
                imageSrc: '/dist/img/product-mycelia.png',
                amountToMint: 1,
                price: 0.5,
                available: true,
                description: "Get 5 hours of consultation time with our team of tokenomics experts and we will help you define a token's parameters, needs, KPIs, as well as next steps."
            },
            {
                title: 'Silver',
                imageSrc: '/dist/img/product-silver.png',
                amountToMint: 1,
                price: 0.1,
                available: true,
                description: "Token launch in our platform, today (normal price of 0.3 ETH) and 1 year access to our platform."
            },
            {
                title: 'Diamond',
                imageSrc: '/dist/img/product-diamond.png',
                amountToMint: 0,
                price: 0.3,
                available: false,
                description: "Conversation with tokenomics expert to define token, access to dashboard for a 2 year minimum and priority customer support."
            },

        ],
        index: 0,
        showDescription: false,
        next() {
            this.index = ++this.index % this.nfts.length;
        },
        previous() {
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
            return (this.nfts[this.index].price * this.nfts[this.index].amountToMint).toPrecision(2)
        }
    }))
})