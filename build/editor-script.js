/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/blocks/media.js":
/*!********************************!*\
  !*** ./src/js/blocks/media.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3__);





/* =============================================================== *\ 
   Konstante: Dropdown-Optionen
\* =============================================================== */
const PRIORITY_OPTIONS = [{
  label: "5 – Sehr hoch",
  value: "5"
}, {
  label: "4 – Hoch",
  value: "4"
}, {
  label: "3 – Mittel",
  value: "3"
}, {
  label: "2 – Niedrig",
  value: "2"
}, {
  label: "1 – Sehr niedrig",
  value: "1"
}];

/* =============================================================== *\ 
   Komponente: Panel zur Auswahl der Priorität
\* =============================================================== */
const MediaPriorityPanel = () => {
  const postId = new URLSearchParams(window.location.search).get("item");
  const [value, setValue] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)("3");
  const [skipRender, setSkipRender] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [isReady, setIsReady] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false); // ← damit das Feld erst auftaucht, wenn geklärt
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    setIsReady(false); // nur den Ladezustand zurücksetzen
  }, [postId]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3___default()({
      path: `/wp/v2/media/${postId}`
    }).then(res => {
      const allowed = window.cpmSettings?.allowedMimeTypes || ["application/pdf"];
      const mime = res.mime_type || "";
      const baseType = mime.split("/")[0];
      const isAllowed = allowed.includes(mime) || allowed.includes(baseType);
      if (!isAllowed) {
        setSkipRender(true); // unterdrücke Anzeige
      } else {
        setSkipRender(false); // ← explizit wieder aktivieren
        setValue(res.meta?.pdf_priority || "3");
      }
      setIsReady(true);
      setIsReady(true); // ⬅️ wichtig: Status aktualisieren
    });
  }, [postId]);
  if (!isReady || skipRender) return null;
  const handleChange = newValue => {
    setValue(newValue);
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3___default()({
      path: `/wp/v2/media/${postId}`,
      method: "POST",
      data: {
        meta: {
          pdf_priority: newValue
        }
      }
    });
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      padding: "1em",
      background: "#fff",
      border: "1px solid #ccc",
      marginTop: "1em"
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    style: {
      marginTop: 0
    }
  }, "Inhalts-Priorit\xE4t"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
    value: value,
    options: PRIORITY_OPTIONS,
    onChange: handleChange,
    __next40pxDefaultSize: true,
    __nextHasNoMarginBottom: true
  }));
};

/* =============================================================== *\ 
   Logik: Einfügen des Panels bei Medienwechsel
\* =============================================================== */
let lastRenderedId = null;
function tryRenderPanel(retries = 0) {
  const postId = new URLSearchParams(window.location.search).get("item");
  if (!postId) return;
  const container = document.querySelector(".attachment-info");
  const alreadyMounted = container?.querySelector(".media-priority-container");

  // Falls Panel für aktuelle ID bereits existiert → abbrechen
  if (postId === lastRenderedId && alreadyMounted) return;

  // Falls .attachment-info noch nicht existiert → später nochmal versuchen
  if (!container) {
    if (retries < 20) {
      setTimeout(() => tryRenderPanel(retries + 1), 200); // max. 4s warten
    }
    return;
  }

  // Vorheriges Panel entfernen (falls vorhanden)
  if (alreadyMounted) {
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.unmountComponentAtNode)(alreadyMounted);
    alreadyMounted.remove();
  }

  // Neues Panel einfügen
  const mountPoint = document.createElement("div");
  mountPoint.className = "media-priority-container";
  container.appendChild(mountPoint);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.render)((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(MediaPriorityPanel, null), mountPoint);
  lastRenderedId = postId;
}

/* =============================================================== *\ 
   Initialisierung: Beobachte DOM-Änderungen
\* =============================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const contentRoot = document.querySelector(".media-frame-content") || document.body;
  const observer = new MutationObserver(() => {
    setTimeout(tryRenderPanel, 50); // Debounce, um Timing-Probleme zu vermeiden
  });
  observer.observe(contentRoot, {
    childList: true,
    subtree: true
  });
  tryRenderPanel(); // Direkt initial ausführen
});

/***/ }),

/***/ "./src/js/blocks/post.js":
/*!*******************************!*\
  !*** ./src/js/blocks/post.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/plugins */ "@wordpress/plugins");
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_plugins__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/editor */ "@wordpress/editor");
/* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);






/* =============================================================== *\ 
   Konstante: Dropdown-Optionen
\* =============================================================== */
const PRIORITY_OPTIONS = [{
  label: "5 – Sehr hoch",
  value: "5"
}, {
  label: "4 – Hoch",
  value: "4"
}, {
  label: "3 – Mittel",
  value: "3"
}, {
  label: "2 – Niedrig",
  value: "2"
}, {
  label: "1 – Sehr niedrig",
  value: "1"
}];

/* =============================================================== *\
   Registrierung bei passenden Post Types
\* =============================================================== */
wp.data.subscribe(() => {
  const currentType = wp.data.select("core/editor").getCurrentPostType();
  const allowedTypes = window.cpmSettings?.enabledPostTypes || [];
  if (!currentType) return; // Post-Typ noch nicht bekannt
  if (!allowedTypes.includes(currentType)) return; // Nicht erlaubt

  // Nur einmal registrieren (bei Hot-Reloads etc.)
  if (window.__cpm_post_plugin_registered) return;
  window.__cpm_post_plugin_registered = true;

  /* =============================================================== *\
     Komponente: Sidebar-Einstellung für Inhalts-Priorität
  \* =============================================================== */
  const ContentPrioritySidebar = () => {
    const meta = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(select => select("core/editor").getEditedPostAttribute("meta"));
    const {
      editPost
    } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useDispatch)("core/editor");
    const current = meta?.content_priority || "3";
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_editor__WEBPACK_IMPORTED_MODULE_2__.PluginDocumentSettingPanel, {
      name: "content-priority-sidebar",
      title: "Inhalts-Priorit\xE4t"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
      label: "W\xE4hle eine Priorit\xE4t",
      value: current,
      options: PRIORITY_OPTIONS,
      onChange: newValue => editPost({
        meta: {
          ...meta,
          content_priority: newValue
        }
      }),
      __next40pxDefaultSize: true,
      __nextHasNoMarginBottom: true
    }));
  };

  // Plugin-Registrierung im Editor
  (0,_wordpress_plugins__WEBPACK_IMPORTED_MODULE_1__.registerPlugin)("content-priority-sidebar", {
    render: ContentPrioritySidebar
  });
});

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/editor":
/*!********************************!*\
  !*** external ["wp","editor"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["editor"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/plugins":
/*!*********************************!*\
  !*** external ["wp","plugins"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["plugins"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ })

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
/*!**************************!*\
  !*** ./src/js/editor.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _blocks_media__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./blocks/media */ "./src/js/blocks/media.js");
/* harmony import */ var _blocks_post__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./blocks/post */ "./src/js/blocks/post.js");
// src/js/editor.js



})();

/******/ })()
;
//# sourceMappingURL=editor-script.js.map