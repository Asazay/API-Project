import { useModal } from "../../context/Modal";

export const OpenModalButton = ({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose,
}) => {
  const { setModalContent, setOnModalClose } = useModal();

  return (
    <button className="button"
      onClick={() => {
        if (typeof onButtonClick === "function") onButtonClick();
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent);
      }}
    >
      {buttonText}
    </button>
  );
};

export default OpenModalButton;