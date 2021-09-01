import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

  const divStyle = {
    background: 'rgba(25, 25, 25, 0.15)',
  };
const WeeklyGraph = ({recent7dates, NofPIBbyDay, NofFMMbyDay, NofFBPbyDay, NofFBBbyDay}) =>{
    const data = [
      {
        name: recent7dates[6],
        "[\u00B9\u00B9C]PIB": NofPIBbyDay[6],
        "[\u00B9\u2078F]FMM": NofFMMbyDay[6],
        "[\u00B9\u2078F]FBP": NofFBPbyDay[6],
        "[\u00B9\u2078F]FBB": NofFBBbyDay[6],
      },
      {
        name: recent7dates[5],
        "[\u00B9\u00B9C]PIB": NofPIBbyDay[5],
        "[\u00B9\u2078F]FMM": NofFMMbyDay[5],
        "[\u00B9\u2078F]FBP": NofFBPbyDay[5],
        "[\u00B9\u2078F]FBB": NofFBBbyDay[5],
      },
      {
        name: recent7dates[4],
        "[\u00B9\u00B9C]PIB": NofPIBbyDay[4],
        "[\u00B9\u2078F]FMM": NofFMMbyDay[4],
        "[\u00B9\u2078F]FBP": NofFBPbyDay[4],
        "[\u00B9\u2078F]FBB": NofFBBbyDay[4],
      },
      {
        name: recent7dates[3],
        "[\u00B9\u00B9C]PIB": NofPIBbyDay[3],
        "[\u00B9\u2078F]FMM": NofFMMbyDay[3],
        "[\u00B9\u2078F]FBP": NofFBPbyDay[3],
        "[\u00B9\u2078F]FBB": NofFBBbyDay[3],
      },
      {
        name: recent7dates[2],
        "[\u00B9\u00B9C]PIB": NofPIBbyDay[2],
        "[\u00B9\u2078F]FMM": NofFMMbyDay[2],
        "[\u00B9\u2078F]FBP": NofFBPbyDay[2],
        "[\u00B9\u2078F]FBB": NofFBBbyDay[2],
      },
      {
        name: recent7dates[1],
        "[\u00B9\u00B9C]PIB": NofPIBbyDay[1],
        "[\u00B9\u2078F]FMM": NofFMMbyDay[1],
        "[\u00B9\u2078F]FBP": NofFBPbyDay[1],
        "[\u00B9\u2078F]FBB": NofFBBbyDay[1],
      },
      {
        name: recent7dates[0],
        "[\u00B9\u00B9C]PIB": NofPIBbyDay[0],
        "[\u00B9\u2078F]FMM": NofFMMbyDay[0],
        "[\u00B9\u2078F]FBP": NofFBPbyDay[0],
        "[\u00B9\u2078F]FBB": NofFBBbyDay[0],
      }
    ];
    return(
        <LineChart width={871} height={500} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#292D30" vertical={false}/>
            <Line dataKey={`[\u00B9\u00B9C]PIB`} stroke="#b2f711" strokeWidth={3} activeDot={{ r: 5 }} dot={{fill:"#b2f711"}}/>
            <Line dataKey={`[\u00B9\u2078F]FMM`} stroke="#118AF7" strokeWidth={3} activeDot={{ r: 5 }} dot={{fill:"#118AF7"}}/>
            <Line dataKey={`[\u00B9\u2078F]FBP`} stroke="#1AFFD6" strokeWidth={3} activeDot={{ r: 5 }} dot={{fill:"#1AFFD6"}}/>
            <Line dataKey={`[\u00B9\u2078F]FBB`} stroke="#FF6D4C" strokeWidth={3} activeDot={{ r: 5 }} dot={{fill:"#118AF7"}}/>
            <XAxis dataKey="name" />
            <YAxis tickCount={8}/>
            <Tooltip contentStyle={divStyle}/>
            <Legend iconSize={15} iconType={'circle'}/>
        </LineChart>
    );
}
export default WeeklyGraph;