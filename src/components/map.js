import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import rd3 from 'react-d3-library';

const RD3Component = rd3.Component;

class MapBox extends Component {
 constructor () {
   super(...arguments);
   this.state = { d3: '' };
 }
  zoomed (features) {
    return () => {
      features.attr('transform', `translate(${ this.props.zoom.translate() })scale(${ this.props.zoom.scale() })`)
        .selectAll('path')
        .style('stroke-width', 1 / this.props.zoom.scale() + 'px');
    };  
  }
  generateSVG () {
    let { path, color, zoom, data } = this.props;
    let child = document.createElement('div');
    let svg = d3.select(child).append('svg')
      .attr('width', '100%')
      .attr('height', '100%');
    let features = svg.append('projectionsvg')
      .attr('class', 'features');
    zoom.on('zoom', this.zoomed(features));
    svg.call(zoom);
    features.selectAll("path")
      .data(topojson.feature(data, data.objects.collection).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", function(d) { return (typeof color(d.properties.permits) === "string" ? color(d.properties.permits) : ""); });
    this.setState({ d3: child });
  }
  componentDidMount () {
    if (this.props.zoom) this.generateSVG();
  }
  componentWillReceiveProps () {
    if (this.props.zoom) this.generateSVG();
  }
  render () {
    let child = (typeof this.state.d3 === 'object') ? <RD3Component data={ this.state.d3 } /> : 'Loading...';
    return (
      <div style={{height:'100%',width:'100%'}}>
        { child }
      </div>
    );
  }
};

export default MapBox