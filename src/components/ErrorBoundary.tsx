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
                <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-bg-void min-h-screen">
                    <div className="glass-card p-8 rounded-2xl max-w-md w-full animate-scale-in">
                        <AlertTriangle size={64} className="text-vermillion mb-6 mx-auto animate-pulse-glow" />
                        <h2 className="font-display text-2xl text-parchment mb-3 tracking-[0.1em] uppercase">System Error</h2>
                        <p className="text-parchment/70 mb-6 max-w-xs mx-auto leading-relaxed">
                            The application encountered an unexpected error. Please reload the page.
                        </p>
                        <div className="bg-vermillion/10 border border-vermillion/30 p-4 rounded-lg text-left w-full max-w-sm overflow-auto max-h-40 mb-6">
                            <code className="text-xs text-vermillion-light font-mono break-all">
                                {this.state.error?.message}
                            </code>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary-action w-full py-3"
                            aria-label="Reload application"
                        >
                            Reload System
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
