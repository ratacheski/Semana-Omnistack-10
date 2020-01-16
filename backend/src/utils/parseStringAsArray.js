module.exports = function parseStringASArray(arrayAsString){
    return arrayAsString.split(',').map(tech => tech.trim());
}