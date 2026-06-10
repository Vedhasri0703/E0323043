import axios from "axios";

const LOG_API = "http://4.224.186.213/evaluation-service/logs";

export async function Log(
  stack,
  level,
  packageName,
  message
) {
  try {
    const response = await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: packageName,
        message,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Logging Failed:", error.message);
  }
}