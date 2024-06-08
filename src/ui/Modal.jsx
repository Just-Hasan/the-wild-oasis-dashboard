import styled from "styled-components";
import PropTypes from "prop-types";
import { HiXMark } from "react-icons/hi2";
import { createPortal } from "react-dom";
import { createContext, useContext, useState } from "react";
import useCloseModal from "../hooks/useCloseModal";
const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

// 1. Create the context variable
const ModalContext = createContext();

export default function Modal({ children }) {
  const [openName, setOpenName] = useState("");
  const close = () => setOpenName("");
  const open = setOpenName;

  const ModalContextValue = {
    openName,
    close,
    open,
  };

  // 2. Wrap the received children in the context provider,
  // so it can use or access the value of the parent component
  return (
    <ModalContext.Provider value={ModalContextValue}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ opens: opensModal, renderButton }) {
  const { open } = useContext(ModalContext);
  // open = setOpenName
  /*
  since the renderButton is a function that returns a Button,
  using the prop like below will create the Button.
  We then pass a function as an argument to the renderButton.
  And the function we pass as an argument is the one the Button use
  in its onClick (see the add cabin component)
  */
  return renderButton(() => open(opensModal));
}

function Window({ name, renderForm }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useCloseModal(close);
  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        {/* <div>{cloneElement(children, { onCloseModal: close })}</div> */}
        <div>{renderForm(close)}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

Window.propTypes = {
  children: PropTypes.any,
  onClose: PropTypes.any,
  name: PropTypes.any,
  renderForm: PropTypes.func,
};

Modal.propTypes = {
  children: PropTypes.any,
};

Open.propTypes = {
  children: PropTypes.any,
  opens: PropTypes.string,
};
