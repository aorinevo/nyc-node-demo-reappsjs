module.exports = function( data ){
return `define(['jquery',
        '${data.projName}/${data.brand}/pages/${data.componentName}/${data.componentName}View',
        'util/Context',
        'jasmine-jquery'
    ],
function($, ${data.componentName}View, Context) {
  describe("${data.brand} Test Suite for ${data.componentName} Component", function() {
    it("Displays last statement balance", function() {
      it("First Test", function() {
          expect(1).toEqual(1);
      });
    });
  });
});`
}