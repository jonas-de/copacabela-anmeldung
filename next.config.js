require('dotenv').config();

module.exports = {
  publicRuntimeConfig: {
    SERVER_URL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  },
  images: {
    domains: [process.env.PAYLOAD_PUBLIC_SERVER_URL],
  },
};
