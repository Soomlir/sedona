const { getPosthtmlW3c } = require('pineglade-w3c');
// const minifyHtml = require('htmlnano');

const devMode = process.env.NODE_ENV === 'development';
const plugins = [
	getPosthtmlW3c({
		exit: !devMode,
		forceOffline: true,
		getSourceName(filename) {
			return filename
				.replace(/^.*pages(\\+|\/+)(.*)\.twig$/, '$2')
				.replace(/\\/g, '/');
		}
	})
];

// Изменение настроек в production-режиме
// if (!devMode) {
// plugins.push(minifyHtml({ collapseWhitespace: 'aggressive' }));
// }

module.exports = { plugins };
