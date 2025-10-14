import React, { createContext, useContext, useState } from "react";

export type Role = 'admin' | 'user' | 'guest';

const RoleContext = createContext<{ role: Role; setRole: (r: Role) => void }>({ role: 'user', setRole: () => {} });

export const useRole = () => useContext(RoleContext);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('user');
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 9999 }}>
        <label>Role: </label>
        <select value={role} onChange={e => setRole(e.target.value as Role)}>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="guest">Guest</option>
        </select>
      </div>
      {children}
    </RoleContext.Provider>
  );
}; 