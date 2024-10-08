import React from "react";
import Svg, { Path } from "react-native-svg";
function IncomeIcon() {
  return (
    <Svg width="32" height="32" fill="none" viewBox="0 0 32 32">
      <Path
        stroke="#12A454"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 2.667C8.636 2.667 2.667 8.637 2.667 16c0 7.364 5.97 13.333 13.333 13.333 7.364 0 13.333-5.97 13.333-13.333 0-7.364-5.97-13.333-13.333-13.333z"
      ></Path>
      <Path
        stroke="#12A454"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21.333 16L16 10.667 10.667 16M16 21.333V10.667"
      ></Path>
    </Svg>
  );
}

export default IncomeIcon;
