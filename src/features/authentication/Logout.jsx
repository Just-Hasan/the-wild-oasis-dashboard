import { ButtonIcon } from "../../ui/ButtonIcon";
import { useLogout } from "./useLogout";
import { SpinnerMini } from "../../ui/SpinnerMini";

import { IoIosLogOut } from "react-icons/io";
// import { H1ArrowRightonRectangle } from "react-icons";
export default function Logout() {
  const { logout, isLogout } = useLogout();
  return (
    <ButtonIcon onClick={logout} disabled={isLogout}>
      {/* <H1ArrowRightonRectangle /> */}
      {!isLogout ? <IoIosLogOut /> : <SpinnerMini></SpinnerMini>}
    </ButtonIcon>
  );
}
