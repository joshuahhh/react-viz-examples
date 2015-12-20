import React from 'react';
import {G} from 'react-viz';
import {AnimationLoop} from 'react-viz';
import Select from 'react-select';

import './EpicyclicGearing.css';
import 'react-select/dist/react-select.css';

var width = 960,
    height = 500,
    radius = 80,
    x = Math.sin(2 * Math.PI / 3),
    y = Math.cos(2 * Math.PI / 3),
    speed = 4;

function gear(d) {
  var n = d.teeth,
      r2 = Math.abs(d.radius),
      r0 = r2 - 8,
      r1 = r2 + 8,
      r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 20) : 20,
      da = Math.PI / n,
      a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0),
      i = -1,
      path = ["M", r0 * Math.cos(a0), ",", r0 * Math.sin(a0)];
  while (++i < n) path.push(
      "A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0),
      "L", r2 * Math.cos(a0), ",", r2 * Math.sin(a0),
      "L", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
      "A", r1, ",", r1, " 0 0,1 ", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
      "L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0),
      "L", r0 * Math.cos(a0), ",", r0 * Math.sin(a0));
  path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
  return path.join("");
}

let modes = [
  {value: 'annulus', label: 'Annulus', radius1: radius * 5},
  {value: 'planets', label: 'Planets', radius1: Infinity},
  {value: 'sun', label: 'Sun', radius1: -radius},
];

let EpicyclicGearing = React.createClass({
  getInitialState() {
    return {
      selectedMode: modes[0],
      angle: 0,
      offset: 0,
    };
  },

  setNewMode(newMode) {
    let {offset, angle, selectedMode: {radius1: oldRadius1}} = this.state;
    let newOffset = offset + angle / oldRadius1 - angle / newMode.radius1;
    this.setState({selectedMode: newMode, offset: newOffset});
  },

  render() {
    let {selectedMode: {value, radius1}, angle, offset} = this.state;

    return (
      <div style={{position: 'relative'}}>
        <div style={{position: 'absolute', width: 200}}>
          <Select value={value} options={modes} onChange={this.setNewMode}/>
        </div>
        <svg width={width} height={height}>
          <G x={width / 2} y={height / 2} rotate={angle / radius1 + offset} scale={.55}>
            <Gear angle={angle} className='annulus' teeth={80} radius={-radius * 5} annulus={true} />
            <Gear angle={angle} className='sun' teeth={16} radius={radius} />
            <Gear angle={angle} className='planet' teeth={32} radius={-radius * 2}
              x={0} y={-radius * 3} />
            <Gear angle={angle} className='planet' teeth={32} radius={-radius * 2}
              x={-radius * 3 * x} y={-radius * 3 * y} />
            <Gear angle={angle} className='planet' teeth={32} radius={-radius * 2}
              x={radius * 3 * x} y={-radius * 3 * y} />
          </G>
        </svg>
        <AnimationLoop step={(elapsed) => {
            elapsed && this.setState({angle: this.state.angle + elapsed * speed});
        }} />
      </div>
    );
  },
});

let Gear = ({angle, className, teeth, radius, annulus, x, y}) =>
  <G className={className} rotate={angle / radius} x={x} y={y}>
    <path d={gear({teeth, radius, annulus})} />
  </G>;

export default EpicyclicGearing;
