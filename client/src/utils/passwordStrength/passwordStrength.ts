export interface PasswordRequirement {
    id: string;
    label: string;
    met: boolean;
}

/**
 * Return status of password meeting requirements for UI
 */
export function checkPasswordRequirements(
    password: string,
    firstName?: string,
    lastName?: string,
    email?: string
): PasswordRequirement[] {
    return [
        { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
        { id: 'lowercase', label: 'One lowercase letter', met: /[a-z]/.test(password) },
        { id: 'uppercase', label: 'One uppercase letter', met: /[A-Z]/.test(password) },
        { id: 'digit', label: 'One number', met: /\d/.test(password) },
        {
            id: 'special',
            label: 'One special character (@$!%*?&)',
            met: /[@$!%*?&]/.test(password),
        },
        {
            id: 'personalInfo',
            label: 'Not similar to your name or email',
            met: !containsPersonalInfo(password, firstName ?? '', lastName ?? '', email ?? ''),
        },
    ];
}

/**
 * Checks password strength, adding a point for each met criteria
 */
export function getPasswordStrength(
    password: string,
    firstName?: string,
    lastName?: string,
    email?: string
): number {
    if (!password) return 0;
    if (!firstName) firstName = '';
    if (!lastName) lastName = '';
    if (!email) email = '';
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    if (!containsPersonalInfo(password, firstName, lastName, email)) score++;
    return score;
}

/**
 * Returns true if the password contains any 3+ character substring (n-gram)
 * of the user's personal identifiers.
 *
 * Checked identifiers:
 *  - First name
 *  - Last name
 *  - Email local part only (before "@") - the domain is excluded to avoid
 *    false positives from common providers like "example", "gmail", etc.
 *
 * Comparison is case-insensitive. Identifiers are stripped of non-alphanumerics
 * before generating n-grams, so "Van Der Berg" → "vanderberg" is checked as one
 * token. Names shorter than 3 characters produce no n-grams and are ignored.
 * @param password the password being tested
 * @param firstName the user's first name
 * @param lastName the user's last name
 * @param email the user's email
 */
function containsPersonalInfo(
    password: string,
    firstName: string,
    lastName: string,
    email: string
): boolean {
    const lowerPw = password.toLowerCase();
    const MIN_LENGTH = 3;
    const substrings = new Set<string>();
    const addSubstrings = (value: string) => {
        const cleaned = value.replace(/[^a-z0-9]/gi, '').toLowerCase();
        if (cleaned.length < MIN_LENGTH) return;
        for (let i = 0; i <= cleaned.length - MIN_LENGTH; ++i) {
            substrings.add(cleaned.slice(i, i + MIN_LENGTH));
        }
    };
    if (firstName) addSubstrings(firstName);
    if (lastName) addSubstrings(lastName);
    if (email) {
        const localPart = email.trim().split('@')[0];
        if (localPart) addSubstrings(localPart);
    }
    for (const substring of substrings) {
        if (lowerPw.includes(substring)) return true;
    }
    return false;
}
