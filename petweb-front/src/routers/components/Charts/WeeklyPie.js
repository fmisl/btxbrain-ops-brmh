import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#b2f711', '#118AF7', '#1AFFD6', '#FF6D4C'];

export default class WeeklyPie extends PureComponent {
  render() {
    const data = [
      { name: `[\u00B9\u00B9C]PIB`, count: this.props.NofPIB },
      { name: `[\u00B9\u2078F]FMM`, count: this.props.NofFMM },
      { name: `[\u00B9\u2078F]FBP`, count: this.props.NofFBP },
      { name: `[\u00B9\u2078F]FBB`, count: this.props.NofFBB },
    ];
    return (
      <PieChart width={350} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={130}
          outerRadius={170}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="count"
          stroke="#383c41"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend  iconSize={15} iconType={'circle'} layout={'vertical'} height={1}/>
      </PieChart>
    );
  }
}