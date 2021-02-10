// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"modal.js":[function(require,module,exports) {
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ezshop = window.location.href.split("https://").pop().split("/")[0];

var fetchCampaignInfo = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var res, responseJson;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch("https://easypop.herokuapp.com/api/campaigns/".concat(ezshop), {
              method: "GET",
              headers: {
                "Content-Type": "application/json"
              }
            });

          case 2:
            res = _context.sent;
            _context.next = 5;
            return res.json();

          case 5:
            responseJson = _context.sent;
            return _context.abrupt("return", responseJson.data);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchCampaignInfo() {
    return _ref.apply(this, arguments);
  };
}();

var fetchCartInfo = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var res, responseJson;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return fetch("/cart.js", {
              method: "GET",
              headers: {
                "Content-Type": "application/json"
              }
            });

          case 2:
            res = _context2.sent;
            _context2.next = 5;
            return res.json();

          case 5:
            responseJson = _context2.sent;
            return _context2.abrupt("return", responseJson);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchCartInfo() {
    return _ref2.apply(this, arguments);
  };
}(); // MUTATION OBSERVER TO WATCH FOR CLASS CHANGES


var ClassWatcher = /*#__PURE__*/function () {
  function ClassWatcher(targetNode, classToWatch, classAddedCallback, classRemovedCallback) {
    var _this = this;

    _classCallCheck(this, ClassWatcher);

    _defineProperty(this, "mutationCallback", function (mutationsList) {
      var _iterator = _createForOfIteratorHelper(mutationsList),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var mutation = _step.value;

          if (mutation.type === "attributes" && mutation.attributeName === "class") {
            var currentClassState = mutation.target.classList.contains(_this.classToWatch);

            if (_this.lastClassState !== currentClassState) {
              _this.lastClassState = currentClassState;

              if (currentClassState) {
                _this.classAddedCallback();
              } else {
                _this.classRemovedCallback();
              }
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    });

    this.targetNode = targetNode;
    this.classToWatch = classToWatch;
    this.classAddedCallback = classAddedCallback;
    this.classRemovedCallback = classRemovedCallback;
    this.observer = null;
    this.lastClassState = targetNode.classList.contains(this.classToWatch);
    this.init();
  }

  _createClass(ClassWatcher, [{
    key: "init",
    value: function init() {
      this.observer = new MutationObserver(this.mutationCallback);
      this.observe();
    }
  }, {
    key: "observe",
    value: function observe() {
      this.observer.observe(this.targetNode, {
        attributes: true
      });
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.observer.disconnect();
    }
  }]);

  return ClassWatcher;
}();

var campaignInfo = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var campData, cartData;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return fetchCampaignInfo();

          case 3:
            campData = _context3.sent;
            _context3.next = 6;
            return fetchCartInfo();

          case 6:
            cartData = _context3.sent;
            console.log(cartData);
            campData.forEach(function (campaign) {
              console.log(campaign);
              var freePlan = campaign.freePlan,
                  style = campaign.style,
                  content = campaign.content,
                  settings = campaign.settings,
                  _id = campaign._id,
                  createdAt = campaign.createdAt,
                  name = campaign.name;
              var borderColor = style.borderColor,
                  backgroundColor = style.backgroundColor,
                  primaryButtonColor = style.primaryButtonColor,
                  overlayColor = style.overlayColor;
              var triggers = settings.triggers,
                  triggerMatch = settings.triggerMatch; // I GUESS THIS IS WHERE WE BUILD THE CAMPAIGNS

              if (style.campaignType === "modal") {
                // DOM hooks
                var body = document.querySelector("body");
                var modal = document.createElement("section");
                modal.classList.add("ezy", "ezy-style-modal"); // NOTIFICATION HTML, SEPARATE FROM THE MODAL

                var notification = document.createElement("div");
                notification.classList.add("ezy", "ezy-notification");
                body.appendChild(notification);
                var link1 = document.createElement("link");
                link1.rel = "stylesheet";
                link1.href = "https://cdn.jsdelivr.net/gh/DrJulik/scripts@1.0.947423/styles.min.css";
                document.head.appendChild(link1); // SET CONTENT TYPES

                var setContentTypes = function setContentTypes() {
                  // tw-hidden inside section
                  if (content.contentType === "text-image") {
                    modal.innerHTML = "\n            <!-- TEMPLATE STARTS -->\n\n  <section class=\"ezy-style-modal__window\">\n    <section class=\"ezy-style-modal__close\">\n      <a href=\"#\" class=\"closeBtn\" title=\"Close popup modal\"\">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-x ezy-btn--round--clear\"><line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line></svg>\n      </a>\n    </section>\n    <section class=\"ezy-style-modal__content\"\n      style=\"\n        background-color:".concat(style.backgroundColor, ";\n        border-radius:").concat(style.borderRadius, "px\">\n\n      <section>\n        \n<!-- CONTENT -->\n<section>\n  <div class=\"tw-flex tw-flex-row tw-flex-wrap tw-justify-center\">\n    <!-- ##IF IMAGE## -->\n    ").concat(content.imgUrl !== "" ? "<div class=\"tw-w-full sm:tw-w-1/2\"> \n      <div>\n        <img class=\"ezy-style-modal__content__image\" src=\"".concat(content.imgUrl, "\"/>\n      </div>\n    </div>") : "", "\n   \n    <!-- ##ENDIF## -->\n    <div class=\"tw-w-full sm:tw-w-1/2 tw-max-w-prose tw-flex tw-flex-grow tw-justify-center tw-items-center tw-p-4 tw-md:p-8\">\n      <div>\n        <h3 class=\"ezy-type__headline--bold-1 tw-mb-2\">").concat(content.headline, "</h3>\n        <p class=\"tw-mb-4\">\n        ").concat(content.body, "\n        </p>\n        <a class=\"main-btn ezy-btn tw-w-full\" href=\"").concat(content.buttonUrl, "\"\n          style=\"\n            background-color:").concat(style.primaryButtonColor, ";\n            border-radius:").concat(style.borderRadius, "px\">").concat(content.buttonText, "</a>\n      </div>\n    </div>\n  </div>\n</section>\n<!-- END CONTENT -->\n\n\n      </section>\n\n    </section>\n  </section>\n  <a href=\"https://brickspacelab.com/\" target=\"_blank\" class=\"ezy-tooltip ezy-tooltip--inverted tw-absolute tw-bottom-2 tw-left-2\n    ##IF PAID_PLAN##tw-hidden##ENDIF##\">\n    ").concat(freePlan ? "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-info\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"8\" x2=\"12.01\" y2=\"8\"></line></svg>\n    <span>Powered by Easypop</span>" : "", "\n    \n  </a>\n\n            ");
                    body.appendChild(modal);
                  } else if (content.contentType === "newsletter") {
                    var success;
                    var url = window.location.href;

                    if (url.includes("?customer_posted=true")) {
                      success = "yes";
                    } else if (url.includes("t?contact%5Btags%5D=prospect%2Cnewsletter&form_type=customer")) {
                      success = "no";
                    }

                    modal.innerHTML = "\n            <section class=\"ezy-style-modal__window\">\n              <section class=\"ezy-style-modal__close\">\n                <a href=\"#\" class=\"closeBtn\" title=\"Close popup modal\">\n                  <svg\n                    xmlns=\"http://www.w3.org/2000/svg\"\n                    width=\"24\"\n                    height=\"24\"\n                    viewBox=\"0 0 24 24\"\n                    fill=\"none\"\n                    stroke=\"currentColor\"\n                    stroke-width=\"2\"\n                    stroke-linecap=\"round\"\n                    stroke-linejoin=\"round\"\n                    class=\"feather feather-x ezy-btn--round--clear\"\n                  >\n                    <line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line>\n                    <line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line>\n                  </svg>\n                </a>\n              </section>\n              <section\n                class=\"ezy-style-modal__content\"\n                style=\"\n                  background-color: ".concat(backgroundColor, ";\n                  border-radius: ").concat(style.borderRadius, "px;\n                \"\n              >\n              <section>\n              <div class=\"tw-flex tw-flex-row tw-flex-wrap tw-justify-center\">\n                <!-- ##IF IMAGE## -->\n                ").concat(content.imgUrl !== "" ? "\n                <div class=\"tw-w-full sm:tw-w-1/2\">\n                  <div>\n                    <img class=\"ezy-style-modal__content__image\" src=\"".concat(content.imgUrl, "\" />\n                  </div>\n                </div>\n                <!-- ##ENDIF## -->") : "", "\n            \n                <div\n                  class=\"tw-w-full sm:tw-w-1/2 tw-max-w-prose tw-flex tw-flex-grow tw-justify-center tw-items-center tw-p-4 tw-md:p-8\"\n                >\n                  <div>\n                    <h3 class=\"ezy-type__headline--bold-1 tw-mb-2\">\n                      ").concat(content.headline, "\n                    </h3>\n                    <p class=\"tw-mb-4\">").concat(content.body, "</p>\n                    <form\n                      method=\"post\"\n                      action=\"/contact#contact_form\"\n                      id=\"contact_form\"\n                      accept-charset=\"UTF-8\"\n                      class=\"contact-form\"\n                    >\n                      <input type=\"hidden\" name=\"form_type\" value=\"customer\" /><input\n                        type=\"hidden\"\n                        name=\"utf8\"\n                        value=\"\u2713\"\n                      />\n                      <input\n                        id=\"contact_tags\"\n                        name=\"contact[tags]\"\n                        type=\"hidden\"\n                        value=\"prospect,newsletter\"\n                      />\n            \n                      <input\n                        class=\"tw-mb-2\"\n                        id=\"contact_email\"\n                        name=\"contact[email]\"\n                        type=\"email\"\n                      />\n            \n                      <input\n                        style=\"\n            background-color: ").concat(primaryButtonColor, ";\n            border-radius: ").concat(style.borderRadius, "px;\n            \"\n                        class=\"ezy-btn tw-w-full\"\n                        type=\"submit\"\n                        value=\"").concat(content.buttonText, "\"\n                      />\n                      ").concat(success === "yes" ? "\n                      <h3 style=\"color: green\">Thank you for signing up!</h3>\n                      " : "", " ").concat(success === "no" ? "\n                      <h3 style=\"color: red\">Please input a valid email!</h3>\n                      " : "", "\n                    </form>\n                  </div>\n                </div>\n              </div>\n            </section>");
                    body.appendChild(modal);
                  } else if (content.contentType === "cart-progress-bar") {
                    // for local testing
                    // let cartData = {
                    //   total_price: 49900,
                    // };
                    var cartProgress;

                    if (cartData.total_price === 0) {
                      cartProgress = 0;
                    } else {
                      cartProgress = cartData.total_price / 100 / content.cartGoalValue * 100;
                    }

                    var remainder = cartData.total_price / 100 - content.cartGoalValue;
                    modal.innerHTML = "\n            <section class=\"ezy-style-modal__window\">\n              <section class=\"ezy-style-modal__close\">\n                <a href=\"#\" class=\"closeBtn\" title=\"Close popup modal\">\n                  <svg\n                    xmlns=\"http://www.w3.org/2000/svg\"\n                    width=\"24\"\n                    height=\"24\"\n                    viewBox=\"0 0 24 24\"\n                    fill=\"none\"\n                    stroke=\"currentColor\"\n                    stroke-width=\"2\"\n                    stroke-linecap=\"round\"\n                    stroke-linejoin=\"round\"\n                    class=\"feather feather-x ezy-btn--round--clear\"\n                  >\n                    <line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line>\n                    <line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line>\n                  </svg>\n                </a>\n              </section>\n              <section\n                class=\"ezy-style-modal__content\"\n                style=\"\n                  background-color: ".concat(backgroundColor, ";\n                  border-radius: ").concat(style.borderRadius, "px;\n                \"\n              >\n                <!-- CONTENT -->\n                <section>\n                  <div class=\"tw-flex tw-flex-row tw-flex-wrap tw-justify-center\">\n                    <div\n                      class=\"tw-w-full sm:tw-w-1/2 tw-max-w-prose tw-flex tw-flex-grow tw-justify-center tw-items-center\"\n                    >\n                      <div>\n                        <section class=\"tw-border-b tw-border-gray-200 tw-p-4\">\n                          <p class=\"tw-mb-1\">\n                          ").concat(remainder < 0 ? "You're $".concat(-remainder, " away from ").concat(content.cartGoalPrize, ".") : "".concat(content.cartSuccessMessage), "\n                          </p>\n                          <div\n                            class=\"ezy-progressbar\"\n                            style=\"\n                              \n                              border-radius: ").concat(style.borderRadius, "px;\n                            \"\n                          >\n                            <div class=\"ezy-progressbar__inner\" style=\"width: ").concat(cartProgress, "%; background-color: ").concat(primaryButtonColor, ";\"></div>\n                          </div>\n                        </section>\n          \n                        <section class=\"tw-p-4 tw-md:p-8\">\n                          <h3 class=\"ezy-type__headline--bold-1 tw-mb-2\">\n                            ").concat(content.headline, "\n                          </h3>\n                          <p class=\"tw-mb-4\">\n                            ").concat(content.body, "\n                          </p>\n          \n                          <a\n                            class=\"main-btn ezy-btn tw-w-full\"\n                            href=\"").concat(content.buttonUrl, "\"\n                            style=\"\n                              background-color: ").concat(style.primaryButtonColor, ";\n                              border-radius: ").concat(style.borderRadius, "px;\n                            \"\n                          >\n                            ").concat(content.buttonText, "\n                          </a>\n                        </section>\n                      </div>\n                    </div>\n                  </div>\n                </section>\n                <!-- END CONTENT -->\n              </section>\n            </section>\n            ").concat(freePlan ? "<a\n            href=\"https://brickspacelab.com/\"\n            target=\"_blank\"\n            class=\"ezy-tooltip ezy-tooltip--inverted tw-absolute tw-bottom-2 tw-left-2\"\n          >\n            <svg\n              xmlns=\"http://www.w3.org/2000/svg\"\n              width=\"24\"\n              height=\"24\"\n              viewBox=\"0 0 24 24\"\n              fill=\"none\"\n              stroke=\"currentColor\"\n              stroke-width=\"2\"\n              stroke-linecap=\"round\"\n              stroke-linejoin=\"round\"\n              class=\"feather feather-info\"\n            >\n              <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\n              <line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\"></line>\n              <line x1=\"12\" y1=\"8\" x2=\"12.01\" y2=\"8\"></line>\n            </svg>\n            <span>Powered by Easypop</span>\n          </a>" : "", "\n            \n          \n          ");
                    body.appendChild(modal);
                  } else if (content.contentType === "product-feed") {
                    var products = content.selectedProducts[0].selection;
                    modal.innerHTML = "\n            \n            <!-- TEMPLATE STARTS -->\n  <section class=\"ezy-style-modal__window\">\n    <section class=\"ezy-style-modal__close\">\n      <a href=\"#\" class=\"closeBtn\" title=\"Close popup modal\"\">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-x ezy-btn--round--clear\"><line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line></svg>\n      </a>\n    </section>\n    <section class=\"ezy-style-modal__content\"\n      style=\"\n        background-color:".concat(style.backgroundColor, ";\n        border-radius:").concat(style.borderRadius, "\">\n      <section>\n        <!-- CONTENT -->\n<div class=\"tw-flex tw-flex-row tw-flex-wrap\">\n  <div class=\"tw-w-full sm:tw-w-full tw-flex tw-justify-center tw-items-center\">\n    <div class=\"tw-overflow-hidden\">\n      <div class=\"tw-p-4 tw-max-w-prose\">\n        <h3 class=\"ezy-type__headline--bold-1\">").concat(content.headline, "</h3>\n        <p>\n        ").concat(content.body, "\n        </p>\n      </div>\n      <div class=\"ezy-type-productfeed__arrows\">\n        <div class=\"ezy-type-productfeed__back\">\n          <button class=\"js:ezy-scrollArrowButtons\" data-scroll-direction=\"0\" data-scroll-container=\"ezy-type-productfeed\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-arrow-left ezy-btn--round\"><line x1=\"19\" y1=\"12\" x2=\"5\" y2=\"12\"></line><polyline points=\"12 19 5 12 12 5\"></polyline></svg>\n          </button>\n        </div>\n        <div class=\"ezy-type-productfeed__next\">\n          <button class=\"js:ezy-scrollArrowButtons\" data-scroll-direction=\"1\" data-scroll-container=\"ezy-type-productfeed\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-arrow-right ezy-btn--round\"><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line><polyline points=\"12 5 19 12 12 19\"></polyline></svg>\n          </button>\n        </div>\n      </div>\n      <div class=\"ezy-type-productfeed\">\n        ").concat(products.map(function (product) {
                      return "\n          <div class=\"ezy-type-productfeed__item\">\n          <img class=\"image--square\" src=".concat(product.images[0].originalSrc, "/>\n          <div class=\"tw-px-2 tw-py-4\">\n            <p>").concat(product.title, "</p>\n            <p class=\"tw-pb-2\">$<span class=\"tw-pb-2 js:ezy-productPrice\">").concat(product.variants[0].price, "</span></p>\n            <select id=\"id\" name=\"id\" class=\"ezy-select tw-mb-2 js:ezy-changeVariantSelects\">\n              ").concat(product.variants.map(function (variant) {
                        return "<option value=\"".concat(variant.id.split("gid://shopify/ProductVariant/").pop().split("/")[0], "\" data-variant-availability=\"").concat(variant.availableForSale, "\" data-variant-price=\"").concat(variant.price, "\">").concat(variant.title, "</option>");
                      }), "\n            </select>\n            <button class=\"ezy-btn js:ezy-addVariantButtons tw-w-full\" style=\"background-color:").concat(style.primaryButtonColor, "\" data-variant-id=\"").concat(product.variants[0].price, "\">\n              <span class=\"ezy-btn__text\">\n                Add to cart\n              </span>\n              <span class=\"ezy-btn__spinner\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-loader\"><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"6\"></line><line x1=\"12\" y1=\"18\" x2=\"12\" y2=\"22\"></line><line x1=\"4.93\" y1=\"4.93\" x2=\"7.76\" y2=\"7.76\"></line><line x1=\"16.24\" y1=\"16.24\" x2=\"19.07\" y2=\"19.07\"></line><line x1=\"2\" y1=\"12\" x2=\"6\" y2=\"12\"></line><line x1=\"18\" y1=\"12\" x2=\"22\" y2=\"12\"></line><line x1=\"4.93\" y1=\"19.07\" x2=\"7.76\" y2=\"16.24\"></line><line x1=\"16.24\" y1=\"7.76\" x2=\"19.07\" y2=\"4.93\"></line></svg>\n              </button>\n            </a>\n          </div>\n        </div>");
                    }), "\n      </div>\n    </div>\n  </div>\n</div>\n</section>\n\n    </section>\n  </section>\n  <a href=\"https://brickspacelab.com/\" target=\"_blank\" class=\"ezy-tooltip ezy-tooltip--inverted tw-absolute tw-bottom-2 tw-left-2\n    ##IF PAID_PLAN##tw-hidden##ENDIF##\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-info\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"8\" x2=\"12.01\" y2=\"8\"></line></svg>\n    <span>Powered by Easypop</span>\n  </a>\n</section>");
                    body.appendChild(modal);
                    var ezy = ezy || {};
                    ezy.productfeed = {
                      // simple fetch call
                      fetch: function (_fetch) {
                        function fetch(_x, _x2, _x3, _x4, _x5, _x6) {
                          return _fetch.apply(this, arguments);
                        }

                        fetch.toString = function () {
                          return _fetch.toString();
                        };

                        return fetch;
                      }(function (requestType, url, data, contentType, successCallback, errorCallback) {
                        fetch(url, {
                          method: requestType,
                          headers: {
                            "Content-Type": contentType,
                            Accept: contentType,
                            "X-Requested-With": "xmlhttprequest"
                          },
                          body: JSON.stringify(data)
                        }).then(function (response) {
                          return response.json();
                        }).then(function (data) {
                          successCallback(data);
                        }).catch(function (error) {
                          errorCallback(error);
                        });
                      }),
                      // initilize product feed
                      init: function init() {
                        // add variant to cart
                        function addVariant(variantID, quantity, callback) {
                          var data = {
                            items: [{
                              id: variantID,
                              quantity: quantity
                            }]
                          };
                          ezy.productfeed.fetch("POST", "/cart/add.js", data, "application/json; charset=utf-8", // success
                          function (data) {
                            console.log(data);

                            if (typeof callback === "function" && callback()) {
                              window.setTimeout(function () {
                                callback();
                              }, 500);
                            }
                          }, // error
                          function (error) {
                            if (typeof callback === "function" && callback()) {
                              window.setTimeout(function () {
                                callback();
                              }, 500);
                            }
                          });
                        } // scroll container horizontally


                        function scrollHorizontally(element, direction) {
                          if (direction == 0) {
                            element.scroll({
                              left: element.scrollLeft - 350,
                              behavior: "smooth"
                            });
                          } else {
                            element.scroll({
                              left: element.scrollLeft + 350,
                              behavior: "smooth"
                            });
                          }
                        } // toggle loading state of button


                        function toggleButton(button) {
                          if (button.classList.contains("ezy-btn--loading")) {
                            button.classList.remove("ezy-btn--loading");
                            button.disabled = false;
                          } else {
                            button.classList.add("ezy-btn--loading");
                            button.disabled = true;
                          }
                        } // add disabled state to button


                        function disableButton(button) {
                          button.classList.add("ezy-btn--disabled");
                          button.disabled = true;
                        } // add enabled state to button


                        function enableButton(button) {
                          button.classList.remove("ezy-btn--disabled");
                          button.disabled = false;
                        } // listen for click on scroll arrows


                        var scrollArrowButtons = document.getElementsByClassName("js:ezy-scrollArrowButtons");
                        Array.from(scrollArrowButtons).forEach(function (scrollArrowButton) {
                          scrollArrowButton.addEventListener("click", function (e) {
                            var scrollContainerClass = this.getAttribute("data-scroll-container");
                            var scrollDirection = this.getAttribute("data-scroll-direction");
                            var scrollContainers = document.getElementsByClassName(scrollContainerClass);
                            Array.from(scrollContainers).forEach(function (scrollContainer) {
                              scrollHorizontally(scrollContainer, scrollDirection);
                            });
                          });
                        }); // listen for click on atc

                        var addVariantButtons = document.getElementsByClassName("js:ezy-addVariantButtons");
                        Array.from(addVariantButtons).forEach(function (addVariantButton) {
                          addVariantButton.addEventListener("click", function (e) {
                            var variantId = this.getAttribute("data-variant-id");
                            showNotification("Product was added to the cart!");
                            toggleButton(addVariantButton);
                            addVariant(variantId, 1, function () {
                              toggleButton(addVariantButton);
                            });

                            if (content.closingBehav === "close") {
                              modal.classList.add("ezy-style-modal--animate");
                              setTimeout(function () {
                                modal.classList.add("tw-hidden");
                              }, 1000);
                            }
                          });
                        }); // listen for change to for variant select

                        var changeVariantSelects = document.getElementsByClassName("js:ezy-changeVariantSelects");
                        Array.from(changeVariantSelects).forEach(function (changeVariantSelect) {
                          changeVariantSelect.addEventListener("change", function () {
                            var variantAvailability = this.options[this.selectedIndex].getAttribute("data-variant-availability");
                            var variantPrice = this.options[this.selectedIndex].getAttribute("data-variant-price");
                            var variantId = this.options[this.selectedIndex].value;
                            var productItem = this.closest(".ezy-type-productfeed__item");
                            var button = productItem.getElementsByClassName("js:ezy-addVariantButtons")[0]; // update variant id in button

                            button.setAttribute("data-variant-id", variantId); // update price in item

                            productItem.getElementsByClassName("js:ezy-productPrice")[0].innerHTML = variantPrice; // check availability and update state

                            if (variantAvailability == "true") {
                              enableButton(button);
                            } else {
                              disableButton(button);
                            }
                          }); // Create a new 'change' event

                          var event = new Event("change");
                          changeVariantSelect.dispatchEvent(event);
                        });

                        var showNotification = function showNotification(message) {
                          var notification = document.querySelector(".ezy-notification"); // for (var i = 0; i < notifications.length; i++) {
                          //   let notification = notifications[i];
                          //   let messageElement = notification.querySelector("span");
                          //   if (message) {
                          //     messageElement.innerHTML = message;
                          //   }
                          //   notification.classList.add("ezy-notification--animate");
                          //   setTimeout(function () {
                          //     notification.classList.remove(
                          //       "ezy-notification--animate"
                          //     );
                          //   }, 3000);
                          // }

                          notification.innerHTML = message;
                          notification.classList.add("ezy-notification--animate");
                          setTimeout(function () {
                            notification.classList.remove("ezy-notification--animate");
                          }, 3000);
                        };
                      }
                    };
                    ezy.productfeed.init();
                  } else if (content.contentType === "custom-html") {
                    body.appendChild(modal);
                  }
                }; // SETTINGS
                // AUTO CLOSE


                var handleAutoClose = function handleAutoClose() {
                  console.log("we are auto-closed");

                  if (settings.autoClose) {
                    setTimeout(function () {
                      modal.classList.remove("open");
                      modal.classList.add("ezy-style-modal--animate");
                      setTimeout(function () {
                        modal.classList.add("tw-hidden");
                      }, 1000);
                    }, settings.autoCloseTime * 1000);
                  } else {
                    return;
                  }
                }; // Frequency


                var handleFrequency = function handleFrequency(id) {
                  console.log("we are handling frequency"); // Check if they disabled frequency

                  if (!settings.frequency) {
                    localStorage.removeItem("campaign_".concat(id));
                    localStorage.removeItem("limit_".concat(id));
                  }

                  var timesShown = 1;

                  Date.prototype.addDays = function (days) {
                    var date = new Date(this.valueOf());
                    date.setDate(date.getDate() + days);
                    return date;
                  };

                  var limitPeriod = parseInt(settings.frequencyPeriod);
                  var creationDate = new Date(createdAt);
                  var limitResetDate = creationDate.addDays(limitPeriod);
                  var today = new Date();

                  if (limitResetDate <= today) {
                    localStorage.removeItem("limit_".concat(id));
                  }

                  if (settings.frequency) {
                    if (!localStorage.getItem("campaign_".concat(id))) {
                      localStorage.setItem("campaign_".concat(id), timesShown);
                      var count = localStorage.getItem("campaign_".concat(id));

                      if (settings.frequency && parseInt(count) >= parseInt(settings.frequencyTime)) {
                        console.log("Limit is reached");
                        localStorage.setItem("limit_".concat(id), true);
                      } else if (settings.frequency && parseInt(count) < parseInt(settings.frequencyTime)) {
                        console.log("Limit not reached yet");
                      } else {
                        console.log("Frequency is off");
                      }
                    } else {
                      var _count = localStorage.getItem("campaign_".concat(id));

                      if (!localStorage.getItem("limit_".concat(id))) {
                        _count++;
                        localStorage.setItem("campaign_".concat(id), _count);
                      } else {
                        return;
                      }

                      if (settings.frequency && parseInt(_count) >= parseInt(settings.frequencyTime)) {
                        console.log("Limit is reached");
                        localStorage.setItem("limit_".concat(id), true);
                      } else if (settings.frequency && parseInt(_count) < parseInt(settings.frequencyTime)) {
                        console.log("Limit not reached yet");
                      } else {
                        console.log("Frequency is off");
                      }
                    }
                  } else {
                    return;
                  }
                };

                var triggered = false;

                function workOnClassAdd() {
                  handleFrequency(_id);
                  handleAutoClose();

                  if (!triggered) {
                    triggered = true;
                  }
                }

                function workOnClassRemoval() {} // watch for a specific class change


                var classWatcher = new ClassWatcher(modal, "open", workOnClassAdd, workOnClassRemoval);

                var createModal = function createModal(condition) {
                  // timer for time on page
                  var timerElapsed = false;
                  var exit = false;
                  var scrolled = false;
                  var finishedScrolling = false;

                  var checkCondition = function checkCondition(trigger) {
                    if (trigger.triggerType === "url") {
                      if (trigger.matchingFormat === "contains") {
                        urlTrigger = window.location.href.includes(trigger.matchingInput);

                        if (urlTrigger) {
                          return trigger.triggerType === "url";
                        }
                      } else if (trigger.matchingFormat === "matches") {
                        urlTrigger = window.location.href === trigger.matchingInput;

                        if (urlTrigger) {
                          return trigger.triggerType === "url";
                        }
                      }
                    } else if (trigger.triggerType === "cart-size") {
                      if (trigger.matchingFormat === "greater") {
                        if (cartData.item_count > trigger.matchingInput) {
                          return trigger.triggerType === "cart-size";
                        }
                      } else if (trigger.matchingFormat === "less") {
                        if (cartData.item_count < trigger.matchingInput) {
                          return trigger.triggerType === "cart-size";
                        }
                      }
                    } else if (trigger.triggerType === "cart-value") {
                      if (trigger.matchingFormat === "greater") {
                        if (cartData.total_price / 100 > trigger.matchingInput) {
                          return trigger.triggerType === "cart-value";
                        }
                      } else if (trigger.matchingFormat === "less") {
                        if (cartData.total_price / 100 < trigger.matchingInput) {
                          return trigger.triggerType === "cart-value";
                        }
                      }
                    } else if (trigger.triggerType === "product-in-cart") {
                      if (trigger.matchingFormat === "contains") {
                        var matchingCartItems = cartData.items.find(function (item) {
                          return item.title.includes(trigger.matchingInput);
                        });

                        if (matchingCartItems != undefined) {
                          return trigger.triggerType === "product-in-cart";
                        }
                      } else if (trigger.matchingFormat === "matches") {
                        var _matchingCartItems = cartData.items.find(function (item) {
                          return item.title === trigger.matchingInput;
                        });

                        if (_matchingCartItems != undefined) {
                          return trigger.triggerType === "product-in-cart";
                        }
                      }
                    } else if (scrolled) {
                      return trigger.triggerType === "scroll-depth";
                    } else if (trigger.triggerType === "time-on-page") {
                      if (timerElapsed) {
                        return trigger.triggerType === "time-on-page";
                      }
                    } else if (trigger.triggerType === "exit-intent") {
                      if (exit) {
                        return trigger.triggerType === "exit-intent";
                      }
                    }
                  };

                  var trapFocus = function trapFocus(element) {
                    var modal = element;
                    var focusableElements = 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])';
                    var firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
                    var focusableContent = modal.querySelectorAll(focusableElements);
                    var lastFocusableElement = focusableContent[focusableContent.length - 1];
                    document.addEventListener("keydown", function (e) {
                      var isTabPressed = e.key === "Tab" || e.keyCode === 9;

                      if (!isTabPressed) {
                        return;
                      } // if shift key pressed for shift + tab combination


                      if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                          lastFocusableElement.focus();
                          e.preventDefault();
                        }
                      } // if tab key is pressed
                      else {
                          if (document.activeElement === lastFocusableElement) {
                            firstFocusableElement.focus();
                            e.preventDefault();
                          }
                        }
                    });
                  }; // CHECK FUNCTION


                  function check() {
                    console.log("checked");
                    var conditionsMatched;

                    if (condition === "all") {
                      conditionsMatched = triggers.every(checkCondition);
                    } else if (condition === "any") {
                      conditionsMatched = triggers.some(checkCondition);
                    }

                    var timerObj = triggers.find(function (trigger) {
                      return trigger.triggerType === "time-on-page";
                    });

                    if (!timerElapsed) {
                      setTimeout(function () {
                        timerElapsed = true;
                        check();
                      }, timerObj ? timerObj.matchingInput * 1000 : null);
                    }

                    if (conditionsMatched && !finishedScrolling && !triggered && !localStorage.getItem("limit_".concat(_id))) {
                      console.log("conditions matched"); // CONTENT TYPES

                      setContentTypes();
                      modal.classList.add("open");
                      modal.classList.add("ezy-style-modal--animate");
                      setTimeout(function () {
                        modal.classList.remove("ezy-style-modal--animate");
                      }, 100);
                      var closeBtn = document.querySelector(".closeBtn");
                      closeBtn.addEventListener("click", function (e) {
                        modal.classList.add("ezy-style-modal--animate");
                        setTimeout(function () {
                          modal.classList.add("tw-hidden");
                        }, 1000);
                        isOpen = false;
                      });
                      closeBtn.addEventListener("keyup", function (e) {
                        if (e.keyCode === 13) {
                          e.preventDefault();
                          modal.classList.add("ezy-style-modal--animate");
                          setTimeout(function () {
                            modal.classList.add("tw-hidden");
                          }, 1000);
                          isOpen = false;
                        }
                      }); // MAIN BUTTON AS CLOSE BUTTON FUNC

                      var mainBtn = document.querySelector(".main-btn");

                      if (content.buttonClose && mainBtn != null) {
                        mainBtn.addEventListener("click", function (e) {
                          e.preventDefault();
                          modal.classList.add("ezy-style-modal--animate");
                          setTimeout(function () {
                            modal.classList.add("tw-hidden");
                          }, 1000);
                          isOpen = false;
                        });
                        mainBtn.addEventListener("keyup", function (e) {
                          if (e.keyCode === 13) {
                            e.preventDefault();
                            modal.classList.add("ezy-style-modal--animate");
                            setTimeout(function () {
                              modal.classList.add("tw-hidden");
                            }, 1000);
                            isOpen = false;
                          }
                        });
                      }

                      modal.addEventListener("click", function (e) {
                        if (e.target == this) {
                          modal.classList.add("ezy-style-modal--animate");
                          setTimeout(function () {
                            modal.classList.add("tw-hidden");
                          }, 1000);
                        }
                      });
                      trapFocus(modal);

                      if (triggers.some(function (trigger) {
                        // exit intent
                        return trigger.triggerType === "scroll-depth";
                      })) {
                        finishedScrolling = true;
                      }

                      document.removeEventListener("mouseout", mouseEvent);
                    }
                  }

                  check(); // Cart catch

                  (function (ns, fetch) {
                    console.log("im an  iffee");
                    if (typeof fetch !== "function") return;

                    ns.fetch = function () {
                      var response = fetch.apply(this, arguments);
                      response.then(function (res) {
                        if (["".concat(window.location.origin, "/cart/add.js"), "".concat(window.location.origin, "/cart/update.js"), "".concat(window.location.origin, "/cart/change.js"), "".concat(window.location.origin, "/cart/clear.js")].includes(res.url)) {
                          res.clone().json().then(function (data) {
                            cartDataFetch = fetchCartInfo();
                            cartDataFetch.then(function (cart) {
                              cartData = cart;
                              check();
                            });
                          });
                        }
                      });
                      return response;
                    };
                  })(window, window.fetch); // Cart catch XHR


                  var open = window.XMLHttpRequest.prototype.open;

                  function openReplacement() {
                    this.addEventListener("load", function () {
                      if (["/cart/add.js", "/cart/update.js", "/cart/change.js", "/cart/clear.js"].includes(this._url)) {
                        updateCartInfo(this.response);
                      }
                    });
                    return open.apply(this, arguments);
                  }

                  window.XMLHttpRequest.prototype.open = openReplacement; // cart check Fetch

                  (function (ns, fetch) {
                    if (typeof fetch !== "function") return;

                    ns.fetch = function () {
                      var response = fetch.apply(this, arguments);
                      response.then(function (res) {
                        if (["".concat(window.location.origin, "/cart/add.js"), "".concat(window.location.origin, "/cart/update.js"), "".concat(window.location.origin, "/cart/change.js"), "".concat(window.location.origin, "/cart/clear.js")].includes(res.url)) {
                          res.clone().json().then(function (data) {
                            return console.log(data);
                          });
                        }
                      });
                      return response;
                    };
                  })(window, window.fetch); // EXIT INTENT CHECK


                  var mouseEvent = function mouseEvent(e) {
                    var shouldShowExitIntent = !e.toElement && !e.relatedTarget && e.clientY < 10;

                    if (shouldShowExitIntent) {
                      // document.removeEventListener("mouseout", mouseEvent); not removing cuz we wanna check every time
                      // Handling delay here
                      // flip the exit switch
                      exit = true;
                      check();
                    }
                  };

                  if (triggers.some(function (trigger) {
                    // exit intent
                    return trigger.triggerType === "exit-intent";
                  })) {
                    document.addEventListener("mouseout", mouseEvent);
                  } // SCROLL DEPTH CHECK


                  var catchModal = function catchModal() {
                    scrollpos = window.scrollY;
                    var scrollObj = triggers.find(function (trigger) {
                      return trigger.triggerType === "scroll-depth";
                    });

                    if (!scrolled) {
                      if (scrollpos >= scrollObj.matchingInput) {
                        console.log("found");
                        scrolled = true;
                        check();
                      }

                      console.log("catching");
                    } else {
                      console.log("remove listener");
                      document.removeEventListener("scroll", catchModal);
                    }
                  };

                  if (triggers.some(function (trigger) {
                    // exit intent
                    return trigger.triggerType === "scroll-depth";
                  })) {
                    document.addEventListener("scroll", catchModal);
                  }
                }; // MATCH CONDITIONS -------------------------------------------------------------------


                if (triggerMatch === "all") {
                  console.log("all triggers are matched");
                  createModal("all");
                } else if (triggerMatch === "any") {
                  console.log("any triggers are matched");
                  createModal("any");
                }
              } else if (style.campaignType === "full-screen") {
                console.log("this is something else");
              }
            });
            _context3.next = 14;
            break;

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 11]]);
  }));

  return function campaignInfo() {
    return _ref3.apply(this, arguments);
  };
}();

campaignInfo();
},{}],"../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64262" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","modal.js"], null)
//# sourceMappingURL=/modal.js.map