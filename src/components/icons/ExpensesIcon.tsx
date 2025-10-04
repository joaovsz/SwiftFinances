import React from "react";
import Svg, { Path } from "react-native-svg";

interface ExpensesIconProps {
  color?: string;
  size?: number;
}

function ExpensesIcon({ color = "#FE0000", size = 32 }: ExpensesIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M16 29.333c7.364 0 13.333-5.97 13.333-13.333 0-7.364-5.97-13.333-13.333-13.333C8.636 2.667 2.667 8.637 2.667 16c0 7.364 5.97 13.333 13.333 13.333z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <Path
        d="M10.667 16L16 21.333 21.333 16M16 10.667v10.666"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Svg>
  );
}

export default ExpensesIcon;
