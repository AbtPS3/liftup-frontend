import { useAlert } from "@/stores/state";

function showAlert(alertType, alertTitle, alertMessage) {
  useAlert.toggleVisibility(true);
  useAlert.changeType(alertType);
  useAlert.changeTitle(alertTitle);
  useAlert.changeMessage(alertMessage);
  setTimeout(() => {
    useAlert.toggleVisibility(false);
  }, 3000);
}

export default showAlert;
