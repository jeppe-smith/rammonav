window.requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function(f){return setTimeout(f, 1000/60)}

window.cancelAnimationFrame = window.cancelAnimationFrame
  || window.mozCancelAnimationFrame
  || function(requestID){clearTimeout(requestID)}

function Rammonav(container, target, breakpoint = 0) {
  const nav = container.children[0]
  const items = nav.children ? Array.from(nav.children) : []
  
  target.classList.add('rammo-empty')
  
  items.forEach((item, index) => {    
    item.setAttribute('rammo-width', item.clientWidth)
    item.setAttribute('rammo-index', index)
  })
  
  const clonedNav = nav.cloneNode(true)
  const clonedItems = clonedNav.children ? Array.from(clonedNav.children) : []
  
  clonedNav.classList.add('rammo-clone')
  clonedItems.forEach(clonedItem => clonedItem.classList.add('rammo-clone', 'rammo-hidden'))
  
  target.appendChild(clonedNav)
  
  function removeItems(itemsToRemove = []) {
    const visibleItemsNotInItemsToRemove = items.filter(item => !item.classList.contains('rammo-hidden') && itemsToRemove.indexOf(item) < 0)
    const removeableItems = visibleItemsNotInItemsToRemove.filter(item => item != null && item !== target)

    if (!removeableItems.length) {
      return doRemoveItems(itemsToRemove)
    } else {        
      itemsToRemove.push(removeableItems[ removeableItems.length - 1 ])

      const itemsWidthTotal = itemsToRemove.reduce((a, b) => a + parseInt(b.getAttribute('rammo-width')), 0)

      if (nav.clientWidth - itemsWidthTotal > container.clientWidth) {
        return removeItems(itemsToRemove)
      } else {
        return doRemoveItems(itemsToRemove)
      }
    }
  }

  function addItems(itemsToAdd = []) {
    itemsToAdd = itemsToAdd.filter(item => item != null)
    
    const hiddenItemsNotInItemsToAdd = items.filter(item => item !== target && item.classList.contains('rammo-hidden') && itemsToAdd.indexOf(item) < 0)

    if (!hiddenItemsNotInItemsToAdd.length) {
      return doAddItems(itemsToAdd)
    } else {
      const nextItem = hiddenItemsNotInItemsToAdd[0]
      const itemsWidthTotal = itemsToAdd.reduce((a, b) => a + parseInt(b.getAttribute('rammo-width')), 0) + parseInt(nextItem.getAttribute('rammo-width'))

      if (nav.clientWidth + itemsWidthTotal <= container.clientWidth) {
        itemsToAdd.push(nextItem)

        return addItems(itemsToAdd)
      } else {
        return doAddItems(itemsToAdd)
      }
    }
  }

  function doRemoveItems(itemsToRemove) {
    if (itemsToRemove.length) {
      requestAnimationFrame(() => {
        itemsToRemove.forEach(item => {
          const clonedItem = clonedItems.filter(clonedItem => clonedItem.getAttribute('rammo-index') === item.getAttribute('rammo-index'))[0]

          clonedItem.classList.remove('rammo-hidden')
          item.classList.add('rammo-hidden')
        })

        return toggleTargetEmptyClass()
      })
    }
  }

  function doAddItems(itemsToAdd) {
    if (itemsToAdd.length) {
      requestAnimationFrame(() => {
        itemsToAdd.forEach(item => {
          const clonedItem = clonedItems.filter(clonedItem => clonedItem.getAttribute('rammo-index') === item.getAttribute('rammo-index'))[0]

          clonedItem.classList.add('rammo-hidden')
          item.classList.remove('rammo-hidden')
        })

        return toggleTargetEmptyClass()
      })
    }
  }

  function toggleTargetEmptyClass() {
    requestAnimationFrame(() => {
      if (clonedItems.filter(clonedItem => !clonedItem.classList.contains('rammo-hidden')).length) {
        target.classList.remove('rammo-empty')
      } else {
        target.classList.add('rammo-empty')
      }

      target.setAttribute('rammo-width', target.clientWidth)
      
      rammonav.movedItems = items.filter(item => item.classList.contains('rammo-hidden'))
      
      if (typeof rammonav.onmove === 'function') {
        rammonav.onmove(rammonav)
      }
      
      return check()
    })
  }
  
  function check() {
    if (window.outerWidth > breakpoint) {
      if (nav.clientWidth > container.clientWidth) {
        return removeItems()
      } else {
        return addItems()
      }
    }
  }
  
  const rammonav = {
    check: check,
    container: container,
    nav: nav,
    target: target,
    movedItems: [],
    onmove: null
  }
  
  window.addEventListener('resize', rammonav.check.bind(rammonav))
  
  rammonav.check()
  
  return rammonav
}

export default Rammonav