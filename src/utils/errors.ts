/**
 * Custom Error Classes
 * Makes error handling more specific and debuggable
 */

export class AppError extends Error {
	constructor(
		message: string,
		public code?: string,
		public statusCode?: number,
	) {
		super(message);
		this.name = "AppError";
		Object.setPrototypeOf(this, AppError.prototype);
	}
}

export class ApiError extends AppError {
	constructor(
		message: string,
		public endpoint: string,
		statusCode?: number,
	) {
		super(message, "API_ERROR", statusCode);
		this.name = "ApiError";
		Object.setPrototypeOf(this, ApiError.prototype);
	}
}

export class ValidationError extends AppError {
	constructor(message: string, public field?: string) {
		super(message, "VALIDATION_ERROR", 400);
		this.name = "ValidationError";
		Object.setPrototypeOf(this, ValidationError.prototype);
	}
}

export class AuthError extends AppError {
	constructor(message: string = "Authentication failed") {
		super(message, "AUTH_ERROR", 401);
		this.name = "AuthError";
		Object.setPrototypeOf(this, AuthError.prototype);
	}
}

export class NotFoundError extends AppError {
	constructor(resource: string) {
		super(`${resource} not found`, "NOT_FOUND", 404);
		this.name = "NotFoundError";
		Object.setPrototypeOf(this, NotFoundError.prototype);
	}
}

/**
 * Error handler utility
 */
export function handleError(error: unknown): AppError {
	if (error instanceof AppError) {
		return error;
	}

	if (error instanceof Error) {
		return new AppError(error.message);
	}

	return new AppError("An unknown error occurred");
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
	if (error instanceof AppError) {
		return error.message;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "An unexpected error occurred. Please try again.";
}
