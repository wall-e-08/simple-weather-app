import WindIcon from "./WindIcon";
import React from "react";

interface HourlyCardProps {
  time: string;
  temp: number;
  label: string;
  rotation: number;
  speed: number;
}

const HourlyCard: React.FC<HourlyCardProps> = ({ time, temp, label, rotation, speed }) => {
  return (
    <div className="p-2 md:p-3 bg-white rounded-xl border border-gray-100 flex-1 card">
      <div className="text-xs md:text-sm small-muted">{time}</div>
      <div className="text-lg md:text-2xl font-light mt-1 md:mt-2">{temp}°</div>
      <div className="text-[10px] md:text-xs small-muted mt-1">{label}</div>
      <WindIcon rotation={rotation} speed={speed}/>
    </div>
  )
}

export default HourlyCard;