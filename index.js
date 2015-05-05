var featurecollection = require('turf-featurecollection');
var polygon = require('turf-polygon');
var earcut = require('earcut');

/**
* Function that process a {@link Polygon} and make a tin constrained to it using [earcut.js]{@link https://github.com/mapbox/earcut}
* @requires earcut.js
* @param {Feature<(Polygon)>} poly - single Polygon Feature
* @return {FeatureCollection<(Polygon)>} 
*/
module.exports = function(poly){
  if (!poly.geometry || poly.geometry.type !== 'Polygon' ) throw('input must be a polygon');

  var data = flattenCoords(poly.geometry.coordinates);
  var dim = 2;
  var result = earcut(data.vertices, data.holes, dim);

  var fc = featurecollection([]);
  var vertices = [];
  result.forEach(function(vert, i){
    var index = result[i];
    vertices.push([data.vertices[index * dim], data.vertices[index * dim + 1]]);
  });

  for (var i = 0; vertices && i < vertices.length; i += 3) {
    var coords = vertices.slice(i, i + 3);
    coords.push(vertices[i]);
    fc.features.push(polygon([coords]));
  }
  
  return fc;
};

function flattenCoords(data) {
    var dim = data[0][0].length,
        result = {vertices: [], holes: [], dimensions: dim},
        holeIndex = 0;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }

    return result;
}