
var Favorite_possibleTypes = ['Favorite']
module.exports.isFavorite = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isFavorite"')
  return Favorite_possibleTypes.includes(obj.__typename)
}



var Mutation_possibleTypes = ['Mutation']
module.exports.isMutation = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isMutation"')
  return Mutation_possibleTypes.includes(obj.__typename)
}



var Project_possibleTypes = ['Project']
module.exports.isProject = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isProject"')
  return Project_possibleTypes.includes(obj.__typename)
}



var Query_possibleTypes = ['Query']
module.exports.isQuery = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isQuery"')
  return Query_possibleTypes.includes(obj.__typename)
}



var Strategie_possibleTypes = ['Strategie']
module.exports.isStrategie = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isStrategie"')
  return Strategie_possibleTypes.includes(obj.__typename)
}



var User_possibleTypes = ['User']
module.exports.isUser = function(obj) {
  if (!obj || !obj.__typename) throw new Error('__typename is missing in "isUser"')
  return User_possibleTypes.includes(obj.__typename)
}
