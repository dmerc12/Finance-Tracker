import LoadingState from './LoadingState';

export default function DashboardLoadingState() {
    return (
        <div className="h-screen bg-slate-50 flex items-center justify-center">
            <LoadingState
                message="Loading your dashboard..."
                description="Please wait while we fetch your financial data"
            />
        </div>
    );
}
