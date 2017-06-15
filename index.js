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
  var rammonav = {
    cache: function cache(container, sub) {
      var _this = this;

      this.container = container;
      this.nav = this.container.children[0];
      this.links = Array.from(this.nav.children);

      this.links.forEach(function (link, index) {
        return link.setAttribute('rammo-id', index);
      });

      this.sub = sub;
      this.subNav = this.nav.cloneNode(true);
      this.subLinks = Array.from(this.subNav.children);

      this.links.forEach(function (link, index) {
        return link.setAttribute('rammo-width', link.clientWidth);
      });

      requestAnimationFrame(function () {
        _this.subLinks.forEach(function (link) {
          link.classList.add('rammo-sublink');
          link.style.display = 'none';
        });

        _this.sub.appendChild(_this.subNav);
      });
    },
    bind: function bind() {
      window.addEventListener('resize', this.handleResize.bind(this));
    },
    handleResize: function handleResize() {
      var maxWidth = this.container.clientWidth;
      var width = this.nav.clientWidth;

      if (width > maxWidth) {
        requestAnimationFrame(this.removeLastLinkFromNav.bind(this));
      } else {
        requestAnimationFrame(this.addNextLinkToNav.bind(this));
      }
    },
    isHidden: function isHidden(element) {
      return getComputedStyle(element).display === 'none';
    },
    hideElement: function hideElement(element) {
      return element.style.display = 'none';
    },
    showElement: function showElement(element) {
      return element.style.display = '';
    },
    toggleSubClass: function toggleSubClass() {
      var _this2 = this;

      var hasVisibleLinks = this.subLinks.filter(function (link) {
        return !_this2.isHidden(link);
      }).length;

      if (hasVisibleLinks) {
        this.sub.classList.remove('empty');
      } else {
        this.sub.classList.add('empty');
      }
    },
    removeLastLinkFromNav: function removeLastLinkFromNav() {
      var _this3 = this;

      var maxWidth = this.container.clientWidth;
      var width = this.nav.clientWidth;
      var lastIndex = this.links.length - 1;
      var lastLink = this.links[lastIndex];
      var lastLinkId = lastLink.getAttribute('rammo-id');
      var isHidden = this.isHidden(lastLink);

      while (isHidden) {
        lastIndex = lastIndex - 1;
        lastLink = this.links[lastIndex];
        lastLinkId = lastLink.getAttribute('rammo-id');
        isHidden = this.isHidden(lastLink);

        if (lastIndex === 0) {
          break;
        }
      }

      this.hideElement(lastLink);

      this.subLinks.forEach(function (link) {
        var linkId = link.getAttribute('rammo-id');

        if (linkId === lastLinkId) {
          _this3.showElement(link);
        }
      });

      width = this.nav.clientWidth;

      this.toggleSubClass();

      if (width > maxWidth) {
        return requestAnimationFrame(this.removeLastLinkFromNav.bind(this));
      } else {
        return true;
      }
    },
    addNextLinkToNav: function addNextLinkToNav() {
      var _this4 = this;

      var maxWidth = this.container.clientWidth;
      var lastLink = this.links[this.links.length - 1];
      var lastLinkIsVisible = !this.isHidden(lastLink);
      var width = this.nav.clientWidth;
      var nextIndex = 0;
      var nextLink = this.links[nextIndex];
      var nextLinkId = nextLink.getAttribute('rammo-id');
      var nextLinkWidth = parseInt(nextLink.getAttribute('rammo-width'));
      var isVisible = !this.isHidden(nextLink);

      if (lastLinkIsVisible) {
        return true;
      }

      while (isVisible) {
        nextIndex = nextIndex + 1;
        nextLink = this.links[nextIndex];
        nextLinkId = nextLink.getAttribute('rammo-id');
        nextLinkWidth = parseInt(nextLink.getAttribute('rammo-width'));
        isVisible = !this.isHidden(nextLink);

        if (nextIndex >= this.links.length - 1) {
          break;
        }
      }

      if (width + nextLinkWidth > maxWidth) {
        return true;
      }

      this.showElement(nextLink);

      this.subLinks.forEach(function (link) {
        var linkId = link.getAttribute('rammo-id');

        if (linkId === nextLinkId) {
          _this4.hideElement(link);
        }
      });

      width = this.nav.clientWidth;

      this.toggleSubClass();

      if (width < maxWidth) {
        return requestAnimationFrame(this.addNextLinkToNav.bind(this));
      } else {
        return true;
      }
    },
    init: function init(container, sub) {
      this.cache(container, sub);
      this.bind();
      this.handleResize();
    }
  };

  function Rammonav(nav, subnav) {
    return rammonav.init(nav, subnav);
  }

  if (window) {
    window.Rammonav = Rammonav;

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (f) {
      return setTimeout(f, 1000 / 60);
    };

    window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || function (requestID) {
      clearTimeout(requestID);
    };
  }

  exports.default = Rammonav;
});
