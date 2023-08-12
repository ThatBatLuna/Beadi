const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

const changelog_file = path.resolve(__dirname, "../CHANGELOG.md");

module.exports = {
  webpack: {
    configure: (config, { env, paths }) => {
      config.plugins = [
        ...config.plugins,
        new webpack.DefinePlugin({
          BEADI_CHANGELOG: webpack.DefinePlugin.runtimeValue(
            () => {
              const file = fs.readFileSync(changelog_file).toString();
              return JSON.stringify(file);
            },
            {
              fileDependencies: [changelog_file],
            }
          ),
        }),
      ];
      return config;
    },
  },
};
