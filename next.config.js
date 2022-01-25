require('dotenv').config();
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const { webpack } = require('next/dist/compiled/webpack/webpack');


module.exports = {
  publicRuntimeConfig: {
    SERVER_URL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  },
  images: {
    domains: [
      'localhost',
      // Your domain(s) here
    ],
  }
};
