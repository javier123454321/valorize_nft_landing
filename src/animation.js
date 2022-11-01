function triggerMintModal() {
    let modalShouldBeOpen;
    for(const [key, value] of new URL(window.location.href).searchParams.entries()){
        if(key === "mint") {
            modalShouldBeOpen = value
        }
    }
    document.querySelectorAll("[data-toggleModal]").forEach(el => {
        const id = el.dataset.togglemodal
        el.addEventListener('click', triggerModal(id))
    })
    modalShouldBeOpen && triggerModal(modalShouldBeOpen)()
}
function triggerModal(id) {
    const body = document.body;
    const modal = document.querySelector("#minting-modal-" + id)
    return function(e) {
        if (modal.classList.contains("hidden")) {
            const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
            body.style.height = '100vh';
            body.style.overflowY = 'hidden';
        } else {
            body.style.height = '';
            body.style.overflowY = 'scroll';
        }
        modal.classList.toggle("hidden")
    }
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