"use client";

/**
 * ErrorBoundary Component
 * Catches JavaScript errors in child components and renders a fallback UI.
 * Logs errors to console for debugging.
 *
 * Usage: Wrap any subtree that may throw errors.
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    /**
     * Called when descendant component throws.
     * @param error - The caught error
     * @returns New state to trigger fallback UI
     */
    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    /**
     * Lifecycle method for logging errors.
     * @param error - The caught error
     * @param info - React error info with component stack
     */
    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("[ErrorBoundary]", error, info.componentStack);
    }

    /** Resets error state so children re-render */
    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-7 h-7 text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">
                            Something went wrong
                        </h2>
                        <p className="text-sm text-zinc-400 max-w-sm">
                            {this.state.error?.message ?? "An unexpected error occurred."}
                        </p>
                    </div>
                    <button
                        onClick={this.handleReset}
                        className="btn-secondary text-sm py-2 px-4"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
