import React from "react";
import { MoveUp, Circle } from "lucide-react";


const WindIcon = ({ rotation, speed }: {rotation: number, speed: number}) => {
  return (
    <div
      className="relative my-3 flex items-center justify-center"
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
      }}
    >
      <Circle size={35} strokeWidth={1} />
      <span
        className="absolute flex items-center justify-center text-sm"
        style={{
          transform: `rotate(-${rotation}deg)`,
          transformOrigin: "center center",
        }}
      >{speed}</span>
      <MoveUp size={15} strokeWidth={2} className={`absolute -top-[11px]`}/>
    </div>
  )
}

export default WindIcon;
