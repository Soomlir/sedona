export default {
	multipass: true,
	plugins: [
		...[
			'removeDoctype',
			'removeXMLProcInst',
			'removeEditorsNSData',
			'removeMetadata',
			'removeComments',
			'removeDesc',
			'removeTitle',
			'removeUselessDefs',
			'removeEmptyAttrs'
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
			params: {
				floatPrecision: 2
			}
		}))
	]
};
