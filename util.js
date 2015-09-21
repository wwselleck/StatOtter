function replaceAll(str, map){
  var rgx = new RegExp(Object.keys(map).join('|'), "gi");
  return str.replace(rgx, function(match){
    return map[match.toLowerCase()];
  });
}

module.exports = {
  replaceAll: replaceAll
}
