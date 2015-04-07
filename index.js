var 
	fc = require('turf-featurecollection'),
	pol = require('turf-polygon'),
	earcut = require('earcut');

/**
*	Function that process a {@link Polygon} and make a tin constrained to it using [earcut.js]{@link https://github.com/mapbox/earcut}
* @requires	earcut.js
* @param {Feature<(Polygon)>} poly - single Polygon Feature
* @return {FeatureCollection<(Polygon)>} 
* @author	Abel Vázquez
* @version 1.0.0
*/
turf.earcut = function(poly){

	if (poly.geometry === void 0 || poly.geometry.type !== 'Polygon' ) throw('"earcut" only accepts polygon type input');

	var 
		t = earcut(poly.geometry.coordinates),
		p,
		f=[];

		for (var i=0; i<t.length-2; i+=3){
			p = [t[i], t[i+1],t[i+2], t[i]];
			f.push(pol([p]));
		}
		
	return fc(f);
	
}