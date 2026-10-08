import type { NextConfig } from 'next';
import {basePath} from './src/lib/base-path.mjs';

const config: NextConfig = {
  output: 'export',

  basePath,

  assetPrefix: basePath ? `${basePath}/` : '',

  distDir:
    process.env.NODE_ENV === 'development'
      ? '.next-dev'
      : '.next',

  images: {
    unoptimized: true,
  },

  devIndicators: false,
};

export default config;
