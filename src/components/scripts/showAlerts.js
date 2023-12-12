import { useAlert } from "../../stores/store";

function showAlert(alertType, alertTitle, alertMessage) {
  useAlert.toggleVisibility(true);
  useAlert.changeType(alertType);
  useAlert.changeTitle(alertTitle);
  useAlert.changeMessage(alertMessage);
  setTimeout(() => {
    useAlert.toggleVisibility(false);
  }, 5000);
}

export default showAlert;
