var {_hash} = require("./lib");

const PROCESSOR_FAMILY = 'chair';
exports.PROCESSOR_FAMILY = PROCESSOR_FAMILY;
exports.PROCESSOR_NAMESPACE = _hash(PROCESSOR_FAMILY).substring(0,6);
