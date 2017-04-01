module.exports = function( data ){
  if( data.brand === 'common' ){
    return `#some-cool-common-style-rule{
}`;
  } else {
    return `@import "../../../common/components/${data.componentName}/${data.componentName}";
#some-cool-style-rule {
}`}
};