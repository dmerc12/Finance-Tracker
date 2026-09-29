import validateRegister from './validateRegister';

describe('validateRegister', () => {
    const validValues = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'Pass123!',
        passwordConfirm: 'Pass123!',
    };

    it('returns empty object for valid input', () => {
        expect(validateRegister(validValues)).toEqual({});
    });

    it('requires email', () => {
        expect(validateRegister({ ...validValues, email: '' })).toHaveProperty('email');
    });

    it('validates email format', () => {
        expect(validateRegister({ ...validValues, email: 'invalid' })).toHaveProperty('email');
    });

    it('requires password', () => {
        expect(validateRegister({ ...validValues, password: '' })).toHaveProperty('password');
    });

    it('password requires capital letter', () => {
        expect(validateRegister({ ...validValues, password: 'pass123!' })).toHaveProperty(
            'password'
        );
    });

    it('password requires lowercase letter', () => {
        expect(validateRegister({ ...validValues, password: 'PASS123!' })).toHaveProperty(
            'password'
        );
    });

    it('password requires digit', () => {
        expect(validateRegister({ ...validValues, password: 'Password!' })).toHaveProperty(
            'password'
        );
    });

    it('password requires special character', () => {
        expect(validateRegister({ ...validValues, password: 'Password123' })).toHaveProperty(
            'password'
        );
    });

    it('checks password is not similar to first name', () => {
        expect(validateRegister({ ...validValues, password: 'Joh123!$' })).toHaveProperty(
            'password'
        );
    });

    it('checks password is not similar to last name', () => {
        expect(validateRegister({ ...validValues, password: 'Doe123!$' })).toHaveProperty(
            'password'
        );
    });

    it('checks password is not similar to email', () => {
        expect(validateRegister({ ...validValues, password: 'Tes123!$' })).toHaveProperty(
            'password'
        );
    });

    it('requires password confirmation', () => {
        expect(validateRegister({ ...validValues, passwordConfirm: '' })).toHaveProperty(
            'passwordConfirm'
        );
    });

    it('checks password match', () => {
        expect(validateRegister({ ...validValues, passwordConfirm: 'Other123!' })).toHaveProperty(
            'passwordConfirm'
        );
    });

    it('requires first name', () => {
        expect(validateRegister({ ...validValues, firstName: '' })).toHaveProperty('firstName');
    });

    it('limits first name length', () => {
        expect(validateRegister({ ...validValues, firstName: 'a'.repeat(101) })).toHaveProperty(
            'firstName'
        );
    });

    it('requires last name', () => {
        expect(validateRegister({ ...validValues, lastName: '' })).toHaveProperty('lastName');
    });

    it('limits last name length', () => {
        expect(validateRegister({ ...validValues, lastName: 'a'.repeat(101) })).toHaveProperty(
            'lastName'
        );
    });
});
