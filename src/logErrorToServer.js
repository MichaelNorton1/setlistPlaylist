import { useApi } from './composables/useApi.js';

let apiInstance = null;

// Store the API instance for use outside of React components
const setApiInstance = () => {
  if (!apiInstance) {
    // Create a temporary instance to get the API methods
    const tempApi = useApi();
    apiInstance = tempApi.api;
  }
};

async function logErrorToServer(message) {
  try {
    // Set up API instance if not already done
    setApiInstance();
    if (apiInstance) {
      await apiInstance.logError(message);
    }
    console.log("Error logged successfully.");
  } catch (error) {
    console.error("Failed to log error:", error);
  }
}

export default logErrorToServer;