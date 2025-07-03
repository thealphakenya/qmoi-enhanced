import React from 'react';
import QCityDevicePanel from './QCityDevicePanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Cloud, Database } from 'lucide-react';

export default function QCityDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            QCity Device Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="default">QCity Active</Badge>
            <Badge variant="secondary">Resource Offloading Enabled</Badge>
            <Badge variant="outline">Cloud Storage</Badge>
          </div>
          <p className="text-muted-foreground">
            QCity serves as the primary device for all QMOI operations, ensuring your local device remains lightweight and responsive.
          </p>
        </CardContent>
      </Card>

      <QCityDevicePanel />
    </div>
  );
} 