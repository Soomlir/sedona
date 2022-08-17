import TerserPlugin from 'terser-webpack-plugin';

const mode = process.env.NODE_ENV;

const options = {
	mode,
	output: {
		filename: '[name].min.js'
	}
};

if (mode === 'production') {
	options.optimization = {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: false,
				parallel: true,
				terserOptions: {
					format: {
						comments: false
					}
				}
			})
		]
	};
}

export default options;
