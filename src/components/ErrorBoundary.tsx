import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                    <AlertTriangle size={48} className="text-red-500 mb-4" />
                    <h2 className="font-dot text-2xl text-white mb-2">SOMETHING WENT WRONG</h2>
                    <p className="text-gray-400 mb-4 max-w-xs">
                        The application encountered an error. Try refreshing the page.
                    </p>
                    <div className="bg-red-900/20 border border-red-900/50 p-4 rounded text-left w-full max-w-sm overflow-auto max-h-40">
                        <code className="text-xs text-red-200 font-mono">
                            {this.state.error?.message}
                        </code>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-mono text-sm transition-colors"
                    >
                        RELOAD SYSTEM
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
