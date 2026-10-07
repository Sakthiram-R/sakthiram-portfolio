import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',

  basePath: process.env.NODE_ENV === 'production'
    ? '/sakthiram-portfolio'
    : '',

  assetPrefix: process.env.NODE_ENV === 'production'
    ? '/sakthiram-portfolio/'
    : '',

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