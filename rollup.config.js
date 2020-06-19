import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import svg from 'rollup-plugin-svg-import';
import replace from 'rollup-plugin-replace';
const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},

	plugins: [
    svg({ stringify: true }),
		svelte({
      customElement: true, 
			dev: !production,
			css: css => {
				css.write('public/build/bundle.css');
			}
      
			
		}),
		replace({
			'process.env.RECAPTCHA_KEY': '6LeeqKYZAAAAAIyB1tgUoVq2KE9dnmgNBrqSazUC'
		}),
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		
        postcss({
            extract: true,
            minimize: true,
            use: [
                ['sass', {
                    includePaths: [
                        './src/theme',     
                        './node_modules'
                    ]
                }]
            ]
        }),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false,
		chokidar: false
  }
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
