import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const URL = import.meta.env.VITE_BASE_API_URL + "/files/delete-file";

export async function DeleteFile(userId, fileName) {
  try {
    const token = useAuthStore.getState().token;

    const response = await axios.post(URL, {
      userId,
      fileName
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('[API] File deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] Error deleting file:', error);
    throw error;
  }
}
