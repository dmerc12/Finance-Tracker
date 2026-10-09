import React from 'react';

/**
 * Admin-only user management page.
 * <p>Renders a placeholder until a real CRUD UI is delivered.
 * The route exists here so {@code ProtectedRoute requiredRoles={['ROLE_ADMIN']}}
 * has a concrete consumer in the route tree rather than just unit tests.
 */
const UserManagement: React.FC = () => {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-slate-600">Admin tools for managing users will appear here.</p>
            </div>
        </div>
    );
};

export default UserManagement;
