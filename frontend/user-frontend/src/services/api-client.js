import axios from "axios";

// Base URL from environment variables
const BASE_URL =
	import.meta.env.VITE_BASE_URL || "http://localhost:5000/api/v1";

// Validate BASE_URL
if (!BASE_URL || typeof BASE_URL !== "string") {
	console.warn("Invalid BASE_URL configuration. Falling back to default.");
}

// Request deduplication cache
class RequestCache {
	constructor(cacheTime = 2000) {
		this.cache = new Map();
		this.cacheTime = cacheTime;
	}

	getKey(config) {
		const { method = "GET", url, data } = config;
		const payload = data ? JSON.stringify(data) : "";
		return `${method}-${url}-${payload}`;
	}

	set(key, promise) {
		if (!this.cache.has(key)) {
			this.cache.set(key, promise);
			setTimeout(() => this.cache.delete(key), this.cacheTime);
		}
		return this.cache.get(key);
	}

	get(key) {
		return this.cache.get(key);
	}

	clear() {
		this.cache.clear();
	}
}

// Create axios instance
const api = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

const requestCache = new RequestCache();

// Request interceptor
api.interceptors.request.use(
	(config) => {
		const key = requestCache.getKey(config);
		const cachedRequest = requestCache.get(key);
		if (cachedRequest) {
			// Return the cached promise instead of rejecting
			return Promise.resolve(cachedRequest);
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
	(response) => response.data,
	async (error) => {
		let errorMessage = "Something went wrong";
		if (error.response) {
			const data = error.response.data;
			errorMessage = data.message || data.error || data.details || errorMessage;
		} else if (error.code === "ECONNABORTED") {
			errorMessage = "Request timeout";
		} else if (error.request) {
			errorMessage = "No response from server";
		}

		const customError = new Error(errorMessage);
		customError.status = error.response?.status;
		customError.code = error.code || "UNKNOWN_ERROR";
		customError.originalError = error;

		// Log the error for debugging
		console.error(`API Error: ${errorMessage}`, {
			url: error.config?.url,
			method: error.config?.method,
			status: error.response?.status,
			originalError: error,
		});

		throw customError;
	},
);

// API client function
const apiClient = async (url, options = {}) => {
	const { retries = 3, retryDelay = 1000, signal, ...axiosOptions } = options;

	const makeRequest = async (attempt = 0) => {
		try {
			const config = { url, signal, ...axiosOptions };
			const key = requestCache.getKey(config);
			const cachedRequest = requestCache.get(key);
			if (cachedRequest) {
				return await cachedRequest;
			}

			const promise = api(config);
			return await requestCache.set(key, promise);
		} catch (error) {
			// Retry only for server-side errors (5xx) and exclude non-retryable errors
			if (
				attempt < retries &&
				!axios.isCancel(error) &&
				error.response &&
				![401, 403, 404].includes(error.response.status)
			) {
				await new Promise((resolve) =>
					setTimeout(resolve, retryDelay * Math.pow(2, attempt)),
				);
				return makeRequest(attempt + 1);
			}

			// Handle 401 Unauthorized errors gracefully
			if (error.response && error.response.status === 401) {
				console.warn("User is not authenticated. Redirecting to login...");
				window.location.href = "/login"; // Adjust this based on your app's routing
			}

			// Throw the error after retries are exhausted
			throw error;
		}
	};

	return makeRequest();
};

// Helper methods for common HTTP methods
apiClient.get = (url, params = {}, config = {}) =>
	apiClient(url, { ...config, method: "GET", params });

apiClient.post = (url, data, config = {}) =>
	apiClient(url, { ...config, method: "POST", data });

apiClient.put = (url, data, config = {}) =>
	apiClient(url, { ...config, method: "PUT", data });

apiClient.patch = (url, data, config = {}) =>
	apiClient(url, { ...config, method: "PATCH", data });

apiClient.delete = (url, config = {}) =>
	apiClient(url, { ...config, method: "DELETE" });

export default apiClient;
