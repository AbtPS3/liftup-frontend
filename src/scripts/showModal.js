import { useModal } from "@/stores/state";

function showModal(modalData, modalTitle, modalMessage) {
  useModal.toggleVisibility(true);
  useModal.changeData(modalData);
  useModal.changeTitle(modalTitle);
  useModal.changeMessage(modalMessage);

  console.log(modalData);
}

export default showModal;
