import DeleteModal from "../Dashboard/Trash/DeleteModal";
import useModal from "./useModal";

export default function Modals() {
  const { Modal } = useModal();
  return (
    <>
      <Modal modalId="modal" openId="permanent-delete" className="md:max-w-[530px] rounded-md border-none dark:bg-[#2F2F2F] p-6">
        <DeleteModal />
      </Modal>
    </>
  );
}
