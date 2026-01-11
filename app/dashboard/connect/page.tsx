'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Loader2, Shield, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AWS_REGIONS = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-west-1',
  'eu-central-1',
  'ap-southeast-1',
  'ap-northeast-1',
];

export default function ConnectAccountPage() {
  const [accountId, setAccountId] = useState('');
  const [roleArn, setRoleArn] = useState('');
  const [externalId, setExternalId] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAccountId = (value: string) => {
    if (!value) return 'Account ID is required';
    if (!/^\d{12}$/.test(value)) return 'Must be a 12-digit number';
    return '';
  };

  const validateRoleArn = (value: string) => {
    if (!value) return 'IAM Role ARN is required';
    if (!value.startsWith('arn:aws:iam::')) return 'Invalid ARN format';
    return '';
  };

  const handleTestConnection = async () => {
    const newErrors: Record<string, string> = {};

    const accountError = validateAccountId(accountId);
    if (accountError) newErrors.accountId = accountError;

    const roleError = validateRoleArn(roleArn);
    if (roleError) newErrors.roleArn = roleError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsTestingConnection(true);

    setTimeout(() => {
      setIsTestingConnection(false);
      setConnectionStatus('success');
    }, 2000);
  };

  const handleSave = () => {
    console.log('Saving configuration...');
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Connect AWS Account
          </h1>
          <p className="text-sm text-slate-600">
            Secure, read-only access for cost analysis
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AWS Credentials</CardTitle>
            <CardDescription>
              Configure cross-account IAM role for secure access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="accountId">AWS Account ID</Label>
              <Input
                id="accountId"
                placeholder="123456789012"
                value={accountId}
                onChange={(e) => {
                  setAccountId(e.target.value);
                  setErrors((prev) => ({ ...prev, accountId: '' }));
                }}
                className={errors.accountId ? 'border-red-500' : ''}
              />
              {errors.accountId && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.accountId}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleArn">IAM Role ARN</Label>
              <Input
                id="roleArn"
                placeholder="arn:aws:iam::123456789012:role/CostOptReadOnly"
                value={roleArn}
                onChange={(e) => {
                  setRoleArn(e.target.value);
                  setErrors((prev) => ({ ...prev, roleArn: '' }));
                }}
                className={errors.roleArn ? 'border-red-500' : ''}
              />
              {errors.roleArn && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.roleArn}
                </p>
              )}
              <p className="text-xs text-slate-500">
                Role must have cost-explorer:* and ec2:Describe* permissions
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalId">External ID (optional)</Label>
              <Input
                id="externalId"
                placeholder="cloudopt-12345"
                value={externalId}
                onChange={(e) => setExternalId(e.target.value)}
              />
              <p className="text-xs text-slate-500">
                Additional security measure for AssumeRole
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="regions">Target Regions</Label>
              <Select
                onValueChange={(value) => {
                  if (!selectedRegions.includes(value)) {
                    setSelectedRegions([...selectedRegions, value]);
                  }
                }}
              >
                <SelectTrigger id="regions">
                  <SelectValue placeholder="Select regions to scan" />
                </SelectTrigger>
                <SelectContent>
                  {AWS_REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedRegions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedRegions.map((region) => (
                    <Badge
                      key={region}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedRegions(selectedRegions.filter((r) => r !== region))
                      }
                    >
                      {region} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Alert className="bg-slate-50 border-slate-200">
              <Shield className="h-4 w-4 text-slate-600" />
              <AlertDescription className="text-slate-700 text-xs">
                Credentials are never stored in plaintext. All sensitive data is encrypted at rest
                using AES-256 and in transit using TLS 1.3.
              </AlertDescription>
            </Alert>

            {connectionStatus === 'success' && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Connection Successful</p>
                    <div className="text-xs space-y-0.5">
                      <p>Account: {accountId}</p>
                      <p>Regions: {selectedRegions.join(', ') || 'All regions'}</p>
                      <p>Access Level: Read-only</p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleTestConnection}
                variant="outline"
                disabled={isTestingConnection}
                className="flex-1"
              >
                {isTestingConnection ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>
              <Button
                onClick={handleSave}
                disabled={connectionStatus !== 'success'}
                className="flex-1"
              >
                Save & Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
