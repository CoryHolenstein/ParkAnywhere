import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const URL = import.meta.env.VITE_BASE_API_URL + "/files/list-files";

export async function ListFiles(userId) {
  try {
    const token = useAuthStore.getState().token;
    const response = await axios.post(URL, { userId }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('[API] Listed files successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] Error listing files:', error);
    throw error;
  }
}
