'use strict';

const stylableLoaderOptions = {injectFileCss: true};

module.exports = () => {
  return {
    client: [
      {
        test: /\.st\.css$/,
        loader: 'stylable-integration/webpack-loader',
        options: stylableLoaderOptions
      }
    ],
    specs: {
      test: /\.st\.css$/,
      use: [
        {
          loader: 'stylable-integration/webpack-loader',
          options: stylableLoaderOptions
        }
      ]
    }
  };
};
