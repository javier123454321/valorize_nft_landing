function triggerMintModal() {
    document.querySelectorAll("[data-toggleModal]").forEach(el => {
        const modal = document.querySelector("#minting-modal")
        const body = document.body;
        el.addEventListener('click', (e) => {
            if (modal.classList.contains("hidden")) {
                const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
                body.style.height = '100vh';
                body.style.overflowY = 'hidden';
            } else {
                body.style.height = '';
                body.style.overflowY = 'scroll';
            }
            modal.classList.toggle("hidden")
        })
    })
}
function setScrollToTop() {
    document.querySelectorAll("[data-scrollToTop]").forEach(el => {
        el.addEventListener('click', () => {
            setTimeout(() => window.scrollTo(0, 0))
        })
    })
}
function setupAnimationsOnScroll() {
    const initialClasses = {}
    const intersected = document.querySelectorAll("*[intersect-class]")
    intersected.forEach((intersection, index) => {
        intersection.setAttribute("data-index", index)
        !intersection.classList.contains("intersection-animated") && intersection.classList.add("intersection-animated")
        initialClasses[index] = intersection.className
    })

    const observer = new IntersectionObserver((intersected) => {
        intersected.forEach((entry) => {
            const elementIndex = entry.target.dataset.index
            if (entry.isIntersecting) {
                entry.target.className = `${initialClasses[elementIndex]} ${entry.target.attributes["intersect-class"].value}`
            }
            else entry.target.className = initialClasses[elementIndex]
        })
    })
    intersected.forEach(intersection => {
        observer.observe(intersection)
    })
}

setupAnimationsOnScroll()
setScrollToTop()
triggerMintModal()