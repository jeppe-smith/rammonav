(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['../src/rammonav'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('../src/rammonav'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.rammonav);
    global.scripts = mod.exports;
  }
})(this, function (_rammonav) {
  'use strict';

  var _rammonav2 = _interopRequireDefault(_rammonav);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var rammonav = (0, _rammonav2.default)(document.querySelector('.rammonav'), document.querySelector('.subnav'));
});

},{"../src/rammonav":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXHJhbW1vbmF2LmpzIiwidGVzdFxcc2NyaXB0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLFNBQU8scUJBQVAsR0FBK0IsT0FBTyxxQkFBUCxJQUMxQixPQUFPLHdCQURtQixJQUUxQixPQUFPLDJCQUZtQixJQUcxQixPQUFPLHVCQUhtQixJQUkxQixVQUFTLENBQVQsRUFBVztBQUFDLFdBQU8sV0FBVyxDQUFYLEVBQWMsT0FBSyxFQUFuQixDQUFQO0FBQThCLEdBSi9DOztBQU1BLFNBQU8sb0JBQVAsR0FBOEIsT0FBTyxvQkFBUCxJQUN6QixPQUFPLHVCQURrQixJQUV6QixVQUFTLFNBQVQsRUFBbUI7QUFBQyxpQkFBYSxTQUFiO0FBQXdCLEdBRmpEOztBQUlBLFdBQVMsUUFBVCxDQUFrQixTQUFsQixFQUE2QixNQUE3QixFQUFxRDtBQUFBLFFBQWhCLFVBQWdCLHVFQUFILENBQUc7O0FBQ25ELFFBQU0sTUFBTSxVQUFVLFFBQVYsQ0FBbUIsQ0FBbkIsQ0FBWjtBQUNBLFFBQU0sUUFBUSxJQUFJLFFBQUosR0FBZSxNQUFNLElBQU4sQ0FBVyxJQUFJLFFBQWYsQ0FBZixHQUEwQyxFQUF4RDs7QUFFQSxXQUFPLFNBQVAsQ0FBaUIsR0FBakIsQ0FBcUIsYUFBckI7O0FBRUEsVUFBTSxPQUFOLENBQWMsVUFBQyxJQUFELEVBQU8sS0FBUCxFQUFpQjtBQUM3QixXQUFLLFlBQUwsQ0FBa0IsYUFBbEIsRUFBaUMsS0FBSyxXQUF0QztBQUNBLFdBQUssWUFBTCxDQUFrQixhQUFsQixFQUFpQyxLQUFqQztBQUNELEtBSEQ7O0FBS0EsUUFBTSxZQUFZLElBQUksU0FBSixDQUFjLElBQWQsQ0FBbEI7QUFDQSxRQUFNLGNBQWMsVUFBVSxRQUFWLEdBQXFCLE1BQU0sSUFBTixDQUFXLFVBQVUsUUFBckIsQ0FBckIsR0FBc0QsRUFBMUU7O0FBRUEsY0FBVSxTQUFWLENBQW9CLEdBQXBCLENBQXdCLGFBQXhCO0FBQ0EsZ0JBQVksT0FBWixDQUFvQjtBQUFBLGFBQWMsV0FBVyxTQUFYLENBQXFCLEdBQXJCLENBQXlCLGFBQXpCLEVBQXdDLGNBQXhDLENBQWQ7QUFBQSxLQUFwQjs7QUFFQSxXQUFPLFdBQVAsQ0FBbUIsU0FBbkI7O0FBRUEsYUFBUyxXQUFULEdBQXlDO0FBQUEsVUFBcEIsYUFBb0IsdUVBQUosRUFBSTs7QUFDdkMsVUFBTSxpQ0FBaUMsTUFBTSxNQUFOLENBQWE7QUFBQSxlQUFRLENBQUMsS0FBSyxTQUFMLENBQWUsUUFBZixDQUF3QixjQUF4QixDQUFELElBQTRDLGNBQWMsT0FBZCxDQUFzQixJQUF0QixJQUE4QixDQUFsRjtBQUFBLE9BQWIsQ0FBdkM7QUFDQSxVQUFNLGtCQUFrQiwrQkFBK0IsTUFBL0IsQ0FBc0M7QUFBQSxlQUFRLFFBQVEsSUFBUixJQUFnQixTQUFTLE1BQWpDO0FBQUEsT0FBdEMsQ0FBeEI7O0FBRUEsVUFBSSxDQUFDLGdCQUFnQixNQUFyQixFQUE2QjtBQUMzQixlQUFPLGNBQWMsYUFBZCxDQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsc0JBQWMsSUFBZCxDQUFtQixnQkFBaUIsZ0JBQWdCLE1BQWhCLEdBQXlCLENBQTFDLENBQW5COztBQUVBLFlBQU0sa0JBQWtCLGNBQWMsTUFBZCxDQUFxQixVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsaUJBQVUsSUFBSSxTQUFTLEVBQUUsWUFBRixDQUFlLGFBQWYsQ0FBVCxDQUFkO0FBQUEsU0FBckIsRUFBNEUsQ0FBNUUsQ0FBeEI7O0FBRUEsWUFBSSxJQUFJLFdBQUosR0FBa0IsZUFBbEIsR0FBb0MsVUFBVSxXQUFsRCxFQUErRDtBQUM3RCxpQkFBTyxZQUFZLGFBQVosQ0FBUDtBQUNELFNBRkQsTUFFTztBQUNMLGlCQUFPLGNBQWMsYUFBZCxDQUFQO0FBQ0Q7QUFDRjtBQUNGOztBQUVELGFBQVMsUUFBVCxHQUFtQztBQUFBLFVBQWpCLFVBQWlCLHVFQUFKLEVBQUk7O0FBQ2pDLG1CQUFhLFdBQVcsTUFBWCxDQUFrQjtBQUFBLGVBQVEsUUFBUSxJQUFoQjtBQUFBLE9BQWxCLENBQWI7O0FBRUEsVUFBTSw2QkFBNkIsTUFBTSxNQUFOLENBQWE7QUFBQSxlQUFRLFNBQVMsTUFBVCxJQUFtQixLQUFLLFNBQUwsQ0FBZSxRQUFmLENBQXdCLGNBQXhCLENBQW5CLElBQThELFdBQVcsT0FBWCxDQUFtQixJQUFuQixJQUEyQixDQUFqRztBQUFBLE9BQWIsQ0FBbkM7O0FBRUEsVUFBSSxDQUFDLDJCQUEyQixNQUFoQyxFQUF3QztBQUN0QyxlQUFPLFdBQVcsVUFBWCxDQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsWUFBTSxXQUFXLDJCQUEyQixDQUEzQixDQUFqQjtBQUNBLFlBQU0sa0JBQWtCLFdBQVcsTUFBWCxDQUFrQixVQUFDLENBQUQsRUFBSSxDQUFKO0FBQUEsaUJBQVUsSUFBSSxTQUFTLEVBQUUsWUFBRixDQUFlLGFBQWYsQ0FBVCxDQUFkO0FBQUEsU0FBbEIsRUFBeUUsQ0FBekUsSUFBOEUsU0FBUyxTQUFTLFlBQVQsQ0FBc0IsYUFBdEIsQ0FBVCxDQUF0Rzs7QUFFQSxZQUFJLElBQUksV0FBSixHQUFrQixlQUFsQixJQUFxQyxVQUFVLFdBQW5ELEVBQWdFO0FBQzlELHFCQUFXLElBQVgsQ0FBZ0IsUUFBaEI7O0FBRUEsaUJBQU8sU0FBUyxVQUFULENBQVA7QUFDRCxTQUpELE1BSU87QUFDTCxpQkFBTyxXQUFXLFVBQVgsQ0FBUDtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxhQUFTLGFBQVQsQ0FBdUIsYUFBdkIsRUFBc0M7QUFDcEMsVUFBSSxjQUFjLE1BQWxCLEVBQTBCO0FBQ3hCLDhCQUFzQixZQUFNO0FBQzFCLHdCQUFjLE9BQWQsQ0FBc0IsZ0JBQVE7QUFDNUIsZ0JBQU0sYUFBYSxZQUFZLE1BQVosQ0FBbUI7QUFBQSxxQkFBYyxXQUFXLFlBQVgsQ0FBd0IsYUFBeEIsTUFBMkMsS0FBSyxZQUFMLENBQWtCLGFBQWxCLENBQXpEO0FBQUEsYUFBbkIsRUFBOEcsQ0FBOUcsQ0FBbkI7O0FBRUEsdUJBQVcsU0FBWCxDQUFxQixNQUFyQixDQUE0QixjQUE1QjtBQUNBLGlCQUFLLFNBQUwsQ0FBZSxHQUFmLENBQW1CLGNBQW5CO0FBQ0QsV0FMRDs7QUFPQSxpQkFBTyx3QkFBUDtBQUNELFNBVEQ7QUFVRDtBQUNGOztBQUVELGFBQVMsVUFBVCxDQUFvQixVQUFwQixFQUFnQztBQUM5QixVQUFJLFdBQVcsTUFBZixFQUF1QjtBQUNyQiw4QkFBc0IsWUFBTTtBQUMxQixxQkFBVyxPQUFYLENBQW1CLGdCQUFRO0FBQ3pCLGdCQUFNLGFBQWEsWUFBWSxNQUFaLENBQW1CO0FBQUEscUJBQWMsV0FBVyxZQUFYLENBQXdCLGFBQXhCLE1BQTJDLEtBQUssWUFBTCxDQUFrQixhQUFsQixDQUF6RDtBQUFBLGFBQW5CLEVBQThHLENBQTlHLENBQW5COztBQUVBLHVCQUFXLFNBQVgsQ0FBcUIsR0FBckIsQ0FBeUIsY0FBekI7QUFDQSxpQkFBSyxTQUFMLENBQWUsTUFBZixDQUFzQixjQUF0QjtBQUNELFdBTEQ7O0FBT0EsaUJBQU8sd0JBQVA7QUFDRCxTQVREO0FBVUQ7QUFDRjs7QUFFRCxhQUFTLHNCQUFULEdBQWtDO0FBQ2hDLDRCQUFzQixZQUFNO0FBQzFCLFlBQUksWUFBWSxNQUFaLENBQW1CO0FBQUEsaUJBQWMsQ0FBQyxXQUFXLFNBQVgsQ0FBcUIsUUFBckIsQ0FBOEIsY0FBOUIsQ0FBZjtBQUFBLFNBQW5CLEVBQWlGLE1BQXJGLEVBQTZGO0FBQzNGLGlCQUFPLFNBQVAsQ0FBaUIsTUFBakIsQ0FBd0IsYUFBeEI7QUFDRCxTQUZELE1BRU87QUFDTCxpQkFBTyxTQUFQLENBQWlCLEdBQWpCLENBQXFCLGFBQXJCO0FBQ0Q7O0FBRUQsZUFBTyxZQUFQLENBQW9CLGFBQXBCLEVBQW1DLE9BQU8sV0FBMUM7O0FBRUEsaUJBQVMsVUFBVCxHQUFzQixNQUFNLE1BQU4sQ0FBYTtBQUFBLGlCQUFRLEtBQUssU0FBTCxDQUFlLFFBQWYsQ0FBd0IsY0FBeEIsQ0FBUjtBQUFBLFNBQWIsQ0FBdEI7O0FBRUEsWUFBSSxPQUFPLFNBQVMsTUFBaEIsS0FBMkIsVUFBL0IsRUFBMkM7QUFDekMsbUJBQVMsTUFBVCxDQUFnQixRQUFoQjtBQUNEOztBQUVELGVBQU8sT0FBUDtBQUNELE9BaEJEO0FBaUJEOztBQUVELGFBQVMsS0FBVCxHQUFpQjtBQUNmLFVBQUksT0FBTyxVQUFQLEdBQW9CLFVBQXhCLEVBQW9DO0FBQ2xDLFlBQUksSUFBSSxXQUFKLEdBQWtCLFVBQVUsV0FBaEMsRUFBNkM7QUFDM0MsaUJBQU8sYUFBUDtBQUNELFNBRkQsTUFFTztBQUNMLGlCQUFPLFVBQVA7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsUUFBTSxXQUFXO0FBQ2YsYUFBTyxLQURRO0FBRWYsaUJBQVcsU0FGSTtBQUdmLFdBQUssR0FIVTtBQUlmLGNBQVEsTUFKTztBQUtmLGtCQUFZLEVBTEc7QUFNZixjQUFRO0FBTk8sS0FBakI7O0FBU0EsV0FBTyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxTQUFTLEtBQVQsQ0FBZSxJQUFmLENBQW9CLFFBQXBCLENBQWxDOztBQUVBLGFBQVMsS0FBVDs7QUFFQSxXQUFPLFFBQVA7QUFDRDs7b0JBRWMsUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0lmLE1BQU0sV0FBVyx3QkFDZixTQUFTLGFBQVQsQ0FBdUIsV0FBdkIsQ0FEZSxFQUVmLFNBQVMsYUFBVCxDQUF1QixTQUF2QixDQUZlLENBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIndpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcbiAgfHwgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gIHx8IHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuICB8fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuICB8fCBmdW5jdGlvbihmKXtyZXR1cm4gc2V0VGltZW91dChmLCAxMDAwLzYwKX1cclxuXHJcbndpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZVxyXG4gIHx8IHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZVxyXG4gIHx8IGZ1bmN0aW9uKHJlcXVlc3RJRCl7Y2xlYXJUaW1lb3V0KHJlcXVlc3RJRCl9XHJcblxyXG5mdW5jdGlvbiBSYW1tb25hdihjb250YWluZXIsIHRhcmdldCwgYnJlYWtwb2ludCA9IDApIHtcclxuICBjb25zdCBuYXYgPSBjb250YWluZXIuY2hpbGRyZW5bMF1cclxuICBjb25zdCBpdGVtcyA9IG5hdi5jaGlsZHJlbiA/IEFycmF5LmZyb20obmF2LmNoaWxkcmVuKSA6IFtdXHJcbiAgXHJcbiAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3JhbW1vLWVtcHR5JylcclxuICBcclxuICBpdGVtcy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4geyAgICBcclxuICAgIGl0ZW0uc2V0QXR0cmlidXRlKCdyYW1tby13aWR0aCcsIGl0ZW0uY2xpZW50V2lkdGgpXHJcbiAgICBpdGVtLnNldEF0dHJpYnV0ZSgncmFtbW8taW5kZXgnLCBpbmRleClcclxuICB9KVxyXG4gIFxyXG4gIGNvbnN0IGNsb25lZE5hdiA9IG5hdi5jbG9uZU5vZGUodHJ1ZSlcclxuICBjb25zdCBjbG9uZWRJdGVtcyA9IGNsb25lZE5hdi5jaGlsZHJlbiA/IEFycmF5LmZyb20oY2xvbmVkTmF2LmNoaWxkcmVuKSA6IFtdXHJcbiAgXHJcbiAgY2xvbmVkTmF2LmNsYXNzTGlzdC5hZGQoJ3JhbW1vLWNsb25lJylcclxuICBjbG9uZWRJdGVtcy5mb3JFYWNoKGNsb25lZEl0ZW0gPT4gY2xvbmVkSXRlbS5jbGFzc0xpc3QuYWRkKCdyYW1tby1jbG9uZScsICdyYW1tby1oaWRkZW4nKSlcclxuICBcclxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoY2xvbmVkTmF2KVxyXG4gIFxyXG4gIGZ1bmN0aW9uIHJlbW92ZUl0ZW1zKGl0ZW1zVG9SZW1vdmUgPSBbXSkge1xyXG4gICAgY29uc3QgdmlzaWJsZUl0ZW1zTm90SW5JdGVtc1RvUmVtb3ZlID0gaXRlbXMuZmlsdGVyKGl0ZW0gPT4gIWl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdyYW1tby1oaWRkZW4nKSAmJiBpdGVtc1RvUmVtb3ZlLmluZGV4T2YoaXRlbSkgPCAwKVxyXG4gICAgY29uc3QgcmVtb3ZlYWJsZUl0ZW1zID0gdmlzaWJsZUl0ZW1zTm90SW5JdGVtc1RvUmVtb3ZlLmZpbHRlcihpdGVtID0+IGl0ZW0gIT0gbnVsbCAmJiBpdGVtICE9PSB0YXJnZXQpXHJcblxyXG4gICAgaWYgKCFyZW1vdmVhYmxlSXRlbXMubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiBkb1JlbW92ZUl0ZW1zKGl0ZW1zVG9SZW1vdmUpXHJcbiAgICB9IGVsc2UgeyAgICAgICAgXHJcbiAgICAgIGl0ZW1zVG9SZW1vdmUucHVzaChyZW1vdmVhYmxlSXRlbXNbIHJlbW92ZWFibGVJdGVtcy5sZW5ndGggLSAxIF0pXHJcblxyXG4gICAgICBjb25zdCBpdGVtc1dpZHRoVG90YWwgPSBpdGVtc1RvUmVtb3ZlLnJlZHVjZSgoYSwgYikgPT4gYSArIHBhcnNlSW50KGIuZ2V0QXR0cmlidXRlKCdyYW1tby13aWR0aCcpKSwgMClcclxuXHJcbiAgICAgIGlmIChuYXYuY2xpZW50V2lkdGggLSBpdGVtc1dpZHRoVG90YWwgPiBjb250YWluZXIuY2xpZW50V2lkdGgpIHtcclxuICAgICAgICByZXR1cm4gcmVtb3ZlSXRlbXMoaXRlbXNUb1JlbW92ZSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZG9SZW1vdmVJdGVtcyhpdGVtc1RvUmVtb3ZlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGRJdGVtcyhpdGVtc1RvQWRkID0gW10pIHtcclxuICAgIGl0ZW1zVG9BZGQgPSBpdGVtc1RvQWRkLmZpbHRlcihpdGVtID0+IGl0ZW0gIT0gbnVsbClcclxuICAgIFxyXG4gICAgY29uc3QgaGlkZGVuSXRlbXNOb3RJbkl0ZW1zVG9BZGQgPSBpdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtICE9PSB0YXJnZXQgJiYgaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ3JhbW1vLWhpZGRlbicpICYmIGl0ZW1zVG9BZGQuaW5kZXhPZihpdGVtKSA8IDApXHJcblxyXG4gICAgaWYgKCFoaWRkZW5JdGVtc05vdEluSXRlbXNUb0FkZC5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuIGRvQWRkSXRlbXMoaXRlbXNUb0FkZClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IG5leHRJdGVtID0gaGlkZGVuSXRlbXNOb3RJbkl0ZW1zVG9BZGRbMF1cclxuICAgICAgY29uc3QgaXRlbXNXaWR0aFRvdGFsID0gaXRlbXNUb0FkZC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBwYXJzZUludChiLmdldEF0dHJpYnV0ZSgncmFtbW8td2lkdGgnKSksIDApICsgcGFyc2VJbnQobmV4dEl0ZW0uZ2V0QXR0cmlidXRlKCdyYW1tby13aWR0aCcpKVxyXG5cclxuICAgICAgaWYgKG5hdi5jbGllbnRXaWR0aCArIGl0ZW1zV2lkdGhUb3RhbCA8PSBjb250YWluZXIuY2xpZW50V2lkdGgpIHtcclxuICAgICAgICBpdGVtc1RvQWRkLnB1c2gobmV4dEl0ZW0pXHJcblxyXG4gICAgICAgIHJldHVybiBhZGRJdGVtcyhpdGVtc1RvQWRkKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBkb0FkZEl0ZW1zKGl0ZW1zVG9BZGQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGRvUmVtb3ZlSXRlbXMoaXRlbXNUb1JlbW92ZSkge1xyXG4gICAgaWYgKGl0ZW1zVG9SZW1vdmUubGVuZ3RoKSB7XHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcbiAgICAgICAgaXRlbXNUb1JlbW92ZS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgY29uc3QgY2xvbmVkSXRlbSA9IGNsb25lZEl0ZW1zLmZpbHRlcihjbG9uZWRJdGVtID0+IGNsb25lZEl0ZW0uZ2V0QXR0cmlidXRlKCdyYW1tby1pbmRleCcpID09PSBpdGVtLmdldEF0dHJpYnV0ZSgncmFtbW8taW5kZXgnKSlbMF1cclxuXHJcbiAgICAgICAgICBjbG9uZWRJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3JhbW1vLWhpZGRlbicpXHJcbiAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ3JhbW1vLWhpZGRlbicpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuIHRvZ2dsZVRhcmdldEVtcHR5Q2xhc3MoKVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZG9BZGRJdGVtcyhpdGVtc1RvQWRkKSB7XHJcbiAgICBpZiAoaXRlbXNUb0FkZC5sZW5ndGgpIHtcclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICBpdGVtc1RvQWRkLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBjbG9uZWRJdGVtID0gY2xvbmVkSXRlbXMuZmlsdGVyKGNsb25lZEl0ZW0gPT4gY2xvbmVkSXRlbS5nZXRBdHRyaWJ1dGUoJ3JhbW1vLWluZGV4JykgPT09IGl0ZW0uZ2V0QXR0cmlidXRlKCdyYW1tby1pbmRleCcpKVswXVxyXG5cclxuICAgICAgICAgIGNsb25lZEl0ZW0uY2xhc3NMaXN0LmFkZCgncmFtbW8taGlkZGVuJylcclxuICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgncmFtbW8taGlkZGVuJylcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICByZXR1cm4gdG9nZ2xlVGFyZ2V0RW1wdHlDbGFzcygpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB0b2dnbGVUYXJnZXRFbXB0eUNsYXNzKCkge1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgaWYgKGNsb25lZEl0ZW1zLmZpbHRlcihjbG9uZWRJdGVtID0+ICFjbG9uZWRJdGVtLmNsYXNzTGlzdC5jb250YWlucygncmFtbW8taGlkZGVuJykpLmxlbmd0aCkge1xyXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdyYW1tby1lbXB0eScpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3JhbW1vLWVtcHR5JylcclxuICAgICAgfVxyXG5cclxuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgncmFtbW8td2lkdGgnLCB0YXJnZXQuY2xpZW50V2lkdGgpXHJcbiAgICAgIFxyXG4gICAgICByYW1tb25hdi5tb3ZlZEl0ZW1zID0gaXRlbXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ3JhbW1vLWhpZGRlbicpKVxyXG4gICAgICBcclxuICAgICAgaWYgKHR5cGVvZiByYW1tb25hdi5vbm1vdmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICByYW1tb25hdi5vbm1vdmUocmFtbW9uYXYpXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHJldHVybiBjaGVjaygpXHJcbiAgICB9KVxyXG4gIH1cclxuICBcclxuICBmdW5jdGlvbiBjaGVjaygpIHtcclxuICAgIGlmICh3aW5kb3cub3V0ZXJXaWR0aCA+IGJyZWFrcG9pbnQpIHtcclxuICAgICAgaWYgKG5hdi5jbGllbnRXaWR0aCA+IGNvbnRhaW5lci5jbGllbnRXaWR0aCkge1xyXG4gICAgICAgIHJldHVybiByZW1vdmVJdGVtcygpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGFkZEl0ZW1zKClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBjb25zdCByYW1tb25hdiA9IHtcclxuICAgIGNoZWNrOiBjaGVjayxcclxuICAgIGNvbnRhaW5lcjogY29udGFpbmVyLFxyXG4gICAgbmF2OiBuYXYsXHJcbiAgICB0YXJnZXQ6IHRhcmdldCxcclxuICAgIG1vdmVkSXRlbXM6IFtdLFxyXG4gICAgb25tb3ZlOiBudWxsXHJcbiAgfVxyXG4gIFxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByYW1tb25hdi5jaGVjay5iaW5kKHJhbW1vbmF2KSlcclxuICBcclxuICByYW1tb25hdi5jaGVjaygpXHJcbiAgXHJcbiAgcmV0dXJuIHJhbW1vbmF2XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJhbW1vbmF2IiwiaW1wb3J0IFJhbW1vbmF2IGZyb20gJy4uL3NyYy9yYW1tb25hdidcclxuXHJcbmNvbnN0IHJhbW1vbmF2ID0gUmFtbW9uYXYoXHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJhbW1vbmF2JyksXHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN1Ym5hdicpXHJcbikiXX0=
