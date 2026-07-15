import { Button } from '../components/ui';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
                >
                    <h1 className="text-[8rem] font-bold text-blue-600">404</h1>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-3xl font-semibold mb-4"
                >
                    Page Not Found
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-lg text-slate-600 mb-8"
                >
                    Oops! The page you're looking for doesn't exist.
                    <br />
                    It might have been moved or deleted.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex gap-3 justify-center"
                >
                    <Link to="/login">
                        <Button size="lg" asChild>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                Go to Login
                            </motion.button>
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="outline" size="lg" asChild>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                Register
                            </motion.button>
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="mt-12"
                >
                    <svg
                        width="200"
                        height="200"
                        viewBox="0 0 200 200"
                        className="text-slate-400 opacity-30 inline-block"
                    >
                        <motion.circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.8, duration: 2, ease: 'easeInOut' }}
                        />
                        <motion.path
                            d="M 70 80 Q 70 70, 80 70 Q 90 70, 90 80 L 90 90 Q 90 100, 80 100 Q 70 100, 70 90 Z"
                            fill="currentColor"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                        />
                        <motion.path
                            d="M 110 80 Q 110 70, 120 70 Q 130 70, 130 80 L 130 90 Q 130 100, 120 100 Q 110 100, 110 90 Z"
                            fill="currentColor"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4, duration: 0.5 }}
                        />
                        <motion.path
                            d="M 70 130 Q 100 150, 130 130"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 1.6, duration: 0.8 }}
                        />
                    </svg>
                </motion.div>
            </motion.div>
        </div>
    );
}
