import React from "react";
import Svg, { Path } from "react-native-svg";
function MinusIcon() {
  return (
    <Svg width="20" height="20" fill="none" viewBox="0 0 28 28">
      <Path
        stroke="#E83F5B"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2z"
      ></Path>
      <Path
        fill="#E83F5B"
        d="M7.571 15.071a1.071 1.071 0 010-2.143H20.43a1.071 1.071 0 010 2.143H7.57z"
      ></Path>
    </Svg>
  );
}

export default MinusIcon;
