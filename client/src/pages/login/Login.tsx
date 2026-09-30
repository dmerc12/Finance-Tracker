import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks';
import { Loader2 } from 'lucide-react';
import {
    Card,
    CardContent,
    Input,
    Button,
    Alert,
    AlertDescription,
    Field,
    FieldControl,
    PasswordInput,
} from '../../components/ui';
import React from 'react';

const Login: React.FC = () => {
    const { values, errors, isLoading, handleSubmit, handleChange, handleBlur, isFormValid } =
        useLogin();

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
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-bold text-center mb-2"
                        >
                            Finance-Tracker
                        </motion.h2>
                        <motion.p
                            initial={shouldReduceMotion ? false : { opacity: 0 }}
                            animate={fadeIn}
                            transition={{ delay: 0.3 }}
                            className="text-center text-slate-600 mb-6"
                        >
                            Login to your account
                        </motion.p>
                        {errors.general && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription className="text-center line-clamp-none">
                                    {errors.general}
                                </AlertDescription>
                            </Alert>
                        )}
                        <form noValidate onSubmit={handleSubmit}>
                            {/* Email */}
                            <Field id="email" label="Email" error={errors.email}>
                                <FieldControl>
                                    <Input
                                        required
                                        autoFocus
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
                            <Field id="password" label="Password" error={errors.password}>
                                <FieldControl>
                                    <PasswordInput
                                        required
                                        name="password"
                                        value={values.password}
                                        autoComplete="current-password"
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
                                className="w-full mb-4 mt-2"
                                disabled={isLoading || !isFormValid}
                                aria-busy={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Login'
                                )}
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
