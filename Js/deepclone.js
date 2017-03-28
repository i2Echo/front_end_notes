
const deepClone = function(obj) {
  let buf;
  if(obj instanceof Array) {
    buf = [];

    for(let i=0, len=obj.length; i<len; i++) {
      buf[i] = deepClone(obj[i]);
    }
    return buf;
  }else if(obj instanceof Object) {
    buf = {};
    for(let key in obj){
      buf[key] = deepClone(obj[key]);
    }
    return buf;
  }else {
    return obj;
  }
}