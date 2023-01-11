const path = require("path");

module.exports = {
  webpack: {
    configure: (config, { env, paths }) => {
      config.resolve.alias["@CHANGELOG.md"] = path.join(
        __dirname,
        "CHANGELOG.md"
      );
      return config;
    },
  },
};
