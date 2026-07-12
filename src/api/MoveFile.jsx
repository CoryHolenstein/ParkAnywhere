import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const URL = import.meta.env.VITE_BASE_API_URL + "/files/move-file";

export async function MoveFile(userId, sourceFileName, destinationFolderPath = '') {
  try {
    const token = useAuthStore.getState().token;
    const response = await axios.post(
      URL,
      {
        userId,
        sourceFileName,
        destinationFolderPath
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('[API] File moved successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] Error moving file:', error);
    throw error;
  }
}
