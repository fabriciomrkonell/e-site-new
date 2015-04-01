var jqc = require("../"),
  should = require("should"),
  File = require("gulp-util").File,
  Buffer = require("buffer").Buffer;

require("mocha");

describe("gulp-jquery-closure", function() {
  describe("jqc()", function() {
    var newLine = '\n',
      content = newLine + "data" + newLine;

    test({newLine: newLine}, ";(function ($) {" + content + "})(jQuery);");
    test({newLine: newLine, $: false}, ";(function () {" + content + "})();");
    test({newLine: newLine, window: true}, ";(function ($, window) {" + content + "})(jQuery, window);");
    test({newLine: newLine, document: true}, ";(function ($, document) {" + content + "})(jQuery, document);");
    test({newLine: newLine, undefined: true}, ";(function ($, undefined) {" + content + "})(jQuery);");
    test({newLine: newLine, window: true, document: true, undefined: true}, ";(function ($, window, document, undefined) {" + content + "})(jQuery, window, document);");
    test({newLine: newLine, $: "jq", window: "w", document: "d", undefined: "undef"}, ";(function (jq, w, d, undef) {" + content + "})(jQuery, window, document);");

    function test(options, result) {
      var stream = jqc(options);
      it("should enclose with dedicated options", function (done) {

        stream.on("data", function (file) {
          String(file.contents).should.equal(result);
          //Buffer.isBuffer(file.contents).should.equal(true);
          done();
        });

        stream.write(new File({
          cwd: __dirname,
          base: "/",
          path: "data.js",
          contents: new Buffer("data")
        }));

        stream.end();
      });
    }

  });
});
