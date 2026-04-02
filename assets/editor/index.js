/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/editor/fx-panel.js"
/*!********************************!*\
  !*** ./src/editor/fx-panel.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils */ "./src/editor/utils.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * FX Animation inspector panel component.
 *
 * Adds an "FX Animation" panel to every block's sidebar.
 * Reads/writes CSS classes on the block — no custom attributes.
 */








const EASE_OPTIONS = [{
  value: '',
  label: 'Default'
}, {
  value: 'power1.out',
  label: 'power1.out'
}, {
  value: 'power2.out',
  label: 'power2.out'
}, {
  value: 'power3.out',
  label: 'power3.out'
}, {
  value: 'power4.out',
  label: 'power4.out'
}, {
  value: 'power2.inOut',
  label: 'power2.inOut'
}, {
  value: 'power3.inOut',
  label: 'power3.inOut'
}, {
  value: 'back.out(1.7)',
  label: 'back.out'
}, {
  value: 'elastic.out(1,0.3)',
  label: 'elastic.out'
}, {
  value: 'none',
  label: 'none (linear)'
}];

// START_OPTIONS removed — using free text input instead

/**
 * Higher-order component that adds the FX Animation panel.
 */
const withFxPanel = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_3__.createHigherOrderComponent)(BlockEdit => {
  return props => {
    const {
      attributes,
      setAttributes,
      isSelected
    } = props;
    if (!isSelected) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(BlockEdit, {
        ...props
      });
    }
    const parsed = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.parseFxClasses)(attributes.className || '');
    const {
      effect,
      trigger,
      modifiers,
      otherClasses
    } = parsed;
    const updateFx = changes => {
      const newConfig = {
        effect: changes.effect !== undefined ? changes.effect : effect,
        trigger: changes.trigger !== undefined ? changes.trigger : trigger,
        modifiers: changes.modifiers !== undefined ? {
          ...modifiers,
          ...changes.modifiers
        } : modifiers,
        otherClasses
      };

      // Clear modifiers when effect changes
      if (changes.effect !== undefined && changes.effect !== effect) {
        newConfig.modifiers = {};
        // Default trigger for new effect
        if (_utils__WEBPACK_IMPORTED_MODULE_5__.SCRUB_EFFECTS.includes(changes.effect)) {
          newConfig.trigger = 'st';
        } else if (changes.effect === 'draw-svg' && changes.trigger === 'scrub') {
          newConfig.trigger = 'scrub';
        } else if (changes.effect && !newConfig.trigger) {
          newConfig.trigger = 'st';
        }
      }
      const newClassName = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.generateFxClasses)(newConfig);
      setAttributes({
        className: newClassName || undefined
      });
    };
    const isScrub = _utils__WEBPACK_IMPORTED_MODULE_5__.SCRUB_EFFECTS.includes(effect);
    const isDrawSvg = effect === 'draw-svg';
    const isParallax = effect === 'parallax';
    const hasEffect = !!effect;
    const isScrollTrigger = trigger === 'st' || trigger === '' || isScrub;
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(BlockEdit, {
        ...props
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.PanelBody, {
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('FX Animation', 'fancoolo-fx'),
          initialOpen: hasEffect,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Effect', 'fancoolo-fx'),
            value: effect,
            options: [{
              value: '',
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('None', 'fancoolo-fx')
            }, ..._utils__WEBPACK_IMPORTED_MODULE_5__.EFFECTS.map(e => ({
              value: e.value,
              label: e.label
            }))],
            onChange: val => updateFx({
              effect: val
            })
          }), hasEffect && !isScrub && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Trigger', 'fancoolo-fx'),
            value: trigger || 'st',
            onChange: val => updateFx({
              trigger: val
            }),
            isBlock: true,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
              value: "st",
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Scroll', 'fancoolo-fx')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
              value: "pl",
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Page Load', 'fancoolo-fx')
            }), isDrawSvg && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
              value: "scrub",
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Scrub', 'fancoolo-fx')
            })]
          }), hasEffect && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
              style: {
                display: 'flex',
                gap: '8px'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                style: {
                  flex: 1
                },
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalNumberControl, {
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Duration', 'fancoolo-fx'),
                  value: modifiers.duration ?? '',
                  min: 0,
                  step: 0.1,
                  placeholder: "sec",
                  onChange: val => updateFx({
                    modifiers: {
                      duration: val ? parseFloat(val) : undefined
                    }
                  })
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                style: {
                  flex: 1
                },
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalNumberControl, {
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Delay', 'fancoolo-fx'),
                  value: modifiers.delay ?? '',
                  min: 0,
                  step: 0.1,
                  placeholder: "sec",
                  onChange: val => updateFx({
                    modifiers: {
                      delay: val ? parseFloat(val) : undefined
                    }
                  })
                })
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Ease', 'fancoolo-fx'),
              value: modifiers.ease ?? '',
              options: EASE_OPTIONS,
              onChange: val => updateFx({
                modifiers: {
                  ease: val || undefined
                }
              })
            })]
          }), hasEffect && isScrollTrigger && !isScrub && trigger !== 'scrub' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Start Position', 'fancoolo-fx'),
            value: modifiers.start ?? '',
            placeholder: "top 85%",
            help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('e.g. top 85%, top center, center center', 'fancoolo-fx'),
            onChange: val => updateFx({
              modifiers: {
                start: val || undefined
              }
            })
          }), isParallax && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalNumberControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Y Shift (px)', 'fancoolo-fx'),
            value: modifiers.y ?? '',
            min: 0,
            step: 10,
            onChange: val => updateFx({
              modifiers: {
                y: val ? parseFloat(val) : undefined
              }
            })
          })]
        })
      })]
    });
  };
}, 'withFxPanel');
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_4__.addFilter)('editor.BlockEdit', 'fancoolo-fx/inspector', withFxPanel);

