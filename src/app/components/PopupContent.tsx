import React from "react";

interface PopupContentProps {
  name: string;
  temperature: number;
}

const PopupContent: React.FC<PopupContentProps> = ({ name, temperature }) => {
  return (
    <div className="p-2 text-white bg-[#18453b] rounded shadow-lg">
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-sm">Temperature: {temperature}°F</p>
    </div>
  );
};

export default PopupContent;
