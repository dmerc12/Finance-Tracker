import React from 'react';
import { useForm } from 'react-hook-form';

// This is just a placeholder to show that the library is installed.
// No actual form logic or submission is implemented.
const PlaceholderForm: React.FC = () => {
    const { register, handleSubmit } = useForm();

    const onSubmit = (d: any) => alert(JSON.stringify(d))

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="border p-3">
            <h5>Form Placeholder</h5>
            <p>React Hook Form is installed and ready.</p>
            {/* Just static inputs - no interactivity */}
            <input type="text"
                   className="form-control mb-2"
                   placeholder="Static input (non-functional)"
                   disabled
                   {...register('placeholder')}
            />

        </form>
    );
};

export default PlaceholderForm;
