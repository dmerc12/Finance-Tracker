import validateRegisterRequest from './validateRegisterRequest';

describe('validateRegisterRequest', () => {
    const validValues = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'Pass123!',
        passwordConfirm: 'Pass123!',
    };

    it('returns empty object for valid input', () => {
        expect(validateRegisterRequest(validValues)).toEqual({});
    });

    it('requires email', () => {
        expect(validateRegisterRequest({ ...validValues, email: '' })).toHaveProperty('email');
    });

    it('validates email format', () => {
        expect(validateRegisterRequest({ ...validValues, email: 'invalid' })).toHaveProperty(
            'email'
        );
    });

    it('requires password', () => {
        expect(validateRegisterRequest({ ...validValues, password: '' })).toHaveProperty(
            'password'
        );
    });

    it('password requires capital letter', () => {
        expect(validateRegisterRequest({ ...validValues, password: 'pass123!' })).toHaveProperty(
            'password'
        );
    });

    it('password requires lowercase letter', () => {
        expect(validateRegisterRequest({ ...validValues, password: 'PASS123!' })).toHaveProperty(
            'password'
        );
    });

    it('password requires digit', () => {
        expect(validateRegisterRequest({ ...validValues, password: 'Password!' })).toHaveProperty(
            'password'
        );
    });

    it('password requires special character', () => {
        expect(validateRegisterRequest({ ...validValues, password: 'Password123' })).toHaveProperty(
            'password'
        );
    });

    it('requires password confirmation', () => {
        expect(validateRegisterRequest({ ...validValues, passwordConfirm: '' })).toHaveProperty(
            'passwordConfirm'
        );
    });

    it('checks password match', () => {
        expect(
            validateRegisterRequest({ ...validValues, passwordConfirm: 'Other123!' })
        ).toHaveProperty('passwordConfirm');
    });

    it('requires first name', () => {
        expect(validateRegisterRequest({ ...validValues, firstName: '' })).toHaveProperty(
            'firstName'
        );
    });

    it('limits first name length', () => {
        expect(
            validateRegisterRequest({ ...validValues, firstName: 'a'.repeat(101) })
        ).toHaveProperty('firstName');
    });

    it('requires last name', () => {
        expect(validateRegisterRequest({ ...validValues, lastName: '' })).toHaveProperty(
            'lastName'
        );
    });

    it('limits last name length', () => {
        expect(
            validateRegisterRequest({ ...validValues, lastName: 'a'.repeat(101) })
        ).toHaveProperty('lastName');
    });
});
