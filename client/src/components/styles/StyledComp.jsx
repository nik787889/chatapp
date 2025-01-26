
import { Link as LinkComp } from "react-router-dom";
import { keyframes, Skeleton, styled } from "@mui/material";
import { grayColor } from "../../constants/color";


const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "react(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
})


const Link = styled(LinkComp)`
  text-decoration: none;
  color: black;
  padding: 1rem;
  &:hover {
    background-color: rgba(0,0,0,0.1);
  }
`;


const InputBox = styled("input")`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 3rem;
  border-radius: 1.5rem;
  background-color: ${grayColor};
`;


const SearchField = styled("input")`
  width: 20vmax;
  border: none;
  outline: none;
  padding: 1rem 1rem;
  border-radius: 1.5rem;
  font-size: 1.1rem;
  background-color: ${grayColor};
`;


const CurveButton = styled("button")`
  cursor: pointer;
  border: none;
  outline: none;
  padding: 1rem 2rem;
  border-radius: 1.5rem;
  font-size: 1.1rem;
  color: white;
  background-color: black;
  &:hover {background-color: rgba(0,0,0,0.8)}
`;

const bounceAnimation = keyframes`
0% { transform: scale(1); }
50% { transform: scale(1.5); }
100% { transform: scale(1); }
`

const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bounceAnimation} 1s infinite`,
}))


export { VisuallyHiddenInput, Link, InputBox, SearchField, CurveButton, BouncingSkeleton }
