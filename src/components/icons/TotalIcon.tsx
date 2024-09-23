import React from "react";
import Svg, { Path } from "react-native-svg";

function TotalIcon() {
  return (
    <Svg width="32" height="32" fill="none" viewBox="0 0 32 32">
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 1.333v29.334M22.667 6.667h-10a4.667 4.667 0 100 9.333h6.666a4.667 4.667 0 010 9.333H8"
      ></Path>
    </Svg>
  );
}

export default TotalIcon;
