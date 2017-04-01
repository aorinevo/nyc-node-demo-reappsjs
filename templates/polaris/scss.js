module.exports = function( data ){
  if( data.brand === 'common' ){
    return `#some-cool-common-style-rule{
}`;
  } else {
    return `@import "../../common/${data.componentName}";
#some-cool-style-rule {
}`}
};