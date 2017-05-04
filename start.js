require("babel-polyfill")
require("babel-register")({
  presets: ["es2015", "es2017"]
})
require("./main")