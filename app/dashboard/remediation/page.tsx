'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertTriangle,
  FileCode,
  Calendar,
  CheckCircle,
  Shield,
  User,
  Clock
} from 'lucide-react';

const selectedFindings = [
  { id: 'i-0a1b2c3d4e5f6g7h8', type: 'EC2', action: 'Terminate', savings: 147.20 },
  { id: 'old-assets-archive', type: 'S3', action: 'Delete', savings: 45.30 },
  { id: 'db-staging-temp', type: 'RDS', action: 'Delete Snapshot', savings: 523.10 },
];

const pythonScript = `#!/usr/bin/env python3
import boto3
from datetime import datetime

# Initialize AWS clients
ec2 = boto3.client('ec2', region_name='us-east-1')
s3 = boto3.client('s3')
rds = boto3.client('rds', region_name='us-east-1')

def terminate_instance(instance_id):
    """Terminate EC2 instance after validation"""
    print(f"[DRY-RUN] Would terminate instance: {instance_id}")
    # ec2.terminate_instances(InstanceIds=[instance_id], DryRun=True)
    return True

def delete_s3_bucket(bucket_name):
    """Delete S3 bucket and all objects"""
    print(f"[DRY-RUN] Would delete bucket: {bucket_name}")
    # s3.delete_bucket(Bucket=bucket_name)
    return True

def delete_rds_snapshot(snapshot_id):
    """Delete RDS snapshot"""
    print(f"[DRY-RUN] Would delete snapshot: {snapshot_id}")
    # rds.delete_db_snapshot(DBSnapshotIdentifier=snapshot_id)
    return True

# Execute remediation actions
terminate_instance('i-0a1b2c3d4e5f6g7h8')
delete_s3_bucket('old-assets-archive')
delete_rds_snapshot('db-staging-temp')

print("\\n✓ Dry-run completed successfully")
print("Remove DRY-RUN comments to execute")`;

const auditLog = [
  { user: 'admin@company.com', action: 'Generated script', timestamp: '2024-01-10 14:32:11' },
  { user: 'admin@company.com', action: 'Enabled dry-run mode', timestamp: '2024-01-10 14:32:05' },
  { user: 'admin@company.com', action: 'Selected 3 findings', timestamp: '2024-01-10 14:31:48' },
];

export default function RemediationPage() {
  const [dryRunEnabled, setDryRunEnabled] = useState(true);
  const [showScript, setShowScript] = useState(false);

  const totalSavings = selectedFindings.reduce((sum, f) => sum + f.savings, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Remediation Actions
        </h1>
        <p className="text-sm text-slate-600">
          Review and execute infrastructure optimization actions
        </p>
      </div>

      <Alert className="mb-6 border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-900 font-medium text-sm">
          Destructive actions require explicit approval. All changes are logged and auditable.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Selected Findings</CardTitle>
              <CardDescription>
                {selectedFindings.length} resources queued for action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="p-3 border border-slate-200 rounded-md bg-slate-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {finding.type}
                    </Badge>
                    <span className="text-xs font-semibold text-green-700">
                      ${finding.savings.toFixed(2)}/mo
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-700 mb-1">
                    {finding.id}
                  </p>
                  <p className="text-xs text-slate-600">
                    Action: <span className="font-medium text-slate-900">{finding.action}</span>
                  </p>
                </div>
              ))}

              <div className="pt-3 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-900">
                    Total Savings
                  </span>
                  <span className="text-lg font-semibold text-green-700">
                    ${totalSavings.toFixed(2)}/mo
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resource Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <p className="text-slate-600 mb-1">Tags</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    env:staging
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    team:backend
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-slate-600 mb-1">Last Activity</p>
                <p className="text-slate-900">23 days ago</p>
              </div>
              <div>
                <p className="text-slate-600 mb-1">Created</p>
                <p className="text-slate-900">2023-11-15</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Safety Controls</CardTitle>
                  <CardDescription>Configure execution parameters</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dry-run"
                    checked={dryRunEnabled}
                    onCheckedChange={setDryRunEnabled}
                  />
                  <Label
                    htmlFor="dry-run"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Dry-Run Mode
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {dryRunEnabled && (
                <Alert className="bg-blue-50 border-blue-200 mb-4">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900 text-xs">
                    Dry-run mode enabled. No resources will be modified. Script will simulate
                    actions and report potential changes.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowScript(!showScript)}
                  variant="outline"
                  className="flex-1"
                >
                  <FileCode className="mr-2 h-4 w-4" />
                  {showScript ? 'Hide Script' : 'Generate Script'}
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Deletion
                </Button>
                <Button
                  disabled={dryRunEnabled}
                  className="flex-1"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve & Execute
                </Button>
              </div>
            </CardContent>
          </Card>

          {showScript && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Generated Script</CardTitle>
                <CardDescription>
                  Boto3 Python script for AWS API calls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 w-full rounded-md border border-slate-200 bg-slate-950 p-4">
                  <pre className="text-xs text-slate-100 font-mono leading-relaxed">
                    {pythonScript}
                  </pre>
                </ScrollArea>
                <div className="mt-3 flex justify-end">
                  <Button variant="outline" size="sm">
                    Copy to Clipboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Audit Log</CardTitle>
              <CardDescription>Recent remediation activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLog.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0"
                  >
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900 font-medium">
                        {entry.action}
                      </p>
                      <p className="text-xs text-slate-600">{entry.user}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {entry.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
