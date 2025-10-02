/**
 * API Client
 * Centralized API calls with error handling and logging
 */

import { logger } from "@/utils/logger";
import { ApiError } from "@/utils/errors";
import type { ApiResponse, TokenCallback } from "@/types";

interface RequestOptions extends RequestInit {
	timeout?: number;
}

class ApiClient {
	private async request<T>(
		endpoint: string,
		options: RequestOptions = {}
	): Promise<T> {
		const { timeout = 30000, ...fetchOptions } = options;

		logger.apiCall(endpoint, options.method || "GET", options.body);

		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), timeout);

			const response = await fetch(endpoint, {
				...fetchOptions,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new ApiError(
					errorData.error || errorData.message || `Request failed with status ${response.status}`,
					endpoint,
					response.status
				);
			}

			const data = await response.json();
			logger.apiResponse(endpoint, response.status, data);
			return data;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			logger.apiError(endpoint, error);

			if (error instanceof Error && error.name === "AbortError") {
				throw new ApiError("Request timeout", endpoint, 408);
			}

			throw new ApiError(
				error instanceof Error ? error.message : "Network request failed",
				endpoint
			);
		}
	}

	async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
		return this.request<T>(endpoint, { ...options, method: "GET" });
	}

	async post<T>(
		endpoint: string,
		data?: any,
		options?: RequestOptions
	): Promise<T> {
		return this.request<T>(endpoint, {
			...options,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async put<T>(
		endpoint: string,
		data?: any,
		options?: RequestOptions
	): Promise<T> {
		return this.request<T>(endpoint, {
			...options,
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
		return this.request<T>(endpoint, { ...options, method: "DELETE" });
	}

	/**
	 * Stream API for chat responses
	 */
	async stream(
		endpoint: string,
		data: any,
		onToken: TokenCallback
	): Promise<void> {
		logger.apiCall(endpoint, "POST (stream)", data);

		try {
			const response = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new ApiError(
					`Stream request failed with status ${response.status}`,
					endpoint,
					response.status
				);
			}

			if (!response.body) {
				throw new ApiError("No response body", endpoint);
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const chunk = decoder.decode(value, { stream: true });
				onToken(chunk);
			}

			logger.apiResponse(endpoint, response.status, "Stream completed");
		} catch (error) {
			logger.apiError(endpoint, error);
			throw error instanceof ApiError
				? error
				: new ApiError(
					error instanceof Error ? error.message : "Stream failed",
					endpoint
				);
		}
	}
}

export const apiClient = new ApiClient();
