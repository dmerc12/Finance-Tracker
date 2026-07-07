import { motion } from 'motion/react';

export default function AnalyticsLoadingState() {
    return (
        <div className="h-screen bg-gray-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <div
                    className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin
                        mx-auto mb-3"
                />
                <h5 className="text-gray-500 text-lg font-medium">
                    Analyzing your financial data...
                </h5>
                <p className="text-gray-500">Please wait while we generate your insights</p>
            </motion.div>
        </div>
    );
}
