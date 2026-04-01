import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';

export default defineConfig({
  plugins: [pluginReact(), pluginSvgr()],
  server: {
    port: Number(process.env.PORT) || 3030,
  },
  html: {
    title: 'ThinkData',
    favicon: './public/favicon.ico',
  },
  output: {
    manifest: true,
  },
});
