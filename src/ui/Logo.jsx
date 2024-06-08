import styled from "styled-components";
import logoLightMode from "../../public/logo-light.png";
import logoNightMode from "../../public/logo-dark.png";
import { useDarkMode } from "../hooks/useDarkMode";
const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;
`;

function Logo() {
  const { isDarkMode } = useDarkMode();
  const src = isDarkMode ? logoNightMode : logoLightMode;
  return (
    <StyledLogo>
      <Img src={src} alt="Logo" />
      {/* <img src={logo}></img> */}
    </StyledLogo>
  );
}

export default Logo;
