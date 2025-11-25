import SignUpLogIn from "../Home/Auth/SignUpLogIn";
import useModal from "./useModal";

export default function Modals() {
  const { Modal } = useModal();
  return (
    <>
      <Modal modalId="modal" openId="login">
        <SignUpLogIn activatedTab="login" />
      </Modal>

      <Modal modalId="modal" openId="signup">
        <SignUpLogIn activatedTab="signup" />
      </Modal>
    </>
  );
}
