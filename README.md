# wjsjtu-reactjs  v0.0.1 
## Getting Started
```shell
npm install wjsjtu-reactjs --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('wjsjtu-reactjs ');
```

### Options

#### wrapper
Type: `Boolean` 
Default: `false`

Turn on or off wrapper with default options. If an `wrapper` is specified, it uses `replaceWord` to replace `React.createElement` compiled code, for it often appears in compiled code, this will make the size of minified files smaller.

#### replaceWord
Type: `String`
Default: `"__ReactCreateElement"`

It will generate `"(function(React, window){var "` + `replaceWord` + `" = React.createElement;" + result + "})(React, window);"` ,which wraps the code with closure to make it works better when using minify tools.

### Usage examples

#### Basic compression

This configuration will just use `react-tools` to transfer files using the default options.

```js
// Project configuration.
grunt.initConfig({
  reactjs: [{
    src: ['src/input1.jsx', 'src/input2.jsx'],
    dest: 'dest/output.min.js'
  }]
});
```


Specify `wrapper: false` to wrap the compiled code.

```js
// Project configuration.
grunt.initConfig({
  reactjs: {
     main:{
      files: [{
        src:"src/jsx/datepicker.jsx",
        dest: "dist/js/datepicker.js"
      }],
      options: {
        wrapper: true
      }
    }
 }
});
```
