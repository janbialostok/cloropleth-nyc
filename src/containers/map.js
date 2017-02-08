import React, { Component } from 'react';
import { Container, Content } from 're-bulma';
import geodata from '../bin/topo';
import * as d3 from 'd3';
import Map from '../components/map';

class MapContainer extends Component {
	constructor () {
		super(...arguments);
		this.state = {};
	}
	generateProjection () {
		let projection = d3.geo.conicEqualArea()
	    .scale(77401.4488445439)
	    .center([-73.88226918388682, 40.86712450078746])
	    .parallels([40.49613398761198, 40.91553277700521])
	    .rotate([73.88226918388682])
	    .translate([-66491.99580426603, -29829.255772850523]);
	  let path = d3.geo.path().projection(projection);
	  let color = d3.scale.quantize()
	    .domain([0,250])
	    .range(d3.range(11).map(function(i) { return "q" + i + "-11"; }));
	  let zoom = d3.behavior.zoom()
    	.scaleExtent([1, Infinity])
    	.on("zoom",zoomed);
    this.setState({ projection, color, zoom });
	}
	componentWillMount () {
		this.generateProjection();
	}
	render () {
		return (
			<Map {...this.state}/>
		);
	}
};