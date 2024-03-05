const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
});
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule("images")
      .test(/\.(jpeg|jpg|png|gif|jfif)$/)
      .use("url-loader")
      .loader("url-loader")
      .options({
        limit: 10240, // 小于 10KB 的图片会被转为 base64 内联在代码中
        name: "img/[name].[hash:8].[ext]",
      });
  },
};
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    // Add a rule for .jfif files
    config.module
      .rule("jfif")
      .test(/\.jfif$/)
      .type("asset/resource");
  },
};
