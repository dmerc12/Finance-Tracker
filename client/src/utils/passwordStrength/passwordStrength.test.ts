import { getPasswordStrength } from './passwordStrength.ts';

describe('getPasswordStrength', () => {
    it('returns - for empty string', () => {
        expect(getPasswordStrength('')).toBe(0);
    });
    it('scores length >= 8', () => {
        expect(getPasswordStrength('abcdefgh')).toBe(2);
    });
    it('scores lowercase', () => {
        expect(getPasswordStrength('abc')).toBe(1);
    });
    it('scores uppercase', () => {
        expect(getPasswordStrength('ABC')).toBe(1);
    });
    it('scored digits', () => {
        expect(getPasswordStrength('123')).toBe(1);
    });
    it('scores special characters', () => {
        expect(getPasswordStrength('@!*')).toBe(1);
    });
    it('scores all 5 criteria', () => {
        const strong = 'Abc123!@';
        expect(getPasswordStrength(strong)).toBe(5);
    });
});
