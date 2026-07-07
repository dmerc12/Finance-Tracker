import { Card, CardContent, Input, Label, Button, Alert, AlertDescription } from '../components/ui';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLogin } from '../hooks';

const Login: React.FC = () => {
    const { email, setEmail, password, setPassword, error, handleSubmit } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-lg">
                    <CardContent className="p-8">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-bold text-center mb-2"
                        >
                            Finance-Tracker
                        </motion.h2>
                        <motion.h5
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center text-slate-600 mb-6"
                        >
                            Login to your account
                        </motion.h5>
                        <Alert className="mb-4 bg-blue-50 border-blue-200">
                            <AlertDescription>
                                <strong>Demo Credentials:</strong>
                                <br />
                                Email: <code>demo@financetracker.com</code>
                                <br />
                                Password: <code>demo123</code>
                            </AlertDescription>
                        </Alert>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1.5"
                                />
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative mt-1 5">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 top-0 h-full px-3"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </Button>
                                </div>
                            </div>
                            <Button type="submit" className="w-full mb-4">
                                Login
                            </Button>
                            <div className="text-center">
                                <p className="text-sm">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-blue-600 hover:underline">
                                        Register here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
