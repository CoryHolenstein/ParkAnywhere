import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const URL = import.meta.env.VITE_BASE_API_URL + "/files/add-file";

export async function AddFile(userId, file) {
  try {
    const token = useAuthStore.getState().token;
    
    // Convert file to base64
    const fileContent = await fileToBase64(file);
    
    const response = await axios.post(URL, {
      userId,
      fileName: file.name,
      fileContent,
      contentType: file.type || 'application/octet-stream'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('[API] File uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] Error uploading file:', error);
    throw error;
  }
}

// Helper function to convert File to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}
