module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-px2rem": {
      remUnit: 37.5  //转换为rem的基准px
      //其他配置选项自行查文档
    }
  }
}