import React from 'react';

interface RoleBasedDashboardProps {
  role: string;
}

const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ role }) => {
  return (
    <div className="role-dashboard">
      <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h2>
      {/* Render role-specific features */}
      {role === 'student' && <div>Study planner, assignments, learning resources</div>}
      {role === 'doctor' && <div>Patient management, appointments, medical resources</div>}
      {role === 'teacher' && <div>Class schedules, grading, teaching resources</div>}
      {role === 'pharmacist' && <div>Inventory, prescriptions, pharmacy management</div>}
      {role === 'shop' && <div>Sales, inventory, customer management</div>}
      {role === 'other' && <div>Custom tools and resources</div>}
    </div>
  );
};

export default RoleBasedDashboard; 