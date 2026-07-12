import axios from "axios";
import useAuthStore from "../store/useAuthStore";


const URL = import.meta.env.VITE_BASE_API_URL + "/files/get-folder-size";

export async function GetFolderSize(userId) {
  try {
    const token = useAuthStore.getState().token;
     const response = await axios.post(URL, {userId}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('[API] Received Folder Size Successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] Error Fetching Folder Size:', error);
    throw error;
  }
}
