import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button, Input, Label } from '../ui';
import { useState } from 'react';

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface PasswordFormProps {
    onSave: (data: PasswordFormData) => void;
    isSaving?: boolean;
}

export default function PasswordForm({ onSave, isSaving = false }: PasswordFormProps) {
    const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validatePassword = () => {
        const newErrors: Record<string, string> = {};
        if (!passwordForm.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }
        if (!passwordForm.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwordForm.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }
        if (!passwordForm.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (
            passwordForm.currentPassword &&
            passwordForm.newPassword &&
            passwordForm.currentPassword === passwordForm.newPassword
        ) {
            newErrors.newPassword = 'New password must be different from current password';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validatePassword()) return;
        onSave(passwordForm);
    };

    return (
        <div>
            <div className="space-y-4 mb-6">
                <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative mt-1.5">
                        <Input
                            id="currentPassword"
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                                setPasswordForm({
                                    ...passwordForm,
                                    currentPassword: e.target.value,
                                })
                            }
                            aria-invalid={!!errors.currentPassword}
                            className="pr-10"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() =>
                                setShowPasswords({
                                    ...showPasswords,
                                    current: !showPasswords.current,
                                })
                            }
                            className="absolute right-0 top-0 h-9 w-9 hover:bg-transparent"
                        >
                            {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                    </div>
                    {errors.currentPassword && (
                        <p className="text-sm text-destructive mt-1.5">{errors.currentPassword}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative mt-1.5">
                        <Input
                            id="newPassword"
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                            }
                            aria-invalid={!!errors.newPassword}
                            className="pr-10"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() =>
                                setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                            }
                            className="absolute right-0 top-0 h-9 w-9 hover:bg-transparent"
                        >
                            {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                    </div>
                    {errors.newPassword && (
                        <p className="text-sm text-destructive mt-1.5">{errors.newPassword}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1.5">
                        Password must be at least 6 characters long.
                    </p>
                </div>
                <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative mt-1.5">
                        <Input
                            id="confirmPassword"
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                                setPasswordForm({
                                    ...passwordForm,
                                    confirmPassword: e.target.value,
                                })
                            }
                            aria-invalid={!!errors.confirmPassword}
                            className="pr-10"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() =>
                                setShowPasswords({
                                    ...showPasswords,
                                    confirm: !showPasswords.confirm,
                                })
                            }
                            className="absolute right-0 top-0 h-9 w-9 hover:bg-transparent"
                        >
                            {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-sm text-destructive mt-1.5">{errors.confirmPassword}</p>
                    )}
                </div>
            </div>
            <Button onClick={handleSubmit} disabled={isSaving}>
                {isSaving ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Changing...
                    </>
                ) : (
                    <>
                        <Shield size={18} />
                        Change Password
                    </>
                )}
            </Button>
        </div>
    );
}
