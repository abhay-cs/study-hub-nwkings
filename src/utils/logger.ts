/**
 * Logger Utility
 * Centralized logging with environment-based control
 * Makes debugging easier with structured log messages
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
	component?: string;
	action?: string;
	[key: string]: any;
}

class Logger {
	private isDevelopment = process.env.NODE_ENV === "development";

	private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
		const timestamp = new Date().toISOString();
		const contextStr = context ? JSON.stringify(context, null, 2) : "";
		return `[${timestamp}] [${level.toUpperCase()}] ${message} ${contextStr}`;
	}

	debug(message: string, context?: LogContext) {
		if (this.isDevelopment) {
			console.debug(this.formatMessage("debug", message, context));
		}
	}

	info(message: string, context?: LogContext) {
		if (this.isDevelopment) {
			console.info(this.formatMessage("info", message, context));
		}
	}

	warn(message: string, context?: LogContext) {
		console.warn(this.formatMessage("warn", message, context));
	}

	error(message: string, error?: Error | unknown, context?: LogContext) {
		const errorContext = {
			...context,
			error: error instanceof Error ? {
				message: error.message,
				stack: error.stack,
				name: error.name,
			} : error,
		};
		console.error(this.formatMessage("error", message, errorContext));
	}

	// For API calls
	apiCall(endpoint: string, method: string, data?: any) {
		this.debug(`API Call: ${method} ${endpoint}`, { data });
	}

	apiResponse(endpoint: string, status: number, data?: any) {
		this.debug(`API Response: ${endpoint} [${status}]`, { data });
	}

	apiError(endpoint: string, error: Error | unknown) {
		this.error(`API Error: ${endpoint}`, error);
	}
}

export const logger = new Logger();
