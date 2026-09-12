import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks';
import { motion } from 'motion/react';
import {
    Card,
    CardContent,
    Input,
    Label,
    Button,
    Alert,
    AlertDescription,
    PasswordInput,
    PasswordStrengthIndicator,
} from '../components/ui';
import React from 'react';

const Register: React.FC = () => {
    const { values, errors, passwordStrength, isLoading, handleSubmit, handleChange, isFormValid } =
        useRegister();

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
                        {errors.general && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{errors.general}</AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit}>
                            {/* First Name */}
                            <div className="mb-4">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    className={`mt-1.5 ${errors.firstName ? 'border-red-500' : ''}`}
                                    aria-describedby="firstName-error"
                                />
                                {errors.firstName && (
                                    <p id="firstName-error" className="text-red-500 text-sm">
                                        {errors.firstName}
                                    </p>
                                )}
                            </div>
                            {/* Last Name */}
                            <div className="mb-4">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    className={`mt-1.5 ${errors.lastName ? 'border-red-500' : ''}`}
                                    aria-describedby="lastName-error"
                                />
                                {errors.lastName && (
                                    <p id="lastName-error" className="text-red-500 text-sm">
                                        {errors.lastName}
                                    </p>
                                )}
                            </div>
                            {/* Email */}
                            <div className="mb-4">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    className={`mt-1.5 ${errors.email ? 'border-red-500' : ''}`}
                                    aria-describedby="email-error"
                                />
                                {errors.email && (
                                    <p id="email-error" className="text-sm text-red-500 mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            {/* Password */}
                            <PasswordInput
                                id="password"
                                name="password"
                                label="Password"
                                value={values.password}
                                onChange={handleChange}
                                error={errors.password}
                            />
                            {/* Password strength indicator */}
                            <PasswordStrengthIndicator strength={passwordStrength} />
                            {/* Password Confirm */}
                            <PasswordInput
                                id="passwordConfirm"
                                name="passwordConfirm"
                                label="Confirm Password"
                                value={values.passwordConfirm}
                                onChange={handleChange}
                                error={errors.passwordConfirm}
                            />
                            <Button
                                type="submit"
                                className="w-full mb-4 bg-green-600 hover:bg-green-700"
                                disabled={isLoading || !isFormValid}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
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
