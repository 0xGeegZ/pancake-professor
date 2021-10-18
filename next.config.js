const { i18n } = require("./next-i18next.config");
const withImages = require("next-images");
const withPrismaPlugin = require("next-prisma-plugin");

module.exports = withImages(
  withPrismaPlugin({
    i18n,
    images: {
      domains: ["res.cloudinary.com", "img.youtube.com"],
    },
    // Necessary for next-on-netlify to work correctly
    target: process.env.NETLIFY ? "experimental-serverless-trace" : undefined,
    webpackDevMiddleware: (config) => {
      if (process.env.IS_DOCKER) {
        // "next dev" in Docker doesn't reliably pick up file changes, so we need to enable polling
        // see https://github.com/vercel/next.js/issues/6417 and https://webpack.js.org/configuration/watch/
        config.watchOptions = {
          ...config.watchOptions,
          poll: 500,
        };
      }
      return config;
    },
  })
);
