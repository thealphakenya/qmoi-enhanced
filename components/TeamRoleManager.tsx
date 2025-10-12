import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RoleManagementService, User, UserRole, ApprovalRequest } from '../scripts/services/role_management';

const defaultRoles: UserRole[] = ['master', 'admin', 'marketing', 'analytics', 'content', 'support', 'user'];

const initialTeam: User[] = [
  { id: '1', name: 'Master User', role: 'master' },
  { id: '2', name: 'Alice', role: 'marketing' },
  { id: '3', name: 'Bob', role: 'analytics' },
];

const initialApprovals: ApprovalRequest[] = [
  {
    id: 'req1',
    type: 'asset',
    item: { name: 'QMOI Trailer' },
    status: 'pending',
    requestedBy: initialTeam[1],
    steps: ['marketing', 'admin', 'master'],
    currentStep: 0,
  },
  {
    id: 'req2',
    type: 'deal',
    item: { description: 'Launch Discount' },
    status: 'pending',
    requestedBy: initialTeam[2],
    steps: ['analytics', 'master'],
    currentStep: 0,
  },
];

const TeamRoleManager: React.FC = () => {
  const [team, setTeam] = useState<User[]>(initialTeam);
  const [newUser, setNewUser] = useState({ name: '', role: 'user' as UserRole });
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(initialApprovals);
  const isMaster = team[0].role === 'master'; // Simulate master login

  const addUser = () => {
    if (!newUser.name.trim()) return;
    setTeam(prev => [...prev, { id: Date.now().toString(), name: newUser.name, role: newUser.role }]);
    setNewUser({ name: '', role: 'user' });
  };

  const assignRole = (userId: string, role: UserRole) => {
    setTeam(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    RoleManagementService.assignRole(userId, role);
  };

  const approveRequest = (req: ApprovalRequest, approver: User) => {
    setApprovals(prev => prev.map(r =>
      r.id === req.id
        ? {
            ...r,
            currentStep: (r.currentStep || 0) + 1,
            status: ((r.currentStep || 0) + 1) >= (r.steps?.length || 1) ? 'approved' : 'pending',
            approvedBy: approver,
          }
        : r
    ));
    RoleManagementService.approveRequest(req.id, approver);
  };

  const rejectRequest = (req: ApprovalRequest, approver: User) => {
    setApprovals(prev => prev.map(r =>
      r.id === req.id
        ? { ...r, status: 'rejected', approvedBy: approver }
        : r
    ));
    RoleManagementService.rejectRequest(req.id, approver);
  };

  return (
    <div className="my-8">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Team Role Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Team</Label>
            <ul className="mt-2 space-y-1">
              {team.map(user => (
                <li key={user.id} className="flex items-center gap-2">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-xs text-gray-500">({user.role})</span>
                  {isMaster && user.role !== 'master' && (
                    <select
                      value={user.role}
                      onChange={e => assignRole(user.id, e.target.value as UserRole)}
                      className="ml-2 border rounded px-1 py-0.5 text-xs"
                    >
                      {defaultRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {isMaster && (
            <div className="flex gap-2 mt-4">
              <Input
                value={newUser.name}
                onChange={e => setNewUser(n => ({ ...n, name: e.target.value }))}
                placeholder="New user name"
              />
              <select
                value={newUser.role}
                onChange={e => setNewUser(n => ({ ...n, role: e.target.value as UserRole }))}
                className="border rounded px-1 py-0.5 text-xs"
              >
                {defaultRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <Button onClick={addUser} disabled={!newUser.name.trim()}>Add User</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Approval Workflows</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {approvals.map(req => (
              <li key={req.id} className="border rounded p-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{req.type.toUpperCase()}</span>
                  <span className="text-xs text-gray-500">Requested by: {req.requestedBy.name}</span>
                  <span className="text-xs text-gray-400">Status: {req.status}</span>
                </div>
                <div className="text-xs mt-1">Item: {JSON.stringify(req.item)}</div>
                <div className="flex gap-2 mt-2">
                  {req.status === 'pending' && team.map(user => (
                    req.steps && req.steps[req.currentStep || 0] === user.role ? (
                      <>
                        <Button key={user.id} size="sm" onClick={() => approveRequest(req, user)}>
                          Approve as {user.role}
                        </Button>
                        <Button key={user.id + '-r'} size="sm" variant="destructive" onClick={() => rejectRequest(req, user)}>
                          Reject as {user.role}
                        </Button>
                      </>
                    ) : null
                  ))}
                  {req.status === 'approved' && <span className="text-green-600 font-bold">Approved</span>}
                  {req.status === 'rejected' && <span className="text-red-600 font-bold">Rejected</span>}
                </div>
                {req.status !== 'pending' && req.approvedBy && (
                  <div className="text-xs text-gray-400 mt-1">Finalized by: {req.approvedBy.name} ({req.approvedBy.role})</div>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamRoleManager; 