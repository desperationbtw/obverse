const _ = require('underscore');

function setDefaults(options, defaults){
  return _.defaults(options, defaults);
}

export {
  setDefaults
};
