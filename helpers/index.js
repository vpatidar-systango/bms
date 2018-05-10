module.exports.roleCheck =  function (role) {
    if (role == 0) return true;
    else return false;
  }

module.exports.serial = function(i){
    return ++i;
  }

module.exports.changeColor = function(active){
    if(active){
      return 'checked';
    }else{
      return '';
    }
  }

module.exports.disableReInvite = function(active){
    if(active) return 'disabled';
    else return '';
  }