import { motion, useReducedMotion } from 'motion/react';
import { useRegister } from '../../hooks';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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
    PasswordFeedback,
} from '../../components/ui';
import React from 'react';

const Register: React.FC = () => {
    const {
        values,
        errors,
        passwordStrength,
        isLoading,
        handleSubmit,
        handleChange,
        handleBlur,
        isFormValid,
    } = useRegister();

    const shouldReduceMotion = useReducedMotion();
    const fadeIn = shouldReduceMotion ? {} : { opacity: 1 };
    const slideUp = shouldReduceMotion ? {} : { opacity: 1, y: 0 };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={slideUp}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-lg">
                    <CardContent className="p-8">
                        <motion.h2
                            initial={shouldReduceMotion ? false : { opacity: 0 }}
                            animate={fadeIn}
                            className="text-2xl font-bold text-center mb-2"
                        >
                            Finance-Tracker
                        </motion.h2>
                        <motion.p
                            initial={shouldReduceMotion ? false : { opacity: 0 }}
                            animate={fadeIn}
                            className="text-center text-slate-600 mb-6"
                        >
                            Create your account
                        </motion.p>
                        {errors.general && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{errors.general}</AlertDescription>
                            </Alert>
                        )}
                        <form noValidate onSubmit={handleSubmit}>
                            {/* First Name */}
                            <Field id="firstName" label="First Name" error={errors.firstName}>
                                <FieldControl>
                                    <Input
                                        required
                                        autoFocus
                                        type="text"
                                        name="firstName"
                                        value={values.firstName}
                                        autoComplete="given-name"
                                        spellCheck={false}
                                        autoCorrect="off"
                                        enterKeyHint="next"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </FieldControl>
                            </Field>
                            {/* Last Name */}
                            <Field id="lastName" label="Last Name" error={errors.lastName}>
                                <FieldControl>
                                    <Input
                                        required
                                        type="text"
                                        name="lastName"
                                        value={values.lastName}
                                        autoComplete="family-name"
                                        spellCheck={false}
                                        autoCorrect="off"
                                        enterKeyHint="next"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </FieldControl>
                            </Field>
                            {/* Email */}
                            <Field id="email" label="Email" error={errors.email}>
                                <FieldControl>
                                    <Input
                                        required
                                        type="email"
                                        name="email"
                                        value={values.email}
                                        autoComplete="username"
                                        autoCapitalize="none"
                                        inputMode="email"
                                        spellCheck={false}
                                        autoCorrect="off"
                                        enterKeyHint="next"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </FieldControl>
                            </Field>
                            {/* Password */}
                            <Field
                                id="password"
                                label="Password"
                                error={errors.password}
                                description="Use a strong, unique password."
                            >
                                <FieldControl>
                                    <PasswordInput
                                        required
                                        name="password"
                                        value={values.password}
                                        autoComplete="new-password"
                                        autoCapitalize="none"
                                        spellCheck={false}
                                        autoCorrect="off"
                                        enterKeyHint="next"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </FieldControl>
                                {/* Password feedback */}
                                <PasswordFeedback
                                    password={values.password}
                                    firstName={values.firstName}
                                    lastName={values.lastName}
                                    email={values.email}
                                    strength={passwordStrength}
                                />
                            </Field>
                            {/* Password Confirm */}
                            <Field
                                id="passwordConfirm"
                                label="Confirm Password"
                                error={errors.passwordConfirm}
                            >
                                <FieldControl>
                                    <PasswordInput
                                        required
                                        name="passwordConfirm"
                                        value={values.passwordConfirm}
                                        autoComplete="new-password"
                                        autoCapitalize="none"
                                        spellCheck={false}
                                        autoCorrect="off"
                                        enterKeyHint="done"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </FieldControl>
                            </Field>
                            <Button
                                type="submit"
                                className="w-full mb-4 bg-green-600 hover:bg-green-700"
                                disabled={isLoading || !isFormValid}
                                aria-busy={isLoading}
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
