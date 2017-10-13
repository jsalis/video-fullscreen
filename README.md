# video-fullscreen

[![travis](https://img.shields.io/travis/jsalis/video-fullscreen.svg)](https://travis-ci.org/jsalis/video-fullscreen)
[![codecov](https://img.shields.io/codecov/c/github/jsalis/video-fullscreen.svg)](https://codecov.io/gh/jsalis/video-fullscreen)
[![version](https://img.shields.io/npm/v/video-fullscreen.svg)](http://npm.im/video-fullscreen)
[![license](https://img.shields.io/npm/l/video-fullscreen.svg)](http://opensource.org/licenses/MIT)

> A cross-browser fullscreen API for HTML5 video players

## Installation

```
npm install --save video-fullscreen
```

## Usage

```javascript
import fullscreen from 'video-fullscreen';
```

### Methods

#### `.request({ el, video })`

Requests fullscreen.

**el:HTMLElement** The element to make the request for. Defaults to the document element. <br />
**video:HTMLVideoElement** The video element to make the request for.

#### `.exit()`

Exits fullscreen.

#### `.toggle({ el, video })`

Toggles fullscreen.

**el:HTMLElement** The element to toggle. Defaults to the document element. <br />
**video:HTMLVideoElement** The video element to toggle.

#### `.isFullscreen({ el, video })`

Returns whether fullscreen is active for an element, or any element if one is not specified.

**el:HTMLElement** The element to check for fullscreen. <br />
**video:HTMLVideoElement** The video element to check for fullscreen.

#### `.onChange(listener)`

Adds a listener for the fullscreen change event.

#### `.offChange(listener)`

Removes a listener from the fullscreen change event.

#### `.onError(listener)`

Adds a listener for the fullscreen error event.

#### `.offError(listener)`

Removes a listener from the fullscreen error event.

### Properties

#### `.element`

Gets the element that is currently in fullscreen mode, otherwise `null`.

#### `.enabled`

Checks whether fullscreen is enabled.

#### `.api`

Gets the internal mapping of the browser supported fullscreen API, otherwise `null`.

## License

MIT