import path from 'path';

export default (): any => ({
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			formats: ['esm', 'cjs'],
			fileName: mode => `${mode}/index.js`,
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: [],
		},
	},
});
