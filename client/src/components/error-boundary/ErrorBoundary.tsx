import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    buttonVariants,
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui';

interface ErrorBoundaryProps {
    children: ReactNode;
    /**
     * When this value changes, the boundary resets to its children.
     * Used by {@code AppRoutes} to pass {@code location.key} so navigating anywhere
     * (including away from this fallback via the "Go to login" link) recovers from a caught error.
     */
    resetKey?: string | number;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

/**
 * App-level React error boundary.
 *
 * <p>Catches render-time exceptions in the routed content and renders a recovery UI
 * insteadof unmounting to a blank page.
 * Recovers on route change: passing {@code location.key} as {@code resetKey}
 * means navigating anywhere - including clicking "Go to login" link in the fallback -
 * clears the caught error and re-renders the routed content fresh.
 *
 * <p><b>What this catches:</b> exceptions thrown during rendering, in lifecycle methods,
 * or in constructors of the child subtree.
 *
 * <p><b>What this does not catch:</b>
 * <ul>
 *     <li>
 *         Promise rejections from async form handlers - surfaced through the Redux slice
 *         {@code error} state and rendered by the pages themselves
 *     </li>
 *     <li>
 *         Exceptions thrown in event handlers, setTimeout callbacks, or other async code -
 *         React error boundaries only observe the render lifecycle
 *     </li>
 *     <li>
 *         Errors thrown by the fallback UI itself - there is no second boundary above
 *         this one; if the fallback throws, React unmounts the whole tree
 *     </li>
 * </ul>
 *
 * <p>The boundary sits inside {@code BrowserRouter} and {@code SessionBootstrap},
 * so Router context (for {@code Link}) and the session bootstrap are preserved
 * even while the fallback is showing.
 *
 * @see
 * <a
 *  href="https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary">
 *  React docs - Error Boundaries
 * </a>
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // React already logs the caught error to console.error.
        // This second call carries the componentStack, which names the specific component that
        // threw - essential for diagnosing "which page broke".
        console.error('ErrorBoundary caught error', error, errorInfo);
    }

    componentDidUpdate(prevProps: ErrorBoundaryProps): void {
        if (this.props.resetKey !== prevProps.resetKey && this.state.hasError) {
            this.setState({ hasError: false });
        }
    }

    handleReset = (): void => {
        this.setState({ hasError: false });
    };

    render(): ReactNode {
        if (!this.state.hasError) {
            return this.props.children;
        }
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-6">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Something went wrong</CardTitle>
                        <CardDescription>
                            We hit an unexpected error on this page. Try again, or head back to the
                            login page.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center gap-2">
                        <Button onClick={this.handleReset}>Try again</Button>
                        <Link to="/login" className={buttonVariants({ variant: 'outline' })}>
                            Go to login
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }
}

export default ErrorBoundary;
