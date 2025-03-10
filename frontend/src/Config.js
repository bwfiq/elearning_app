const getApiUrl = () => {
    // Try to get the API URL from the request header
    const apiUrlFromHeader = document.querySelector('meta[name="x-api-url"]')?.content;

    // Fallback to environment variable if header is not found
    return apiUrlFromHeader || process.env.REACT_APP_API_URL || 'http://localhost:8000'; // Optional default if no ENV
};

const Config = {
    apiUrl: getApiUrl(),
}

export default Config;
