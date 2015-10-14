function headerLarge(text){
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  console.log('>' + text);
  console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
  console.log();
}

function headerMedium(text){
  console.log('====================================');
  console.log('= ' + text );
  console.log('====================================');
  console.log();
}

function headerSmall(text){
  console.log('-------------------');
  console.log('- ' + text);
  console.log('-------------------');
  console.log();
}

module.exports = {
  headerLarge: headerLarge,
  headerMedium: headerMedium,
  headerSmall: headerSmall
}
