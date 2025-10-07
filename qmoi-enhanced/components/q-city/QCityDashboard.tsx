import React, { useState } from 'react';
import QCityDevicePanel from './QCityDevicePanel';
import QVillage from './QVillage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Server, Cloud, Database, Globe, Shield } from 'lucide-react';

export default function QCityDashboard() {
  const [isMaster, setIsMaster] = useState(false);

  const handleMasterToggle = () => {
    setIsMaster(!isMaster);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            QCity Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="default">QCity Active</Badge>
            <Badge variant="secondary">Resource Offloading Enabled</Badge>
            <Badge variant="outline">Cloud Storage</Badge>
            {isMaster && <Badge variant="destructive">Master Mode</Badge>}
          </div>
          <p className="text-muted-foreground mb-4">
            QCity serves as the primary device for all QMOI operations, ensuring your local device remains lightweight and responsive.
          </p>
          <button
            onClick={handleMasterToggle}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {isMaster ? 'Disable Master Mode' : 'Enable Master Mode'}
          </button>
        </CardContent>
      </Card>

      <Tabs defaultValue="device" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="device" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Device Management
          </TabsTrigger>
          <TabsTrigger value="qvillage" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            QVillage (Master Only)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="device" className="space-y-6">
          <QCityDevicePanel />
        </TabsContent>

        <TabsContent value="qvillage" className="space-y-6">
          <QVillage isMaster={isMaster} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 