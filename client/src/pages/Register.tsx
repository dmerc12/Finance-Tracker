import { Card, CardContent, Input, Label, Button, Alert, AlertDescription } from '../components/ui';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks';
import { motion } from 'motion/react';

const Register: React.FC = () => {
    const {
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        success,
        handleSubmit,
    } = useRegister();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                            className="text-2xl font-bold text-center mb-2"
                        >
                            Finance-Tracker
                        </motion.h2>
                        <motion.h5
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-slate-600 mb-6"
                        >
                            Create your account
                        </motion.h5>
                        <Alert className="mb-4 bg-blue-50 border-blue-200">
                            <AlertDescription>
                                <strong>Prototype Mode:</strong> Any valid email and password will
                                work.
                            </AlertDescription>
                        </Alert>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                                <AlertDescription>{success}</AlertDescription>
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
                                <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative mt-1 5">
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-0 top-0 h-full px-3"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={16} />
                                        ) : (
                                            <Eye size={16} />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full mb-4 bg-green-600 hover:bg-green-700"
                            >
                                Create Account
                            </Button>
                            <div className="text-center">
                                <p className="text-sm">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-blue-600 hover:underline">
                                        Login here
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

export default Register;
