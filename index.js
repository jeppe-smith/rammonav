(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.rammonav = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (f) {
    return setTimeout(f, 1000 / 60);
  };

  window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || function (requestID) {
    clearTimeout(requestID);
  };

  function Rammonav(container, target) {
    var breakpoint = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var nav = container.children[0];
    var items = nav.children ? Array.from(nav.children) : [];

    target.classList.add('rammo-empty');

    items.forEach(function (item, index) {
      item.setAttribute('rammo-width', item.clientWidth);
      item.setAttribute('rammo-index', index);
    });

    var clonedNav = nav.cloneNode(true);
    var clonedItems = clonedNav.children ? Array.from(clonedNav.children) : [];

    clonedNav.classList.add('rammo-clone');
    clonedItems.forEach(function (clonedItem) {
      return clonedItem.classList.add('rammo-clone', 'rammo-hidden');
    });

    target.appendChild(clonedNav);

    function removeItems() {
      var itemsToRemove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var visibleItemsNotInItemsToRemove = items.filter(function (item) {
        return !item.classList.contains('rammo-hidden') && itemsToRemove.indexOf(item) < 0;
      });
      var removeableItems = visibleItemsNotInItemsToRemove.filter(function (item) {
        return item != null && item !== target;
      });

      if (!removeableItems.length) {
        return doRemoveItems(itemsToRemove);
      } else {
        itemsToRemove.push(removeableItems[removeableItems.length - 1]);

        var itemsWidthTotal = itemsToRemove.reduce(function (a, b) {
          return a + parseInt(b.getAttribute('rammo-width'));
        }, 0);

        if (nav.clientWidth - itemsWidthTotal > container.clientWidth) {
          return removeItems(itemsToRemove);
        } else {
          return doRemoveItems(itemsToRemove);
        }
      }
    }

    function addItems() {
      var itemsToAdd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      itemsToAdd = itemsToAdd.filter(function (item) {
        return item != null;
      });

      var hiddenItemsNotInItemsToAdd = items.filter(function (item) {
        return item !== target && item.classList.contains('rammo-hidden') && itemsToAdd.indexOf(item) < 0;
      });

      if (!hiddenItemsNotInItemsToAdd.length) {
        return doAddItems(itemsToAdd);
      } else {
        var nextItem = hiddenItemsNotInItemsToAdd[0];
        var itemsWidthTotal = itemsToAdd.reduce(function (a, b) {
          return a + parseInt(b.getAttribute('rammo-width'));
        }, 0) + parseInt(nextItem.getAttribute('rammo-width'));

        if (nav.clientWidth + itemsWidthTotal <= container.clientWidth) {
          itemsToAdd.push(nextItem);

          return addItems(itemsToAdd);
        } else {
          return doAddItems(itemsToAdd);
        }
      }
    }

    function doRemoveItems(itemsToRemove) {
      if (itemsToRemove.length) {
        requestAnimationFrame(function () {
          itemsToRemove.forEach(function (item) {
            var clonedItem = clonedItems.filter(function (clonedItem) {
              return clonedItem.getAttribute('rammo-index') === item.getAttribute('rammo-index');
            })[0];

            clonedItem.classList.remove('rammo-hidden');
            item.classList.add('rammo-hidden');
          });

          return toggleTargetEmptyClass();
        });
      }
    }

    function doAddItems(itemsToAdd) {
      if (itemsToAdd.length) {
        requestAnimationFrame(function () {
          itemsToAdd.forEach(function (item) {
            var clonedItem = clonedItems.filter(function (clonedItem) {
              return clonedItem.getAttribute('rammo-index') === item.getAttribute('rammo-index');
            })[0];

            clonedItem.classList.add('rammo-hidden');
            item.classList.remove('rammo-hidden');
          });

          return toggleTargetEmptyClass();
        });
      }
    }

    function toggleTargetEmptyClass() {
      requestAnimationFrame(function () {
        if (clonedItems.filter(function (clonedItem) {
          return !clonedItem.classList.contains('rammo-hidden');
        }).length) {
          target.classList.remove('rammo-empty');
        } else {
          target.classList.add('rammo-empty');
        }

        target.setAttribute('rammo-width', target.clientWidth);

        rammonav.movedItems = items.filter(function (item) {
          return item.classList.contains('rammo-hidden');
        });

        if (typeof rammonav.onmove === 'function') {
          rammonav.onmove(rammonav);
        }

        return check();
      });
    }

    function check() {
      if (window.outerWidth > breakpoint) {
        if (nav.clientWidth > container.clientWidth) {
          return removeItems();
        } else {
          return addItems();
        }
      }
    }

    var rammonav = {
      check: check,
      container: container,
      nav: nav,
      target: target,
      movedItems: [],
      onmove: null
    };

    window.addEventListener('resize', rammonav.check.bind(rammonav));

    rammonav.check();

    return rammonav;
  }

  exports.default = Rammonav;
});
