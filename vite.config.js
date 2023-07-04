import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/css/start-game.css',
                'resources/css/fontawesome.css',
                'resources/scss/puzzle.scss',
                'resources/scss/bootstrap.scss',
                'resources/js/app.js',
                'resources/js/start-game.js',
                'resources/js/game.js',
                'resources/js/piece.js',
                'resources/js/const.js',
                'resources/js/dropzone.js',
                'resources/scss/dropzone.scss',
                'resources/js/choose-image.js',
                'resources/js/toastr.js',
                'resources/scss/toastr.scss',
            ],
            refresh: true,
        }),
    ],
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
            '~@resources': path.resolve(__dirname, 'resources/'),
            '~dropzone': path.resolve(__dirname, 'node_modules/dropzone'),
            '~toastr': path.resolve(__dirname, 'node_modules/toastr'),
        }
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'dist/css/[name].css',
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    build: {
        chunkSizeWarningLimit: 1600,
    },
});
