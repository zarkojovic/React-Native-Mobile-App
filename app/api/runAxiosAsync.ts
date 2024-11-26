import axios, { AxiosResponse } from "axios";
import { showMessage } from "react-native-flash-message";

export const runAxiosAsync = async <T>(
  promise: Promise<AxiosResponse<T>>
): Promise<T | null> => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    let message = (error as any).message;
    if (error instanceof axios.AxiosError) {
      const { response } = error;
      if (response) message = response.data.message;
    }

    message =
      message.charAt(0).toUpperCase() +
      message.slice(1) +
      (message.endsWith(".") ? "" : ".");

    showMessage({
      message,
      type: "danger",
    });
  }

  return null;
};
