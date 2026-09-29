import { getPasswordStrength, checkPasswordRequirements } from './passwordStrength.ts';
import { describe, it, expect } from 'vitest';

describe('checkPasswordRequirements', () => {
    const getReq = (password: string, id: string, firstName = '', lastName = '', email = '') =>
        checkPasswordRequirements(password, firstName, lastName, email).find((r) => r.id === id);

    describe('structure', () => {
        it('returns six requirements in a stable order', () => {
            const reqs = checkPasswordRequirements('Abc123!@');
            expect(reqs).toHaveLength(6);
            expect(reqs.map((r) => r.id)).toEqual([
                'length',
                'lowercase',
                'uppercase',
                'digit',
                'special',
                'personalInfo',
            ]);
        });

        it('includes a human-readable label for each requirement', () => {
            const reqs = checkPasswordRequirements('Abc123!@');
            for (const req of reqs) {
                expect(req.label).toBeTruthy();
                expect(typeof req.label).toBe('string');
            }
        });
    });

    describe('empty password', () => {
        it('marks all base requirements unmet', () => {
            const reqs = checkPasswordRequirements('');
            const base = reqs.filter((r) => r.id !== 'personalInfo');
            expect(base.every((r) => !r.met)).toBe(true);
        });

        it('marks personalInfo as met when no fields are filled', () => {
            expect(getReq('', 'personalInfo')?.met).toBe(true);
        });
    });

    describe('individual criteria', () => {
        it('length', () => {
            expect(getReq('Ab1!xyz', 'length')?.met).toBe(false);
            expect(getReq('Ab1!xyzA', 'length')?.met).toBe(true);
        });

        it('lowercase', () => {
            expect(getReq('ABC123!@', 'lowercase')?.met).toBe(false);
            expect(getReq('abc123!@', 'lowercase')?.met).toBe(true);
        });

        it('uppercase', () => {
            expect(getReq('abc123!@', 'uppercase')?.met).toBe(false);
            expect(getReq('ABC123!@', 'uppercase')?.met).toBe(true);
        });

        it('digit', () => {
            expect(getReq('Abc!@xyz', 'digit')?.met).toBe(false);
            expect(getReq('Abc1!@xy', 'digit')?.met).toBe(true);
        });

        it('special character', () => {
            expect(getReq('Abc123xy', 'special')?.met).toBe(false);
            expect(getReq('Abc123!x', 'special')?.met).toBe(true);
        });
    });

    describe('all criteria met', () => {
        it('marks every requirement met for a strong password with no personal info', () => {
            const reqs = checkPasswordRequirements('Abc123!@');
            expect(reqs.every((r) => r.met)).toBe(true);
        });

        it('accepts each supported special character', () => {
            for (const char of ['@', '$', '!', '%', '*', '?', '&']) {
                const reqs = checkPasswordRequirements(`Abc123${char}x`);
                expect(reqs.find((r) => r.id === 'special')?.met).toBe(true);
            }
        });
    });

    describe('personalInfo requirement', () => {
        it('is unmet when the password contains a firstName substring', () => {
            expect(getReq('Dyl123!@', 'personalInfo', 'Dylan')?.met).toBe(false);
        });

        it('is unmet when the password contains a lastName substring', () => {
            expect(getReq('Smi123!@', 'personalInfo', '', 'Smith')?.met).toBe(false);
        });

        it('is unmet when the password contains an email local-part substring', () => {
            expect(getReq('Ali123!@', 'personalInfo', '', '', 'alice@example.com')?.met).toBe(
                false
            );
        });

        it('is met when no identifier overlaps', () => {
            expect(
                getReq('Abc123!@', 'personalInfo', 'Dylan', 'Smith', 'alice@example.com')?.met
            ).toBe(true);
        });

        it('is met when no personal info is provided', () => {
            expect(getReq('Abc123!@', 'personalInfo')?.met).toBe(true);
        });

        it('ignores identifiers shorter than three characters', () => {
            expect(getReq('Jogging123!', 'personalInfo', 'Jo')?.met).toBe(true);
        });

        it('is case-insensitive', () => {
            expect(getReq('DYL123!@', 'personalInfo', 'dylan')?.met).toBe(false);
        });
    });

    describe('reactivity across a form', () => {
        it('flips personalInfo from met to unmet as the user types a name', () => {
            const withNoName = checkPasswordRequirements('Dyl123!@');
            expect(withNoName.find((r) => r.id === 'personalInfo')?.met).toBe(true);
            const withName = checkPasswordRequirements('Dyl123!@', 'Dylan');
            expect(withName.find((r) => r.id === 'personalInfo')?.met).toBe(false);
        });

        it('progressively marks criteria as the password grows', () => {
            expect(checkPasswordRequirements('a').filter((r) => r.met)).toHaveLength(2);
            expect(checkPasswordRequirements('aB').filter((r) => r.met)).toHaveLength(3);
            expect(checkPasswordRequirements('aB1').filter((r) => r.met)).toHaveLength(4);
            expect(checkPasswordRequirements('aB1!').filter((r) => r.met)).toHaveLength(5);
            expect(checkPasswordRequirements('aB1!cd').filter((r) => r.met)).toHaveLength(5);
            expect(checkPasswordRequirements('aB1!cdef').filter((r) => r.met)).toHaveLength(6);
        });
    });
});

