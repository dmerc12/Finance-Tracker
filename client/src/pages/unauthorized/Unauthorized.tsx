import { Card, CardContent, Button } from '../../components/ui';
import { useNavigate } from 'react-router-dom';
import React from 'react';

/**
 * Landing page shown when an authenticated user lacks the role required by a guarded route.
 * Distinct from the login redirect so admins see an honest "access denied" message rather
 * than a confusing re-login prompt.
 */
const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <Card className="shadow-lg max-w-md w-full">
                <CardContent className="p-8 text-center">
                    <h1 className="text-2xl font-bold mb-2">Access denied</h1>
                    <p className="text-slate-600 mb-6">
                        You don't have permission to view this page.
                    </p>
                    <Button onClick={() => navigate('/')}>Back to dashboard</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Unauthorized;
