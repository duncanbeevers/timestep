/**
 * @license
 * This file is part of the Game Closure SDK.
 *
 * The Game Closure SDK is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * The Game Closure SDK is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with the Game Closure SDK.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * package ui.backend.canvas.ImageView;
 *
 * canvas.ImageView implementation.
 */

import util.path;
import std.uri as URI;

import ui.View as View
import ui.resource.Image as Image;

/**
 * @extends ui.View
 */
var ImageView = exports = Class(View, function (supr) {

	/** 
	 * Options:
	 *   autoSize - See .setImage()
	 */

	this.init = function (opts) {
		supr(this, 'init', arguments);
		opts = merge(opts, {
			image: null,
			autoSize: false
		});
		
		if (opts.image) {
			this.setImage(opts.image, opts);
		}
	};

	/**
	 * Return this view's Image object.
	 */

	this.getImage = function () {
		return this._img;
	};

	/**
	 * Set the image of the view from an Image object or string.
	 * Options:
	 *   autoSize - Automatically set view size from image dimensions.
	 */

	this._imgCache = {};

	this.setImage = function (img, opts) {
		if (typeof img == 'string') {
			// Cache image requests to avoid heavy performance penalties at the
			// expense of a small amount of additional JS memory usage.
			var name = img;
			img = this._imgCache[name];
			if (!img) {
				this._imgCache[img] = img = new Image({url: name});
			}
		}

		this._img = img;

		if (this._img) {
			if (opts && opts.autoSize) {
				// sprited resources will know their dimensions immediately
				if (this._img.getWidth() > 0 && this._img.getHeight() > 0) {
					this.autoSize();
				} else {
					// non-sprited resources need to load first
					this._img.doOnLoad(this, 'autoSize');
				}
			}
			this._img.doOnLoad(this, 'needsRepaint');
		}
	};

	/**
	 * Pass a function to load once the Image object is loaded, or a list of
	 * arguments that call lib.Callback::run() implicitly.
	 */
	
	this.doOnLoad = function () {
		if (arguments.length == 1) {
			this._img.doOnLoad(this, arguments[0]);
		} else {
			this._img.doOnLoad.apply(this._img, arguments);
		}
		return this;
	};

	/**
	 * Automatically resize the view to the size of the image.
	 */
	
	this.autoSize = function () {
		if (this._img) {
			this.style.width = this._img.getWidth();
			this.style.height = this._img.getHeight();

			if (this.style.fixedAspectRatio) {
				this.style.updateAspectRatio();
			}
		}
	}

	/**
	 * Get original width of the Image object.
	 */
	
	this.getOrigWidth = this.getOrigW = function () {
		return this._img.getOrigW();
	};

	/**
	 * Get original height of the Image object.
	 */

	this.getOrigHeight = this.getOrigH = function () {
		return this._img.getOrigH();
	};

	/**
	 * Render this image onto a canvas.
	 */

	this.render = function (ctx) {
		if (!this._img) { return; }

		var s = this.style;
		var w = s.width;
		var h = s.height;
		this._img.render(ctx, 0, 0, w, h);
	}

	/**
	 * Return a human-readable tag for this view.
	 */

	var _loc = window.location.toString();
	var _host = window.location.hostname;
	
	this.getTag = function () {
		var tag;
		if (this._img) {
			var url = this._img.getOriginalURL();
			if (this._cachedTag && url == this._cachedTag.url) {
				tag = this._cachedTag.tag;
			} else {
				var uri = URI.relativeTo(url, _loc);
				var host = uri.getHost();
				tag = util.path.splitExt(uri.getFile()).basename + (host && host != _host ? ':' + host : '');

				this._cachedTag = {
					url: url,
					tag: tag
				};
			}
		};

		return (tag || '') + ':ImageView' + this.uid;
	}
});

