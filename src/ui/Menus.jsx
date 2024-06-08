import styled from "styled-components";
import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";
import { HiEllipsisVertical } from "react-icons/hi2";
// import { createPortal } from "react-dom";
import useCloseModal from "../hooks/useCloseModal";

const Menu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: absolute;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);
  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenusContext = createContext();

export default function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState(null);

  const close = () => setOpenId("");
  const open = setOpenId;

  const MenusContextValue = {
    openId,
    close,
    open,
    position,
    setPosition,
  };
  return (
    <MenusContext.Provider value={MenusContextValue}>
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id }) {
  const { openId, open, close, setPosition } = useContext(MenusContext);

  function handleClick(e) {
    e.stopPropagation();
    const rect = e.target.closest("button").getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });
    if (openId === "" || openId !== id) {
      open(id);
    } else {
      close();
    }
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

function List({ id, children }) {
  const { openId, close } = useContext(MenusContext);
  const ref = useCloseModal(close, false);
  if (openId !== id) return;
  return (
    <StyledList ref={ref} position={{ x: 30, y: 25 }}>
      {children}
    </StyledList>
  );
}

function Button({ children, icon, onClick }) {
  const context = useContext(MenusContext);
  function handleClick() {
    onClick?.();
    context?.close?.();
  }
  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <p style={{ display: "flex", width: "max-content" }}>{children}</p>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

Menus.propTypes = {
  children: PropTypes.any,
};

Toggle.propTypes = {
  children: PropTypes.any,
  id: PropTypes.number,
};

List.propTypes = {
  children: PropTypes.any,
  id: PropTypes.any,
};

Button.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
  icon: PropTypes.any,
};
