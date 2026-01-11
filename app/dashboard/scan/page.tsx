'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ScanStatus = 'idle' | 'running' | 'completed';
type StepStatus = 'pending' | 'running' | 'completed';

interface ScanStep {
  id: string;
  name: string;
  status: StepStatus;
  count: number;
  wasteDetected: number;
}

export default function RunScanPage() {
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [steps, setSteps] = useState<ScanStep[]>([
    { id: 'ec2', name: 'EC2 Instances', status: 'pending', count: 0, wasteDetected: 0 },
    { id: 's3', name: 'S3 Buckets', status: 'pending', count: 0, wasteDetected: 0 },
    { id: 'rds', name: 'RDS Databases', status: 'pending', count: 0, wasteDetected: 0 },
  ]);

  const totalScanned = steps.reduce((sum, step) => sum + step.count, 0);
  const totalWaste = steps.reduce((sum, step) => sum + step.wasteDetected, 0);

  const handleStartScan = async () => {
    setScanStatus('running');

    for (let i = 0; i < steps.length; i++) {
      setSteps((prev) =>
        prev.map((step, idx) =>
          idx === i ? { ...step, status: 'running' } : step
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const randomCount = Math.floor(Math.random() * 50) + 10;
      const randomWaste = Math.floor(Math.random() * randomCount * 0.3);

      setSteps((prev) =>
        prev.map((step, idx) =>
          idx === i
            ? {
                ...step,
                status: 'completed',
                count: randomCount,
                wasteDetected: randomWaste,
              }
            : step
        )
      );
    }

    setScanStatus('completed');
  };

  const getStatusBadgeVariant = (status: ScanStatus) => {
    switch (status) {
      case 'idle':
        return 'secondary';
      case 'running':
        return 'default';
      case 'completed':
        return 'default';
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              Infrastructure Scan
            </h1>
            <p className="text-sm text-slate-600">
              Analyze cloud resources for optimization opportunities
            </p>
          </div>
          <Badge
            variant={getStatusBadgeVariant(scanStatus)}
            className={cn(
              'text-xs font-medium',
              scanStatus === 'idle' && 'bg-slate-200 text-slate-700',
              scanStatus === 'running' && 'bg-blue-100 text-blue-700',
              scanStatus === 'completed' && 'bg-green-100 text-green-700'
            )}
          >
            {scanStatus === 'idle' && 'Ready'}
            {scanStatus === 'running' && 'Scanning...'}
            {scanStatus === 'completed' && 'Completed'}
          </Badge>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan Configuration</CardTitle>
              <CardDescription>
                Scanning across all configured regions: us-east-1, us-west-2
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                onClick={handleStartScan}
                disabled={scanStatus === 'running'}
                className="w-full"
              >
                {scanStatus === 'running' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scan in Progress
                  </>
                ) : scanStatus === 'completed' ? (
                  'Run New Scan'
                ) : (
                  'Start Scan'
                )}
              </Button>
            </CardContent>
          </Card>

          {scanStatus !== 'idle' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Scan Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              'flex h-8 w-8 items-center justify-center rounded-full border-2',
                              step.status === 'completed' &&
                                'border-green-500 bg-green-50',
                              step.status === 'running' &&
                                'border-blue-500 bg-blue-50',
                              step.status === 'pending' &&
                                'border-slate-300 bg-white'
                            )}
                          >
                            {step.status === 'completed' && (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            )}
                            {step.status === 'running' && (
                              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                            )}
                            {step.status === 'pending' && (
                              <Circle className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                          {index < steps.length - 1 && (
                            <div
                              className={cn(
                                'w-0.5 h-12 mt-2',
                                step.status === 'completed'
                                  ? 'bg-green-500'
                                  : 'bg-slate-200'
                              )}
                            />
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <h3 className="text-sm font-medium text-slate-900">
                            {step.name}
                          </h3>
                          {step.status !== 'pending' && (
                            <div className="mt-1 flex gap-4 text-xs text-slate-600">
                              <span>Resources: {step.count}</span>
                              {step.wasteDetected > 0 && (
                                <span className="text-amber-600 font-medium">
                                  Findings: {step.wasteDetected}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-slate-600 mb-1">
                        Resources Scanned
                      </p>
                      <p className="text-3xl font-semibold text-slate-900">
                        {totalScanned}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-slate-600 mb-1">
                        Potential Issues
                      </p>
                      <p className="text-3xl font-semibold text-amber-600">
                        {totalWaste}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
