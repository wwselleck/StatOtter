function header(text){
  console.log('====================================');
  console.log('= ' + text );
  console.log('====================================');
}

function headerSmall(text){
  console.log('-------------------');
  console.log('- ' + text);
  console.log('-------------------');
}

module.exports = {
  header: header,
  headerSmall: headerSmall
}
