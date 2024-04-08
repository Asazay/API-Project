import { useRef, createContext, useState, useContext } from "react";
import {}
import './Modal.css';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);

  const contextValue = {
    modalRef,
    modalContent,
    setModalContent,
    setOnModalClose,
    closeModal,
  };

  const closeModal = () => {
    setModalContent(null);

    if (typeof onModalClose === "function") {
      setOnModalClose(null);
      onModalClose();
    }
  };

  return (
    <>
      <ModalContext.Provider>{children}</ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
};

export const Modal = () => {
  const { modalRef, modalContent, closeModal } = useContext(ModalContext);

  if (!modalRef || !modalRef.current || !modalContent) {
    return null;
  }

  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={() => closeModal()}></div>
      <div id="modal-content">{modalContent}</div>
    </div>,
    modalRef.current
  );
};
