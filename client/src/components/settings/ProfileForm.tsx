import { Button, Input, Label } from '../ui';
import { Save, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    userId: string;
    joinedDate: string;
}

interface ProfileFormProps {
    profileData: ProfileData;
    isEditing: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: (data: { firstName: string; lastName: string; email: string }) => void;
    isSaving?: boolean;
}

export default function ProfileForm({
    profileData,
    isEditing,
    onEdit,
    onCancel,
    onSave,
    isSaving = false,
}: ProfileFormProps) {
    const [formData, setFormData] = useState({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;
        onSave(formData);
    };

    const handleCancel = () => {
        setFormData({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
        });
        setErrors({});
        onCancel();
    };

    if (!isEditing) {
        return (
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <Label className="text-muted-foreground text-xs mb-1">User ID</Label>
                        <div className="font-medium">{profileData.userId}</div>
                    </div>
                    <div>
                        <Label className="text-muted-foreground text-xs mb-1">Joined Date</Label>
                        <div className="font-medium">{profileData.joinedDate}</div>
                    </div>
                    <div>
                        <Label className="text-muted-foreground text-xs mb-1">First Name</Label>
                        <div className="font-medium">{profileData.firstName}</div>
                    </div>
                    <div>
                        <Label className="text-muted-foreground text-xs mb-1">Last Name</Label>
                        <div className="font-medium">{profileData.lastName}</div>
                    </div>
                    <div className="md:col-span-2">
                        <Label className="text-muted-foreground text-xs mb-1">Email</Label>
                        <div className="font-medium">{profileData.email}</div>
                    </div>
                </div>
                <Button onClick={onEdit}>Edit Profile</Button>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        aria-invalid={!!errors.firstName}
                        className="mt-1.5"
                    />
                    {errors.firstName && (
                        <p className="text-sm text-destructive mt-1.5">{errors.firstName}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        aria-invalid={!!errors.lastName}
                        className="mt-1.5"
                    />
                    {errors.lastName && (
                        <p className="text-sm text-destructive mt-1.5">{errors.lastName}</p>
                    )}
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        aria-invalid={!!errors.email}
                        className="mt-1.5"
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive mt-1.5">{errors.email}</p>
                    )}
                </div>
            </div>
            <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Save Changes
                        </>
                    )}
                </Button>
                <Button variant="secondary" onClick={handleCancel} disabled={isSaving}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
