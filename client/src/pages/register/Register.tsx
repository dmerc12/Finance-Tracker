import { useRegister } from '../../hooks';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import {
    Card,
    CardContent,
    Input,
    Button,
    Alert,
    AlertTitle,
    AlertDescription,
    Field,
    FieldControl,
    PasswordInput,
    PasswordStrengthIndicator,
} from '../../components/ui';
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
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{errors.general}</AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit}>
                            {/* First Name */}
                            <Field id="firstName" label="First Name" error={errors.firstName}>
                                <FieldControl>
                                    <Input
                                        type="text"
                                        name="firstName"
                                        value={values.firstName}
                                        onChange={handleChange}
                                    />
                                </FieldControl>
                            </Field>
                            {/* Last Name */}
                            <Field id="lastName" label="Last Name" error={errors.lastName}>
                                <FieldControl>
                                    <Input
                                        type="text"
                                        name="lastName"
                                        value={values.lastName}
                                        onChange={handleChange}
                                    />
                                </FieldControl>
                            </Field>
                            {/* Email */}
                            <Field id="email" label="Email" error={errors.email}>
                                <FieldControl>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                    />
                                </FieldControl>
                            </Field>
                            {/* Password */}
                            <Field id="password" label="Password" error={errors.password}>
                                <FieldControl>
                                    <PasswordInput
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                    />
                                </FieldControl>
                                {/* Password strength indicator */}
                                <PasswordStrengthIndicator strength={passwordStrength} />
                            </Field>
                            {/* Password Confirm */}
                            <Field
                                id="passwordConfirm"
                                label="Confirm Password"
                                error={errors.passwordConfirm}
                            >
                                <FieldControl>
                                    <PasswordInput
                                        name="passwordConfirm"
                                        value={values.passwordConfirm}
                                        onChange={handleChange}
                                    />
                                </FieldControl>
                            </Field>
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