/***/ },

/***/ "./src/editor/utils.js"
/*!*****************************!*\
  !*** ./src/editor/utils.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EFFECTS: () => (/* binding */ EFFECTS),
/* harmony export */   MODIFIER_KEYS: () => (/* binding */ MODIFIER_KEYS),
/* harmony export */   SCRUB_EFFECTS: () => (/* binding */ SCRUB_EFFECTS),
/* harmony export */   generateFxClasses: () => (/* binding */ generateFxClasses),
/* harmony export */   parseFxClasses: () => (/* binding */ parseFxClasses)
/* harmony export */ });
/**
 * FX class parsing and generation utilities.
 *
 * Parses a className string into an FX config object and generates
 * the correct className string from a config object.
 */

// All known effect slugs (kebab-case as used in class names)
const EFFECTS = [{
  value: 'text-reveal',
  label: 'Text Reveal'
}, {
  value: 'reveal',
  label: 'Reveal'
}, {
  value: 'spin-reveal',
  label: 'Spin Reveal'
}, {
  value: 'bg-reveal',
  label: 'BG Reveal'
}, {
  value: 'scale-in',
  label: 'Scale In'
}, {
  value: 'fade-in',
  label: 'Fade In'
}, {
  value: 'blur-in',
  label: 'Blur In'
}, {
  value: 'clip-up',
  label: 'Clip Up'
}, {
  value: 'clip-down',
  label: 'Clip Down'
}, {
  value: 'tilt-in',
  label: 'Tilt In'
}, {
  value: 'type-writer',
  label: 'Type Writer'
}, {
  value: 'draw-svg',
  label: 'Draw SVG'
}, {
  value: 'parallax',
  label: 'Parallax'
}, {
  value: 'split-words',
  label: 'Split Words'
}, {
  value: 'slide-left',
  label: 'Slide Left'
}, {
  value: 'slide-right',
  label: 'Slide Right'
}];

// Effects that are always scrub-based (no trigger choice)
const SCRUB_EFFECTS = ['tilt-in', 'parallax'];

// Modifier keys we recognize
const MODIFIER_KEYS = ['duration', 'delay', 'stagger', 'ease', 'start', 'y', 'scrub'];

/**
 * Build a sorted list of all possible FX class prefixes for matching.
 * Sorted longest-first so "slide-left" matches before "slide".
 */
const EFFECT_SLUGS = EFFECTS.map(e => e.value).sort((a, b) => b.length - a.length);