describe('getPasswordStrength', () => {
    describe('empty password', () => {
        it('returns 0', () => {
            expect(getPasswordStrength('')).toBe(0);
        });

        it('returns 0 even when personal info is provided', () => {
            expect(getPasswordStrength('', 'Bill', 'Smith', 'smith@example.com')).toBe(0);
        });
    });

    describe('base criteria (1 point each, plus bonus)', () => {
        it('scores length >= 8', () => {
            expect(getPasswordStrength('abcdefgh', '', '', '')).toBe(3);
        });

        it('scores lowercase', () => {
            expect(getPasswordStrength('abc', '', '', '')).toBe(2);
        });

        it('scores uppercase', () => {
            expect(getPasswordStrength('ABC', '', '', '')).toBe(2);
        });

        it('scored digits', () => {
            expect(getPasswordStrength('123', '', '', '')).toBe(2);
        });

        it('scores special characters', () => {
            expect(getPasswordStrength('@!*', '', '', '')).toBe(2);
        });

        it('scores all 6 criteria', () => {
            expect(getPasswordStrength('Abc123!@', '', '', '')).toBe(6);
        });
    });

    describe('password free of personal info', () => {
        it('gives point when no personal info is provided', () => {
            expect(getPasswordStrength('Abc123!@', '', '', '')).toBe(6);
        });

        it('gives point even when only some fields are filled', () => {
            expect(getPasswordStrength('Qxz123!@', 'Bill', '', '')).toBe(6);
        });
    });

    describe('personal info detection - first name', () => {
        it('flags the 3-char prefix', () => {
            expect(getPasswordStrength('Dyl123!@', 'Dylan', '', '')).toBe(5);
        });

        it('flags 3-char suffix', () => {
            expect(getPasswordStrength('Ylan!@', 'Dylan', '', '')).toBe(3);
        });

        it('flags a 3-char middle substring', () => {
            expect(getPasswordStrength('Lan123!@', 'Dylan', '', '')).toBe(5);
        });

        it('flags a full-name match', () => {
            expect(getPasswordStrength('Dylan123!', 'Dylan', '', '')).toBe(5);
        });

        it('is case-insensitive', () => {
            expect(getPasswordStrength('DYL123!@', 'dylan', '', '')).toBe(4);
        });

        it('does not flag when no 3-char overlap exists', () => {
            expect(getPasswordStrength('Qxz123!@', 'Dylan', '', '')).toBe(6);
        });
    });

    describe('personal info detection - last name', () => {
        it('flags the 3-char prefix', () => {
            expect(getPasswordStrength('Smi123!@', '', 'Smith', '')).toBe(5);
        });

        it('flags 3-char suffix', () => {
            expect(getPasswordStrength('Ith123!@', '', 'Smith', '')).toBe(5);
        });

        it('flags a 3-char middle substring', () => {
            expect(getPasswordStrength('Mit123!@', '', 'Smith', '')).toBe(5);
        });

        it('flags a full-name match', () => {
            expect(getPasswordStrength('Smith123!', '', 'Smith', '')).toBe(5);
        });

        it('is case-insensitive', () => {
            expect(getPasswordStrength('SMI123!@', '', 'smith', '')).toBe(4);
        });

        it('does not flag when no 3-char overlap exists', () => {
            expect(getPasswordStrength('Qxz123!@', '', 'Smith', '')).toBe(6);
        });
    });

    describe('personal info detection - email', () => {
        it('flags the 3-char prefix', () => {
            expect(getPasswordStrength('Ali123!@', '', '', 'alice@example.com')).toBe(5);
        });

        it('flags 3-char suffix', () => {
            expect(getPasswordStrength('Ice123!@', '', '', 'alice@example.com')).toBe(5);
        });

        it('flags a 3-char middle substring', () => {
            expect(getPasswordStrength('Lic123!@', '', '', 'alice@example.com')).toBe(5);
        });

        it('flags a full-name match', () => {
            expect(getPasswordStrength('Alice123!', '', '', 'alice@example.com')).toBe(5);
        });

        it('is case-insensitive', () => {
            expect(getPasswordStrength('ALI123!@', '', '', 'alice@example.com')).toBe(4);
        });

        it('does not flag when no 3-char overlap exists', () => {
            expect(getPasswordStrength('Qxz123!@', '', '', 'alice@example.com')).toBe(6);
        });

        it('does not flag substrings of the email domain', () => {
            expect(getPasswordStrength('Xam123!@', '', '', 'alice@example.com')).toBe(6);
        });

        it('handles email without an @ gracefully', () => {
            expect(getPasswordStrength('Ali123!@', '', '', 'alice')).toBe(5);
        });
    });

    describe('personal info detection - edge cases', () => {
        it('ignores names shorter than 3 characters', () => {
            expect(getPasswordStrength('Jogging123!', 'Jo', '', '')).toBe(6);
        });

        it('strips non-alphanumerics from identifiers', () => {
            expect(getPasswordStrength('Lan123!@', '', '', 'dylan.smith@example.com')).toBe(5);
        });

        it('handles multi-word names by stripping spaces', () => {
            expect(getPasswordStrength('Der123!@', 'Van Der Berg', '', '')).toBe(5);
        });

        it('is case-insensitive across all fields', () => {
            expect(getPasswordStrength('dyl123!@', 'DYLAN', '', '')).toBe(4);
            expect(getPasswordStrength('smi123!@', '', 'SMITH', '')).toBe(4);
            expect(getPasswordStrength('ali123!@', '', '', 'ALICE@example.com')).toBe(4);
        });

        it('flags overlap across any provided field', () => {
            expect(getPasswordStrength('Smi123!@', 'Dylan', 'Johnson', 'smith@example.com')).toBe(
                5
            );
        });
    });

    describe('score boundaries', () => {
        it('returns 5 max when personal criteria overlaps', () => {
            expect(getPasswordStrength('Dylan123!@', 'Dylan', '', '')).toBe(5);
        });

        it('returns 6 max when no overlap', () => {
            expect(getPasswordStrength('Abc123!@', '', '', '')).toBe(6);
        });
    });
});
