import { User, Settings as SettingsIcon, Shield, Database, X, AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../hooks';
import {
    ProfileForm,
    PreferencesForm,
    PasswordForm,
    ClearDataModal,
    DeleteProfileModal,
} from '../components/settings';
import {
    Button,
    Card,
    CardContent,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Alert,
    AlertTitle,
    AlertDescription,
    Separator,
} from '../components/ui';

const Settings: React.FC = () => {
    const {
        isEditingProfile,
        setIsEditingProfile,
        profileData,
        isSavingProfile,
        profileSuccess,
        setProfileSuccess,
        handleSaveProfile,
        preferences,
        setPreferences,
        isSavingPreferences,
        preferencesSuccess,
        setPreferencesSuccess,
        handleSavePreferences,
        isSavingPassword,
        passwordSuccess,
        setPasswordSuccess,
        handleChangePassword,
        showClearDataModal,
        setShowClearDataModal,
        showDeleteProfileModal,
        setShowDeleteProfileModal,
        isExporting,
        handleExportTransactions,
        handleClearData,
        handleDeleteProfile,
    } = useSettings();

    const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'data'>(
        'profile'
    );

    const tabs = [
        { id: 'profile' as const, label: 'Profile', icon: User },
        { id: 'preferences' as const, label: 'Preferences', icon: SettingsIcon },
        { id: 'security' as const, label: 'Security', icon: Shield },
        { id: 'data' as const, label: 'Data', icon: Database },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="max-x-6xl mx-auto">
                <Card className="shadow-sm">
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
                    >
                        <div className="border-b px-6 pt-6">
                            <TabsList className="w-full justify-start bg-transparent border-0 p-0 h-auto gap-1">
                                {tabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.id}
                                        value={tab.id}
                                        className="flex items-center gap-2 data-[state=active]:bg-transparent 
                                            data-[state=active]:border-b-2 data-[state=active]:border-primary
                                            rounded-none px-4 py-2"
                                    >
                                        <tab.icon size={18} />
                                        <span className="hidden md:inline">{tab.label}</span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                        <CardContent className="p-6">
                            {/* Profile Tab */}
                            <TabsContent value="profile">
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <h4 className="text-lg font-semibold mb-4">
                                        Profile Information
                                    </h4>
                                    {profileSuccess && (
                                        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                                            <AlertDescription className="flex items-center justify-between">
                                                Profile updated successfully!
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 -mr-2"
                                                    onClick={() => setProfileSuccess(false)}
                                                >
                                                    <X size={14} />
                                                </Button>
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                    <ProfileForm
                                        profileData={profileData}
                                        isEditing={isEditingProfile}
                                        onEdit={() => setIsEditingProfile(true)}
                                        onCancel={() => setIsEditingProfile(false)}
                                        onSave={handleSaveProfile}
                                        isSaving={isSavingProfile}
                                    />
                                </motion.div>
                            </TabsContent>
                            {/* Preferences Tab */}
                            <TabsContent value="preferences">
                                <motion.div
                                    key="preferences"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <h4 className="text-lg font-semibold mb-4">Preferences</h4>
                                    {preferencesSuccess && (
                                        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                                            <AlertDescription className="flex items-center justify-between">
                                                Preferences saved successfully!
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 -mr-2"
                                                    onClick={() => setPreferencesSuccess(false)}
                                                >
                                                    <X size={14} />
                                                </Button>
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                    <PreferencesForm
                                        preferences={preferences}
                                        onChange={setPreferences}
                                        onSave={handleSavePreferences}
                                        isSaving={isSavingPreferences}
                                    />
                                </motion.div>
                            </TabsContent>
                            {/* Security Tab */}
                            <TabsContent value="security">
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <h4 className="text-lg font-semibold mb-4">Change Password</h4>
                                    {passwordSuccess && (
                                        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                                            <AlertDescription className="flex items-center justify-between">
                                                Password changed successfully!
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 -mr-2"
                                                    onClick={() => setPasswordSuccess(false)}
                                                >
                                                    <X size={14} />
                                                </Button>
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                    <PasswordForm
                                        onSave={handleChangePassword}
                                        isSaving={isSavingPassword}
                                    />
                                </motion.div>
                            </TabsContent>

                            {/* Data Tab */}
                            <TabsContent value="data">
                                <motion.div
                                    key="data"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <h4 className="text-lg font-semibold mb-4">Data Management</h4>
                                    <div className="mb-8">
                                        <h5 className="text-base font-semibold mb-3">
                                            Export Data
                                        </h5>
                                        <p className="text-muted-foreground mb-3">
                                            Download all your account and transaction data in CSV
                                            format.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={handleExportTransactions}
                                            disabled={isExporting}
                                        >
                                            {isExporting ? 'Exporting...' : 'Export All Data (CSV)'}
                                        </Button>
                                    </div>
                                    <Separator className="mb-6" />
                                    <div>
                                        <h5 className="text-base font-semibold mb-3 text-destructive">
                                            Danger Zone
                                        </h5>
                                        <Alert
                                            variant="destructive"
                                            className="mb-4 bg-amber-50 border-amber-200 text-amber-900"
                                        >
                                            <AlertTitle>
                                                <strong>Warning:</strong>
                                            </AlertTitle>
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertDescription className="text-sm">
                                                These actions cannot be undone.
                                            </AlertDescription>
                                        </Alert>
                                        <div className="space-y-3">
                                            <Card>
                                                <CardContent className="pt-6 pb-4">
                                                    <h6 className="font-semibold mb-2">
                                                        Clear All Data
                                                    </h6>
                                                    <p className="text-muted-foreground text-sm mb-3">
                                                        Permanently delete all accounts and
                                                        transactions.
                                                    </p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setShowClearDataModal(true)}
                                                        className="border-destructive text-destructive hover:text-white"
                                                    >
                                                        Clear All Data
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                            <Card className="border-destructive">
                                                <CardContent className="pt-6 pb-4">
                                                    <h6 className="font-semibold mb-2 text-destructive">
                                                        Delete Profile
                                                    </h6>
                                                    <p className="text-muted-foreground text-sm mb-3">
                                                        Permanently delete your account and all
                                                        associated data.
                                                    </p>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            setShowDeleteProfileModal(true)
                                                        }
                                                    >
                                                        Delete Profile
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </motion.div>
                            </TabsContent>
                        </CardContent>
                    </Tabs>
                </Card>
                <ClearDataModal
                    open={showClearDataModal}
                    onOpenChange={setShowClearDataModal}
                    onConfirm={handleClearData}
                />
                <DeleteProfileModal
                    open={showDeleteProfileModal}
                    onOpenChange={setShowDeleteProfileModal}
                    onConfirm={handleDeleteProfile}
                />
            </div>
        </motion.div>
    );
};

export default Settings;
