import { Component, type ReactNode } from "react";

export class PageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    render() {
        if (this.state.failed)
            return (
                <div role="alert" className="p-8 text-neutral-300">
                    <h1 className="text-lg font-semibold">
                        This workspace could not be displayed.
                    </h1>
                    <p className="mt-2 text-sm text-neutral-400">
                        Your other tabs are still available. Try reopening this workspace.
                    </p>
                    <button
                        className="mt-4 rounded border border-white/20 px-4 py-2"
                        onClick={() => this.setState({ failed: false })}
                    >
                        Try again
                    </button>
                </div>
            );
        return this.props.children;
    }
}
