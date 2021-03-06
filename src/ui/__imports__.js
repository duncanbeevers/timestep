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
 * package timestep;
 *
 * Resolve what packages to import with timestep.
 */

exports.getDeviceImports = function (device) {
	// runtime*/device/__imports__.js in will handle the remaining imports
	if (device == 'browser') {
		logger.log('Including browser runtime.');
		return ['platforms.browser.initialize'];
	} else if (device == 'native') {
		logger.log('Including native runtime.');
		return ['platforms.native.initialize'];
	}

	return [];
}


exports.getBackendImports = function (backend) {
	if (backend == 'dom') {
		return [
			'.backend.dom.animate',
			'.backend.dom.ImageView',
			'.backend.dom.StackView',
			'.backend.dom.TextView',
			'.backend.dom.ViewBacking'
		];
	}

	if (backend == 'canvas') {
		return [
			'.backend.canvas.animate',
			'.backend.canvas.ImageView',
			'.backend.canvas.TextView',
			'.backend.canvas.ViewBacking',
			'.backend.canvas.ViewDebugger'
		];
	}

	return [];
}

exports.resolve = function (env, opts) {
	var imports = [];
	var add = function (list) { imports = imports.concat(list); };

	add(exports.getDeviceImports(env));

	// backend-method
	var backend = opts.dynamic && opts.dynamic.timestepBackend;
	if (backend) {
		add(exports.getBackendImports(backend));
	} else if (env == 'browser') {
		add(exports.getBackendImports('dom'));
		add(exports.getBackendImports('canvas'));
	} else {
		add(exports.getBackendImports('canvas'));
	}
	
	return imports;
}