/**
 * Parse a className string into an FX config object.
 *
 * @param {string} className - The block's className attribute.
 * @return {Object} { effect, trigger, modifiers: {}, otherClasses }
 */
function parseFxClasses(className) {
  if (!className) {
    return {
      effect: '',
      trigger: '',
      modifiers: {},
      otherClasses: ''
    };
  }
  const classes = className.split(/\s+/).filter(Boolean);
  const otherClasses = [];
  let effect = '';
  let trigger = '';
  const modifiers = {};

  // Special case: fx-draw-svg-scrub
  let drawSvgScrub = false;
  for (const cls of classes) {
    // Check for draw-svg-scrub special class
    if (cls === 'fx-draw-svg-scrub') {
      effect = 'draw-svg';
      trigger = 'scrub';
      drawSvgScrub = true;
      continue;
    }

    // Check for modifier classes: fx-{key}-[{value}]
    let isModifier = false;
    for (const key of MODIFIER_KEYS) {
      const prefix = `fx-${key}-[`;
      if (cls.startsWith(prefix) && cls.endsWith(']')) {
        const val = cls.slice(prefix.length, -1);
        modifiers[key] = isNaN(parseFloat(val)) ? val : parseFloat(val);
        isModifier = true;
        break;
      }
    }
    if (isModifier) continue;

    // Check for effect classes: fx-{slug}-pl, fx-{slug}-st, fx-{slug}
    let isEffect = false;
    for (const slug of EFFECT_SLUGS) {
      const base = `fx-${slug}`;
      if (cls === `${base}-pl`) {
        effect = slug;
        trigger = 'pl';
        isEffect = true;
        break;
      }
      if (cls === `${base}-st`) {
        effect = slug;
        trigger = 'st';
        isEffect = true;
        break;
      }
      if (cls === base) {
        effect = slug;
        trigger = '';
        isEffect = true;
        break;
      }
    }
    if (isEffect) continue;

    // Not an FX class — preserve it
    otherClasses.push(cls);
  }
  return {
    effect,
    trigger,
    modifiers,
    otherClasses: otherClasses.join(' ')
  };
}

/**
 * Generate a className string from an FX config object.
 *
 * @param {Object} config - { effect, trigger, modifiers: {}, otherClasses }
 * @return {string} The combined className string.
 */
function generateFxClasses(config) {
  const parts = [];

  // Other (non-FX) classes first
  if (config.otherClasses) {
    parts.push(config.otherClasses);
  }
  if (!config.effect) {
    return parts.join(' ').trim();
  }

  // Special case: draw-svg scrub mode
  if (config.effect === 'draw-svg' && config.trigger === 'scrub') {
    parts.push('fx-draw-svg-scrub');
  } else if (SCRUB_EFFECTS.includes(config.effect)) {
    // Scrub effects: use -st suffix (they're always scroll-linked)
    parts.push(`fx-${config.effect}-st`);
  } else {
    // Normal effects with trigger suffix
    const suffix = config.trigger ? `-${config.trigger}` : '';
    parts.push(`fx-${config.effect}${suffix}`);
  }

  // Modifiers
  const mods = config.modifiers || {};
  for (const key of MODIFIER_KEYS) {
    if (mods[key] !== undefined && mods[key] !== '' && mods[key] !== null) {
      parts.push(`fx-${key}-[${mods[key]}]`);
    }
  }
  return parts.join(' ').trim();
}


/***/ },

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

/***/ },

/***/ "@wordpress/block-editor"
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
(module) {

module.exports = window["wp"]["blockEditor"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/compose"
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["compose"];

/***/ },

/***/ "@wordpress/hooks"
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
(module) {

module.exports = window["wp"]["hooks"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./src/editor/index.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _fx_panel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fx-panel */ "./src/editor/fx-panel.js");
/**
 * Fancoolo FX — Gutenberg editor integration.
 *
 * Adds an "FX Animation" panel to every block's Inspector sidebar.
 * All logic is in fx-panel.js — this file just imports it to trigger registration.
 */


})();

/******/ })()
;
//# sourceMappingURL=index.js.map