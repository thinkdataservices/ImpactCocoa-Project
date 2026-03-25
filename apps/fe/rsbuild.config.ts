import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';

export default defineConfig({
  plugins: [pluginReact(), pluginSvgr()],
  server: {
    port: 3000,
  },
  html: {
    title: 'plugilo.ai',
    favicon: './public/favicon.ico',
  },
  output: {
    manifest: true,
  },
});
