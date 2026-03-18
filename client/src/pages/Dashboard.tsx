import React from 'react';
import PlaceholderForm from '../components/PlaceholderForm';

const Dashboard: React.FC = () => {
    return (
        <div>
            <h1>Dashboard Page</h1>
            <button className="btn btn-primary">Test Bootstrap</button>
            <PlaceholderForm />
        </div>
    );
};

export default Dashboard;
