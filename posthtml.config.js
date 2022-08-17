const getSourceName = (filename) => filename.replace(/^.*pages(\\+|\/+)(.*)$/, '$2').replace(/\\/g, '/');
const exit = process.env.NODE_ENV !== 'development';

module.exports = () => {
	const plugins = [
		require('pineglade-w3c').getPosthtmlW3c({
			exit,
			forceOffline: true,
			getSourceName
		}),
		require('pineglade-config').getPosthtmlBemLinter({
			exit,
			getSourceName
		})
	];

	if (process.env.NODE_ENV === 'production') {
		const minify = require('htmlnano')({
			collapseWhitespace: 'aggressive',
			minifySvg: false
		});
		plugins.push(minify);
	}

	return { plugins };
};
