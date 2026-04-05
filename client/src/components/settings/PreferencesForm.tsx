import { Save, Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Button,
    Label,
} from '../ui';

interface PreferencesData {
    currency: string;
    dateFormat: string;
    language: string;
}

interface PreferencesFormProps {
    preferences: PreferencesData;
    onChange: (preferences: PreferencesData) => void;
    onSave: () => void;
    isSaving?: boolean;
}

export default function PreferencesForm({
    preferences,
    onChange,
    onSave,
    isSaving = false,
}: PreferencesFormProps) {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                        value={preferences.currency}
                        onValueChange={(value) => onChange({ ...preferences, currency: value })}
                    >
                        <SelectTrigger id="currency" className="mt-1.5">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USD">USD - US Dollar ($)</SelectItem>
                            <SelectItem value="EUR">EUR - Euro (€)</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound (£)</SelectItem>
                            <SelectItem value="JPY">JPY - Japanese Yen (¥)</SelectItem>
                            <SelectItem value="CAD">CAD - Canadian Dollar ($)</SelectItem>
                            <SelectItem value="AUD">AUD - Australian Dollar ($)</SelectItem>
                            <SelectItem value="CHF">CHF - Swiss Franc (Fr)</SelectItem>
                            <SelectItem value="CNY">CNY - Chinese Yuan (¥)</SelectItem>
                            <SelectItem value="INR">INR - Indian Rupee (₹)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                        value={preferences.dateFormat}
                        onValueChange={(value) => onChange({ ...preferences, dateFormat: value })}
                    >
                        <SelectTrigger id="dateFormat" className="mt-1.5">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (02/23/2026)</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (23/02/2026)</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2026-02-23)</SelectItem>
                            <SelectItem value="DD MMM YYYY">DD MMM YYYY (23 Feb 2026)</SelectItem>
                            <SelectItem value="MMM DD, YYYY">
                                MMM DD, YYYY (Feb 23, 2026)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                        value={preferences.language}
                        onValueChange={(value) => onChange({ ...preferences, language: value })}
                    >
                        <SelectTrigger id="language" className="mt-1.5">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Español (Spanish)</SelectItem>
                            <SelectItem value="French">Français (French)</SelectItem>
                            <SelectItem value="German">Deutsch (German)</SelectItem>
                            <SelectItem value="Italian">Italiano (Italian)</SelectItem>
                            <SelectItem value="Portuguese">Português (Portuguese)</SelectItem>
                            <SelectItem value="Chinese">中文 (Chinese)</SelectItem>
                            <SelectItem value="Japanese">日本語 (Japanese)</SelectItem>
                            <SelectItem value="Korean">한국어 (Korean)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save size={18} />
                        Save Preferences
                    </>
                )}
            </Button>
        </div>
    );
}
