/**
 * Enhanced Error Handling Utilities
 *
 * WHY: Provide better user experience with clearer error messages
 * and graceful error recovery mechanisms.
 */

/**
 * Format error messages with context
 */
export function formatErrorMessage(error: Error, context?: string): string {
    let message = error.message || 'An unexpected error occurred';

    if (context) {
        message = `${context}: ${message}`;
    }

    return `[${message}](${error.stack || 'No stack trace available'})`;
}

/**
 * Get user-friendly error description based on error type
 */
type UserFriendlyError = {
    title: string;
    message: string;
    action: string;
};

export function getUserFriendlyError(error: Error): UserFriendlyError {
    if (error instanceof TypeError && error.message && error.message.includes('fetch')) {
        return {
            title: 'Network Error',
            message: 'Unable to connect to server. Please check your internet connection.',
            action: 'Try again or switch to a different network.',
        };
    }

    if (error instanceof TypeError && error.message && error.message.includes('storage')) {
        return {
            title: 'Storage Error',
            message: 'Unable to save your data. This may be a temporary issue.',
            action: 'Your data has been preserved locally.',
        };
    }

    if (error instanceof SyntaxError) {
        return {
            title: 'Data Error',
            message: 'There was a problem loading your data. Please try again.',
            action: 'Refresh page to reload your data.',
        };
    }

    return {
        title: 'Error',
        message: 'Something went wrong. Please try again.',
        action: 'If problem persists, please report it.',
    };
}

/**
 * Error recovery action types
 */
type RecoveryActionType = 'tryAgain' | 'refresh' | 'checkConnection' | 'useOffline' | 'contactSupport';

interface RecoveryAction {
    title: string;
    message: string;
    action: () => void;
}

/**
 * Recovery action definitions
 */
const recoveryActions: Record<string, RecoveryAction> = {
    storage: {
        title: 'Try Again',
        message: 'Try saving again',
        action: () => undefined,
    },
    network: {
        title: 'Retry Action',
        message: 'Retry the action',
        action: () => undefined,
    },
    parsing: {
        title: 'Refresh',
        message: 'Refresh page',
        action: () => undefined,
    },
    generic: {
        title: 'Refresh Page',
        message: 'Refresh page',
        action: () => undefined,
    },
};

/**
 * Map error types to recovery actions
 */
const typeToActionMap: Record<string, RecoveryAction | null> = {
    TypeError: recoveryActions.storage,
    SyntaxError: recoveryActions.parsing,
    NetworkError: recoveryActions.network,
    StorageError: recoveryActions.storage,
};

/**
 * Get recovery action based on error type
 */
export function getRecoveryAction(error: Error): RecoveryAction {
    return typeToActionMap[error.name] || recoveryActions.generic;
}

/**
 * Validation error messages with suggestions
 */
export function getValidationError(field: string, issue: 'required' | 'invalid' | 'out_of_range'): { message: string; suggestion: string } {
    const messages = {
        required: `${field} is required`,
        invalid: `Invalid ${field}`,
        out_of_range: `${field} must be between valid range`,
    };

    const suggestions = {
        required: 'Please enter a value',
        invalid: 'Please enter a valid value',
        out_of_range: 'Please check the valid range',
    };

    return {
        message: messages[issue],
        suggestion: suggestions[issue],
    };
}

/**
 * Error class for structured error handling
 */
export class AppError extends Error {
    context?: string;
    recoverable: boolean;
    recoveryAction?: RecoveryActionType;

    constructor(
        message: string,
        context?: string,
        recoverable: boolean = true,
        recoveryAction?: RecoveryActionType
    ) {
        super(message);
        this.name = 'AppError';
        this.context = context;
        this.recoverable = recoverable;
        this.recoveryAction = recoveryAction;
    }

    /**
     * Create recoverable error from error
     */
    static createFromError(error: Error, context?: string): AppError {
        return new AppError(
            error.message || 'An error occurred',
            context,
            true
        );
    }

    /**
     * Create non-recoverable error from error
     */
    static createFatal(message: string, context?: string): AppError {
        return new AppError(message, context, false);
    }
}

/**
 * Log error for debugging while providing user feedback
 */
export function logAndHandleError(
    error: Error,
    context: string,
    showToast: boolean = false
): void {
    console.error('Error:', formatErrorMessage(error, context));

    if (showToast) {
        console.warn('Toast would show:', formatErrorMessage(error, context));
    }
}
