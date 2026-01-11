'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MoreVertical, FileCode, Eye, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type Confidence = 'high' | 'medium' | 'low';
type Service = 'ec2' | 's3' | 'rds';

interface Finding {
  id: string;
  resourceId: string;
  service: Service;
  region: string;
  findingType: string;
  confidence: Confidence;
  estimatedSavings: number;
}

const mockFindings: Finding[] = [
  {
    id: '1',
    resourceId: 'i-0a1b2c3d4e5f6g7h8',
    service: 'ec2',
    region: 'us-east-1',
    findingType: 'Idle Instance',
    confidence: 'high',
    estimatedSavings: 147.20,
  },
  {
    id: '2',
    resourceId: 'db-prod-analytics',
    service: 'rds',
    region: 'us-west-2',
    findingType: 'Over-provisioned',
    confidence: 'medium',
    estimatedSavings: 312.80,
  },
  {
    id: '3',
    resourceId: 'legacy-backups-2022',
    service: 's3',
    region: 'us-east-1',
    findingType: 'Unused Bucket',
    confidence: 'high',
    estimatedSavings: 89.40,
  },
  {
    id: '4',
    resourceId: 'i-9z8y7x6w5v4u3t2s1',
    service: 'ec2',
    region: 'eu-west-1',
    findingType: 'Stopped Instance',
    confidence: 'high',
    estimatedSavings: 201.60,
  },
  {
    id: '5',
    resourceId: 'old-assets-archive',
    service: 's3',
    region: 'us-west-2',
    findingType: 'Lifecycle Policy Missing',
    confidence: 'medium',
    estimatedSavings: 45.30,
  },
  {
    id: '6',
    resourceId: 'db-staging-temp',
    service: 'rds',
    region: 'us-east-1',
    findingType: 'Unused Database',
    confidence: 'high',
    estimatedSavings: 523.10,
  },
];

export default function FindingsPage() {
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [confidenceFilter, setConfidenceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'savings' | 'confidence'>('savings');

  const filteredFindings = mockFindings
    .filter((f) => serviceFilter === 'all' || f.service === serviceFilter)
    .filter((f) => confidenceFilter === 'all' || f.confidence === confidenceFilter)
    .sort((a, b) => {
      if (sortBy === 'savings') {
        return b.estimatedSavings - a.estimatedSavings;
      }
      const confidenceOrder = { high: 3, medium: 2, low: 1 };
      return confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
    });

  const totalSavings = filteredFindings.reduce(
    (sum, f) => sum + f.estimatedSavings,
    0
  );
  const highConfidenceCount = filteredFindings.filter(
    (f) => f.confidence === 'high'
  ).length;

  const getConfidenceBadge = (confidence: Confidence) => {
    const variants = {
      high: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      low: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return variants[confidence];
  };

  const getServiceBadge = (service: Service) => {
    const variants = {
      ec2: 'bg-blue-50 text-blue-700 border-blue-200',
      s3: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rds: 'bg-violet-50 text-violet-700 border-violet-200',
    };
    return variants[service];
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Cost Optimization Findings
        </h1>
        <p className="text-sm text-slate-600">
          Review identified optimization opportunities across your infrastructure
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-medium text-slate-600 mb-1">
              Estimated Monthly Savings
            </p>
            <p className="text-2xl font-semibold text-slate-900">
              ${totalSavings.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-medium text-slate-600 mb-1">
              High Confidence Issues
            </p>
            <p className="text-2xl font-semibold text-slate-900">
              {highConfidenceCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-medium text-slate-600 mb-1">
              Total Resources Flagged
            </p>
            <p className="text-2xl font-semibold text-slate-900">
              {filteredFindings.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="ec2">EC2</SelectItem>
                <SelectItem value="s3">S3</SelectItem>
                <SelectItem value="rds">RDS</SelectItem>
              </SelectContent>
            </Select>

            <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Confidence</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-slate-600">Sort by:</span>
              <Button
                variant={sortBy === 'savings' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('savings')}
                className="h-8"
              >
                Savings
              </Button>
              <Button
                variant={sortBy === 'confidence' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('confidence')}
                className="h-8"
              >
                Confidence
              </Button>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold text-slate-700">
                    Resource ID
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Service
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Region
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Finding Type
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Confidence
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">
                    Est. Savings
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFindings.map((finding) => (
                  <TableRow key={finding.id}>
                    <TableCell className="font-mono text-xs">
                      {finding.resourceId}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-xs', getServiceBadge(finding.service))}
                      >
                        {finding.service.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {finding.region}
                    </TableCell>
                    <TableCell className="text-sm text-slate-900">
                      {finding.findingType}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs capitalize',
                          getConfidenceBadge(finding.confidence)
                        )}
                      >
                        {finding.confidence}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-900">
                      ${finding.estimatedSavings.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileCode className="mr-2 h-4 w-4" />
                            Generate Script
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Clock className="mr-2 h-4 w-4" />
                            Snooze (7 days)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
