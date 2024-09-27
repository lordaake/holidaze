// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import favicon from 'vite-plugin-favicon';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    favicon({
      logo: './public/holidaze-logo.png',
      outputPath: 'assets/favicons',
      inject: true,
      favicons: {
        appName: 'Holidaze',
        appDescription: 'Discover and book your perfect holiday venues with Holidaze.',
        developerName: 'Tord Åke Larsson',
        developerURL: 'https://holidaze.com/',
        background: '#ffffff',
        theme_color: '#4a90e2',
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          windows: false,
          yandex: false,
        },
      },
    }),
  ],
}));
