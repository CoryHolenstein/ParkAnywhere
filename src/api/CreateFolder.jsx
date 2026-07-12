import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const URL = import.meta.env.VITE_BASE_API_URL + "/folders/create-folder";

export async function CreateFolder(userIdOrPayload, folderNameArg, folderPathArg = '') {
  try {
    const token = useAuthStore.getState().token;

    const payload =
      typeof userIdOrPayload === 'object' && userIdOrPayload !== null
        ? {
            userId: userIdOrPayload.userId,
            accountId: userIdOrPayload.accountId,
            folderName: userIdOrPayload.folderName,
            folderPath: userIdOrPayload.folderPath || ''
          }
        : {
            userId: userIdOrPayload,
            folderName: folderNameArg,
            folderPath: folderPathArg
          };

    const response = await axios.post(URL, {
      userId: payload.userId,
      accountId: payload.accountId,
      folderName: payload.folderName,
      folderPath: payload.folderPath
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('[API] Folder created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] Error creating folder:', error);
    throw error;
  }
}
