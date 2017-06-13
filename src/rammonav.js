window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){return setTimeout(f, 1000/60)}
 
window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function(requestID){clearTimeout(requestID)}

const rammonav = {
  
  cache(container, sub) {
    this.container = container
    this.nav = this.container.children[0]
    this.links = Array.from(this.nav.children)
    
    this.links.forEach((link, index) => link.setAttribute('rammo-id', index))
    
    this.sub = sub
    this.subNav = this.nav.cloneNode(true)
    this.subLinks = Array.from(this.subNav.children)
    
    this.links.forEach((link, index) => link.setAttribute('rammo-width', link.clientWidth))
    
    requestAnimationFrame(() => {
      this.subLinks.forEach((link) => {
        link.classList.add('rammo-sublink')
        link.style.display = 'none'
      })
      
      this.sub.appendChild(this.subNav)
    })
  },
  
  bind() {
    window.addEventListener('resize', this.handleResize.bind(this))
  },
  
  handleResize() {
    const maxWidth = this.container.clientWidth
    let width = this.nav.clientWidth
    
    if (width > maxWidth) {
      requestAnimationFrame(this.removeLastLinkFromNav.bind(this))
    } else {
      requestAnimationFrame(this.addNextLinkToNav.bind(this))
    }
  },
  
  isHidden(element) {
    return getComputedStyle(element).display === 'none'
  },
  
  hideElement(element) {
    return element.style.display = 'none'
  },
  
  showElement(element) {
    return element.style.display = ''
  },
  
  removeLastLinkFromNav() {
    const maxWidth = this.container.clientWidth
    let width = this.nav.clientWidth
    let lastIndex = this.links.length - 1
    let lastLink = this.links[lastIndex]
    let lastLinkId = lastLink.getAttribute('rammo-id')
    let isHidden = this.isHidden(lastLink)
    
    while (isHidden) {
      lastIndex = lastIndex - 1
      lastLink = this.links[lastIndex]
      lastLinkId = lastLink.getAttribute('rammo-id')
      isHidden = this.isHidden(lastLink)
      
      if (lastIndex === 0) { break }
    }
    
    this.hideElement(lastLink)
    
    this.subLinks.forEach((link) => {
      const linkId = link.getAttribute('rammo-id')
      
      if (linkId === lastLinkId) {
        this.showElement(link)
      }
    })
    
    width = this.nav.clientWidth
    
    if (width > maxWidth) {
      return requestAnimationFrame(this.removeLastLinkFromNav.bind(this))
    } else {
      return true
    }
  },
  
  addNextLinkToNav() {
    const maxWidth = this.container.clientWidth
    const lastLink = this.links[this.links.length - 1]
    const lastLinkIsVisible = !this.isHidden(lastLink)
    let width = this.nav.clientWidth
    let nextIndex = 0
    let nextLink = this.links[nextIndex]
    let nextLinkId = nextLink.getAttribute('rammo-id')
    let nextLinkWidth = parseInt( nextLink.getAttribute('rammo-width') )
    let isVisible = !this.isHidden(nextLink)
    
    if (lastLinkIsVisible) {
      return true
    }
    
    while (isVisible) {
      nextIndex = nextIndex + 1
      nextLink = this.links[nextIndex]
      nextLinkId = nextLink.getAttribute('rammo-id')
      nextLinkWidth = parseInt( nextLink.getAttribute('rammo-width') )
      isVisible = !this.isHidden(nextLink)
      
      if (nextIndex >= this.links.length - 1) { break }
    }
    
    if (width + nextLinkWidth > maxWidth) {
      return true
    }
    
    this.showElement(nextLink)
    
    this.subLinks.forEach((link) => {
      const linkId = link.getAttribute('rammo-id')
      
      if (linkId === nextLinkId) {
        this.hideElement(link)
      }
    })
    
    width = this.nav.clientWidth
    
    if (width < maxWidth) {
      return requestAnimationFrame(this.addNextLinkToNav.bind(this))
    } else {
      return true
    }
  },
  
  init(container, sub) {
    this.cache(container, sub)
    this.bind()
    this.handleResize()
  }
  
}

export default rammonav.init