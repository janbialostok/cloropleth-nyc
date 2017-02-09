import React, { Component } from 'react';
import { Container, Content } from 're-bulma';
import geodata from '../bin/topo';
import * as d3 from 'd3';
import MapBox from '../components/map';

class MapContainer extends Component {
	generateProjection (min, max) {
		console.log('generating projection');
		min = (typeof min === 'number' && min < max) ? min : 0;
		max = (typeof max === 'number' && max > min) ? max : 250;
		let projection = d3.geo.conicEqualArea()
			.scale(77401.4488445439)
			.center([-73.88226918388682, 40.86712450078746])
			.parallels([40.49613398761198, 40.91553277700521])
			.rotate([73.88226918388682])
			.translate([-66491.99580426603, -29829.255772850523]);
	  let path = d3.geo.path().projection(projection);
	  let color = d3.scale.quantize()
			.domain([min, max])
			.range(d3.range(11).map(function(i) { return "q" + i + "-11"; }));
	  let zoom = d3.behavior.zoom()
			.scaleExtent([1, Infinity]);
		let tpjs = Object.assign({}, geodata);
		tpjs.objects = Object.assign({}, tpjs.objects);
		let collections = Object.assign({}, tpjs.objects.collection);
		collections.geometries = collections.geometries.map(geo => {
			if (geo.properties.permits > max) geo.properties.permits = max;
			return geo; 
		});
		tpjs.objects.collections = collections;
	  return { projection, color, zoom, range: [min, max], tpjs, path };
	}
	render () {
		let properties = this.generateProjection();
		return (
			<Container>
				<Content>
					<MapBox projection={ properties.projection } path={ properties.path } color={ properties.color } zoom={ properties.zoom } data={ properties.tpjs } />
				</Content>
			</Container>
		);
	}
};

export default MapContainer;