const webpack = require('webpack')

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "stream": require.resolve("stream-browserify"),
        "url": require.resolve("url/"),
        "assert": require.resolve("assert/"),
        "crypto": require.resolve("crypto-browserify")
      }

      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG)
        }),
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer']
        })
      ]

      return webpackConfig
    }
  }
} 