/*
 * wjsjtu-reactjs
 *
 * Copyright (c) 2014 Jason Wang, contributors
 * Licensed under the MIT license.
 * https://github.com/WJsjtu/wjsjtu-reactjs/blob/master/LICENSE-MIT
 */

module.exports = function(grunt) {
	'use strict';

	var path = require('path');
	var fs = require('fs');
	var chalk = require('chalk');
	var crypto = require('crypto');
	var reactTools = require('react-tools');
	grunt.registerMultiTask('reactjs', 'Transfer reactjs JSX files.',
	function() {

		var options = this.options({
			encoding: grunt.file.defaultEncoding,
			wrapper: false,
			prefix: "(function(React, window){",
			suffix: "})(React, window);",
			replaceWord: "__ReactCreateElement",
		});

		var writeOptions = {
			encoding: options.encoding
		};

		var dest;
		var isExpandedPair;
		var tally = {
			dirs: 0,
			files: 0,
		};

		this.files.forEach(function(filePair) {
			isExpandedPair = filePair.orig.expand || false;
			filePair.src.forEach(function(src) {
				if (detectDestType(filePair.dest) === 'directory') {
					dest = (isExpandedPair) ? filePair.dest: unixifyPath(path.join(filePair.dest, src));
				} else {
					dest = filePair.dest;
				}
				if (grunt.file.isDir(src)) {
					grunt.verbose.writeln('Creating ' + chalk.cyan(dest));
					grunt.file.mkdir(dest);
					tally.dirs++;
				} else {
					grunt.verbose.writeln('Transferring jsx ' + chalk.cyan(src) + ' -> ' + chalk.cyan(dest));
					var result = grunt.file.read(src, writeOptions);
					if (result) {
						result = reactTools.transform(result, {});
						if (options.wrapper) {
							result = result.replace(/React.createElement/g, options.replaceWord);
							result = options.prefix + "var " + options.replaceWord + " = React.createElement;\n" + result + options.suffix;
						}
						grunt.file.write(dest, result, writeOptions);
					}
					tally.files++;
				}
			});
		});

		if (tally.dirs) {
			grunt.log.write('Created ' + chalk.cyan(tally.dirs.toString()) + ' directories');
		}

		if (tally.files) {
			grunt.log.write((tally.dirs ? ', transferred ': 'Transferred ') + chalk.cyan(tally.files.toString()) + (tally.files === 1 ? ' file': ' files'));
		}

		grunt.log.writeln();
	});

	var detectDestType = function(dest) {
		if (grunt.util._.endsWith(dest, '/')) {
			return 'directory';
		} else {
			return 'file';
		}
	};

	var unixifyPath = function(filepath) {
		if (process.platform === 'win32') {
			return filepath.replace(/\\/g, '/');
		} else {
			return filepath;
		}
	};
};