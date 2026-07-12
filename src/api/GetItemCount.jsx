import axios from "axios";
import useAuthStore from "../store/useAuthStore";


const URL = import.meta.env.VITE_BASE_API_URL + "/files/get-item-count";

export async function GetItemCount(userId) {
  try {
    const token = useAuthStore.getState().token;
     const response = await axios.post(URL, {userId}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('[API] Received Item Count Successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] Error Fetching Item Count:', error);
    throw error;
  }
}
