const params = {
	floatPrecision: 2
};

export default {
	plugins: [
		...[
			'removeDoctype',
			'removeXMLProcInst',
			'removeEditorsNSData',
			'removeMetadata',
			'removeComments',
			'removeViewBox',
			'removeDesc',
			'removeTitle',
			'removeUselessDefs',
			'removeEmptyAttrs',
			'cleanupIDs'
		].map((name) => ({
			active: true,
			name
		})),
		...[
			'cleanupNumericValues',
			'convertPathData',
			'convertTransform',
			'cleanupListOfValues'
		].map((name) => ({
			active: true,
			name,
			params
		}))
	]
};
