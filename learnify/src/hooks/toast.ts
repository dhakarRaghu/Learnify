// File: hooks/toast.ts
import { toast as hotToast } from "react-hot-toast";

type ToastOptions = {
  title: string;
  description?: string;
  status?: "success" | "error" | "info" | "warning";
  duration?: number; // Duration in milliseconds
};

export const toast = ({ title, description = "", status = "info", duration = 3000 }: ToastOptions) => {
  const baseConfig = {
    duration,
    style: {
      borderRadius: "8px",
      padding: "16px",
      fontSize: "14px",
    },
  };

  switch (status) {
    case "success":
      hotToast.success(`${title}: ${description}`, baseConfig);
      break;
    case "error":
      hotToast.error(`${title}: ${description}`, baseConfig);
      break;
    case "warning":
      hotToast(`${title}: ${description}`, { ...baseConfig, icon: "⚠️" });
      break;
    default:
      hotToast(`${title}: ${description}`, baseConfig);
      break;
  }
};
