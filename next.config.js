/* eslint-disable @typescript-eslint/no-var-requires */
const withImages = require('next-images')
const withPrismaPlugin = require('next-prisma-plugin')

const { i18n } = require('./next-i18next.config')

module.exports = withImages(
  withPrismaPlugin({
    i18n,
    images: {
      domains: ['res.cloudinary.com', 'img.youtube.com'],
    },
    // typescript: {
    //   // !! WARN !!
    //   // Dangerously allow production builds to successfully complete even if
    //   // your project has type errors.
    //   // !! WARN !!
    //   ignoreBuildErrors: true,
    // },
    // eslint: {
    //   // Warning: This allows production builds to successfully complete even if
    //   // your project has ESLint errors.
    //   ignoreDuringBuilds: true,
    // },
    // Necessary for next-on-netlify to work correctly
    target: process.env.NETLIFY ? 'experimental-serverless-trace' : undefined,
    webpackDevMiddleware: (pconfig) => {
      const config = pconfig
      if (process.env.IS_DOCKER) {
        // "next dev" in Docker doesn't reliably pick up file changes, so we need to enable polling
        // see https://github.com/vercel/next.js/issues/6417 and https://webpack.js.org/configuration/watch/
        config.watchOptions = {
          ...config.watchOptions,
          poll: 500,
        }
      }
      return config
    },
  })
)
