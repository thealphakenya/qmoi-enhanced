import React from "react";
import {
  QMoiDatabaseDashboard,
  QMoiMemoryPanel,
  QMoiToolbar,
  QMoiAutoDevPanel,
  QMoiFileEditorChat,
  QNewsDashboard,
  QApiKeyManager,
  AccountAutomationPanel,
  SocialAutomationPanel,
  EarningDashboard,
  DocumentManagerPanel,
} from "./index";
import DeploymentStatusDashboard from "../../../components/DeploymentStatusDashboard";
import QmoiRevenueDashboard from "../../QmoiRevenueDashboard";
import { TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface RoleBasedDashboardProps {
  role: string;
  isMaster: boolean;
}

const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({
  role,
  isMaster,
}) => {
  return (
    <div className="role-dashboard">
      <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h2>
      <QMoiToolbar />
      {isMaster && (
        <div>
          <h3>QMOI Database (Master Only)</h3>
          <QMoiDatabaseDashboard isMaster={isMaster} />
        </div>
      )}
      {isMaster && <QNewsDashboard isMaster={true} />}
      {isMaster && <QMoiMemoryPanel isMaster={true} />}
      {isMaster && <DeploymentStatusDashboard isMaster={true} />}
      {isMaster && <QMoiAutoDevPanel isMaster={true} />}
      {isMaster && <QMoiFileEditorChat isMaster={true} />}
      {isMaster && <QApiKeyManager />}
      {isMaster && <AccountAutomationPanel />}
      {isMaster && <SocialAutomationPanel />}
      {isMaster && <EarningDashboard />}
      {isMaster && <DocumentManagerPanel />}
      {isMaster && <TabsTrigger value="revenue">Revenue Engine</TabsTrigger>}
      {isMaster && (
        <TabsContent value="revenue" className="space-y-4">
          <QmoiRevenueDashboard />
        </TabsContent>
      )}
      {/* Render role-specific features */}
      {role === "student" && (
        <div>Study planner, assignments, learning resources</div>
      )}
      {role === "doctor" && (
        <div>Patient management, appointments, medical resources</div>
      )}
      {role === "teacher" && (
        <div>Class schedules, grading, teaching resources</div>
      )}
      {role === "pharmacist" && (
        <div>Inventory, prescriptions, pharmacy management</div>
      )}
      {role === "shop" && <div>Sales, inventory, customer management</div>}
      {role === "other" && <div>Custom tools and resources</div>}
    </div>
  );
};

export default RoleBasedDashboard;
