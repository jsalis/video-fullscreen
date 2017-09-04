
import find from 'lodash/find';

/**
 * @type {Array} The list of all possible fullscreen APIs.
 */
const API_LIST = [
	[
		'requestFullscreen',
		'exitFullscreen',
		'fullscreenElement',
		'fullscreenEnabled',
		'fullscreenchange',
		'fullscreenerror'
	], [
		'webkitRequestFullscreen',
		'webkitExitFullscreen',
		'webkitFullscreenElement',
		'webkitFullscreenEnabled',
		'webkitfullscreenchange',
		'webkitfullscreenerror'
	], [
		'webkitRequestFullScreen',
		'webkitCancelFullScreen',
		'webkitCurrentFullScreenElement',
		'webkitCancelFullScreen',
		'webkitfullscreenchange',
		'webkitfullscreenerror'
	], [
		'mozRequestFullScreen',
		'mozCancelFullScreen',
		'mozFullScreenElement',
		'mozFullScreenEnabled',
		'mozfullscreenchange',
		'mozfullscreenerror'
	], [
		'msRequestFullscreen',
		'msExitFullscreen',
		'msFullscreenElement',
		'msFullscreenEnabled',
		'MSFullscreenChange',
		'MSFullscreenError'
	]
];

/**
 * Finds a supported fullscreen API.
 *
 * @param   {Array}    apiList      The list of possible fullscreen APIs.
 * @param   {Document} document     The source of the fullscreen interface.
 * @returns {Object}
 */
function findSupported(apiList, document) {

	let standardApi = apiList[0];
	let supportedApi = find(apiList, (api) => api[1] in document);

	if (Array.isArray(supportedApi)) {

		return supportedApi.reduce((result, funcName, i) => {
			result[ standardApi[ i ] ] = funcName;
			return result;
		}, {});

	} else {

		return null;
	}
}

/**
 * Creates a new fullscreen controller.
 *
 * @param   {Array}    apiList      The list of possible fullscreen APIs.
 * @param   {Document} document     The source of the fullscreen interface.
 * @returns {Object}
 */
export function createFullscreen(apiList, document) {

	const API = findSupported(apiList, document);
	const TEST_VIDEO = document.createElement('video');

	let activeVideo = null;

	return {

		/**
		 * Gets the raw mapping of the supported fullscreen API.
		 *
		 * @returns {Object}
		 */
		get api() {

			return API;
		},

		/**
		 * Checks whether fullscreen is enabled in the document.
		 *
		 * @returns {Boolean}
		 */
		get enabled() {

			let elementEnabled = API && document[ API['fullscreenEnabled'] ];
			let videoEnabled = TEST_VIDEO['webkitEnterFullscreen'];

			return Boolean(elementEnabled || videoEnabled);
		},

		/**
		 * Gets the HTML element that is currently in fullscreen mode.
		 *
		 * @returns {HTMLElement}
		 */
		get element() {

			if (API) {

				return document[ API['fullscreenElement'] ];

			} else {

				return (activeVideo && activeVideo['webkitDisplayingFullscreen']) ? activeVideo : null;
			}
		},

		/**
		 * Returns whether fullscreen is active for an element, or any element if one is not specified.
		 *
		 * @param   {HTMLElement}      el       The element to check for fullscreen.
		 * @param   {HTMLVideoElement} video    The video element to check for fullscreen.
		 * @returns {Boolean}
		 */
		isFullscreen({ el, video } = {}) {

			if (API) {

				return el ? el === this.element : Boolean(this.element);

			} else {

				return video ? video === this.element : Boolean(this.element);
			}
		},

		/**
		 * Requests fullscreen.
		 *
		 * @param {HTMLElement}      el         The element to make the request for. Defaults to the document element.
		 * @param {HTMLVideoElement} video      The video element to make the request for.
		 */
		request({ el, video } = {}) {

			if (API) {

				el = el || document.documentElement;
				el[ API['requestFullscreen'] ]();

			} else if (video) {

				try {

					video['webkitEnterFullscreen']();
					activeVideo = video;

				} catch (e) {}
			}
		},

		/**
		 * Exits fullscreen.
		 */
		exit() {

			if (API) {

				document[ API['exitFullscreen'] ]();

			} else if (activeVideo) {

				try {

					activeVideo['webkitExitFullscreen']();
					activeVideo = null;

				} catch (e) {}
			}
		},

		/**
		 * Toggles fullscreen.
		 *
		 * @param {Object} target
		 */
		toggle(target) {

			if (this.isFullscreen(target)) {

				this.exit();

			} else {

				this.request(target);
			}
		},

		/**
		 * Adds a listener for the fullscreen change event.
		 *
		 * @param {Function} listener
		 */
		onChange(listener) {

			if (API) {
				document.addEventListener(API['fullscreenchange'], listener, false);
			}
		},

		/**
		 * Removes a listener from the fullscreen change event.
		 *
		 * @param {Function} listener
		 */
		offChange(listener) {

			if (API) {
				document.removeEventListener(API['fullscreenchange'], listener, false);
			}
		},

		/**
		 * Adds a listener for the fullscreen error event.
		 *
		 * @param {Function} listener
		 */
		onError(listener) {

			if (API) {
				document.addEventListener(API['fullscreenerror'], listener, false);
			}
		},

		/**
		 * Removes a listener from the fullscreen error event.
		 *
		 * @param {Function} listener
		 */
		offError(listener) {

			if (API) {
				document.removeEventListener(API['fullscreenerror'], listener, false);
			}
		}
	};
}

/**
 * @type {Object} The fullscreen controller for the current environment.
 */
export default createFullscreen(API_LIST, document);
