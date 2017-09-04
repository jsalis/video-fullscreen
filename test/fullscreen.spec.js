
import { createFullscreen } from '../src/fullscreen';

describe('createFullscreen', () => {

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
		]
	];

	let docWithElementFullscreenSupport;
	let docWithVideoFullscreenSupport;
	let docWithNoFullscreenSupport;

	beforeEach(() => {
		docWithElementFullscreenSupport = {
			fullscreenEnabled: true,
			fullscreenElement: null,
			exitFullscreen: jasmine.createSpy('exitFullscreen'),
			addEventListener: jasmine.createSpy('addEventListener'),
			removeEventListener: jasmine.createSpy('removeEventListener'),
			documentElement: {
				requestFullscreen: jasmine.createSpy('requestFullscreen')
			},
			createElement() {
				return {};
			}
		};
		docWithVideoFullscreenSupport = {
			addEventListener: jasmine.createSpy('addEventListener'),
			removeEventListener: jasmine.createSpy('removeEventListener'),
			documentElement: {},
			createElement(tagName) {
				if (tagName === 'video') {
					return {
						webkitEnterFullscreen: jasmine.createSpy('webkitEnterFullscreen'),
						webkitExitFullscreen: jasmine.createSpy('webkitExitFullscreen')
					};
				} else {
					return {};
				}
			}
		};
		docWithNoFullscreenSupport = {
			addEventListener: jasmine.createSpy('addEventListener'),
			removeEventListener: jasmine.createSpy('removeEventListener'),
			documentElement: {},
			createElement() {
				return {};
			}
		};
	});

	describe('api', () => {

		it('must be a fullscreen API supported by the given document', () => {
			let doc = {
				webkitFullscreenEnabled: true,
				webkitFullscreenElement: null,
				webkitExitFullscreen: jasmine.createSpy('webkitExitFullscreen'),
				documentElement: {
					webkitRequestFullscreen: jasmine.createSpy('webkitRequestFullscreen')
				},
				createElement() {
					return {};
				}
			};
			let fullscreen = createFullscreen(API_LIST, doc);
			expect(fullscreen.api).toEqual(
				jasmine.objectContaining({
					requestFullscreen: 'webkitRequestFullscreen',
					exitFullscreen: 'webkitExitFullscreen',
					fullscreenElement: 'webkitFullscreenElement',
					fullscreenEnabled: 'webkitFullscreenEnabled',
					fullscreenchange: 'webkitfullscreenchange',
					fullscreenerror: 'webkitfullscreenerror'
				})
			);
		});
	});

	describe('enabled', () => {

		it('must be true when element fullscreen is enabled', () => {
			let doc = docWithElementFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			expect(fullscreen.enabled).toBe(true);
		});

		it('must be false when element fullscreen is disabled', () => {
			let doc = docWithElementFullscreenSupport;
			doc.fullscreenEnabled = false;
			let fullscreen = createFullscreen(API_LIST, doc);
			expect(fullscreen.enabled).toBe(false);
		});

		it('must be true when video fullscreen is available', () => {
			let doc = docWithVideoFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			expect(fullscreen.enabled).toBe(true);
		});

		it('must be false when element and video fullscreen are not supported', () => {
			let doc = docWithNoFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			expect(fullscreen.enabled).toBe(false);
		});
	});

	describe('element', () => {

		it('must return the active fullscreen element, null otherwise', () => {
			let doc = docWithElementFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let el = {
				requestFullscreen: jasmine.createSpy('requestFullscreen').and.callFake(() => {
					doc.fullscreenElement = el;
				})
			};
			expect(fullscreen.element).toBe(null);
			fullscreen.request({ el });
			expect(fullscreen.element).toBe(el);
			doc.fullscreenElement = null;
			expect(fullscreen.element).toBe(null);
		});

		it('must return the active fullscreen video, null otherwise', () => {
			let doc = docWithVideoFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let video = {
				webkitDisplayingFullscreen: false,
				webkitEnterFullscreen: jasmine.createSpy('webkitEnterFullscreen').and.callFake(() => {
					video.webkitDisplayingFullscreen = true;
				})
			};
			expect(fullscreen.element).toBe(null);
			fullscreen.request({ video });
			expect(fullscreen.element).toBe(video);
			video.webkitDisplayingFullscreen = false;
			expect(fullscreen.element).toBe(null);
		});

		it('must return null when fullscreen is not supported', () => {
			let doc = docWithNoFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			expect(fullscreen.element).toBe(null);
		});
	});

	describe('isFullscreen', () => {

		it('must return true when the given element is fullscreen, false otherwise', () => {
			let doc = docWithElementFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let el = {
				requestFullscreen: jasmine.createSpy('requestFullscreen').and.callFake(() => {
					doc.fullscreenElement = el;
				})
			};
			let otherEl = {};
			expect(fullscreen.isFullscreen({ el })).toBe(false);
			fullscreen.request({ el });
			expect(fullscreen.isFullscreen()).toBe(true);
			expect(fullscreen.isFullscreen({ el })).toBe(true);
			expect(fullscreen.isFullscreen({ el: otherEl })).toBe(false);
			doc.fullscreenElement = null;
			expect(fullscreen.isFullscreen({ el })).toBe(false);
		});

		it('must return true when the given video is fullscreen, false otherwise', () => {
			let doc = docWithVideoFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let video = {
				webkitDisplayingFullscreen: false,
				webkitEnterFullscreen: jasmine.createSpy('webkitEnterFullscreen').and.callFake(() => {
					video.webkitDisplayingFullscreen = true;
				})
			};
			let otherVideo = {};
			expect(fullscreen.isFullscreen({ video })).toBe(false);
			fullscreen.request({ video });
			expect(fullscreen.isFullscreen()).toBe(true);
			expect(fullscreen.isFullscreen({ video })).toBe(true);
			expect(fullscreen.isFullscreen({ video: otherVideo })).toBe(false);
			video.webkitDisplayingFullscreen = false;
			expect(fullscreen.isFullscreen({ video })).toBe(false);
		});

		it('must return false when fullscreen is not supported', () => {
			let doc = docWithNoFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			expect(fullscreen.isFullscreen()).toBe(false);
		});
	});

	describe('request', () => {

		it('must request fullscreen for a given element', () => {
			let doc = docWithElementFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let el = {
				requestFullscreen: jasmine.createSpy('requestFullscreen')
			};
			fullscreen.request({ el });
			expect(el.requestFullscreen).toHaveBeenCalled();
		});

		it('must request fullscreen for the document element when no element is given', () => {
			let doc = docWithElementFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			fullscreen.request();
			expect(doc.documentElement.requestFullscreen).toHaveBeenCalled();
		});

		it('must request fullscreen for a given video', () => {
			let doc = docWithVideoFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let video = {
				webkitEnterFullscreen: jasmine.createSpy('webkitEnterFullscreen')
			};
			fullscreen.request({ video });
			expect(video.webkitEnterFullscreen).toHaveBeenCalled();
		});

		it('must not throw when video fullscreen is not allowed', () => {
			let doc = docWithVideoFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let video = {
				webkitEnterFullscreen() {
					throw new Error('fullscreen not allowed');
				}
			};
			expect(() => fullscreen.request({ video })).not.toThrow();
		});

		it('must not throw when fullscreen is not supported', () => {
			let doc = docWithNoFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			expect(() => fullscreen.request()).not.toThrow();
		});
	});

	describe('exit', () => {

		it('must exit element fullscreen', () => {
			let doc = docWithElementFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			fullscreen.exit();
			expect(doc.exitFullscreen).toHaveBeenCalled();
		});

		it('must exit video fullscreen', () => {
			let doc = docWithVideoFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let video = {
				webkitEnterFullscreen: jasmine.createSpy('webkitEnterFullscreen'),
				webkitExitFullscreen: jasmine.createSpy('webkitExitFullscreen')
			};
			fullscreen.request({ video });
			fullscreen.exit();
			expect(video.webkitExitFullscreen).toHaveBeenCalled();
		});

		it('must not throw when fullscreen is not supported', () => {
			let doc = docWithNoFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			expect(() => fullscreen.exit()).not.toThrow();
		});
	});

	describe('toggle', () => {

		it('must request fullscreen when fullscreen is not active', () => {
			let doc = docWithElementFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let el = {};
			let video = {};
			spyOn(fullscreen, 'isFullscreen').and.callFake(() => false);
			spyOn(fullscreen, 'request');
			fullscreen.toggle({ el, video });
			expect(fullscreen.request).toHaveBeenCalledWith(jasmine.objectContaining({ el, video }));
		});

		it('must exit fullscreen when fullscreen is active', () => {
			let doc = docWithElementFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let el = {};
			let video = {};
			spyOn(fullscreen, 'isFullscreen').and.callFake(() => true);
			spyOn(fullscreen, 'exit');
			fullscreen.toggle({ el, video });
			expect(fullscreen.exit).toHaveBeenCalled();
		});
	});

	describe('onChange', () => {

		it('must add a listener for the supported fullscreen change event', () => {
			let doc = docWithElementFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let listener = jasmine.createSpy('listener');
			fullscreen.onChange(listener);
			expect(doc.addEventListener).toHaveBeenCalledWith('fullscreenchange', listener, false);
		});

		it('must not throw when fullscreen is not supported', () => {
			let doc = docWithNoFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let listener = jasmine.createSpy('listener');
			expect(() => fullscreen.onChange(listener)).not.toThrow();
			expect(doc.addEventListener).not.toHaveBeenCalled();
		});
	});

	describe('offChange', () => {

		it('must remove a listener from the supported fullscreen change event', () => {
			let doc = docWithElementFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let listener = jasmine.createSpy('listener');
			fullscreen.offChange(listener);
			expect(doc.removeEventListener).toHaveBeenCalledWith('fullscreenchange', listener, false);
		});

		it('must not throw when fullscreen is not supported', () => {
			let doc = docWithNoFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let listener = jasmine.createSpy('listener');
			expect(() => fullscreen.offChange(listener)).not.toThrow();
			expect(doc.removeEventListener).not.toHaveBeenCalled();
		});
	});

	describe('onError', () => {

		it('must add a listener for the supported fullscreen error event', () => {
			let doc = docWithElementFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let listener = jasmine.createSpy('listener');
			fullscreen.onError(listener);
			expect(doc.addEventListener).toHaveBeenCalledWith('fullscreenerror', listener, false);
		});

		it('must not throw when fullscreen is not supported', () => {
			let doc = docWithNoFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let listener = jasmine.createSpy('listener');
			expect(() => fullscreen.onError(listener)).not.toThrow();
			expect(doc.addEventListener).not.toHaveBeenCalled();
		});
	});

	describe('offError', () => {

		it('must remove a listener from the supported fullscreen error event', () => {
			let doc = docWithElementFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let listener = jasmine.createSpy('listener');
			fullscreen.offError(listener);
			expect(doc.removeEventListener).toHaveBeenCalledWith('fullscreenerror', listener, false);
		});

		it('must not throw when fullscreen is not supported', () => {
			let doc = docWithNoFullscreenSupport;
			let fullscreen = createFullscreen(API_LIST, doc);
			let listener = jasmine.createSpy('listener');
			expect(() => fullscreen.offError(listener)).not.toThrow();
			expect(doc.removeEventListener).not.toHaveBeenCalled();
		});
	});
});
