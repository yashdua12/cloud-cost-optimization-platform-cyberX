'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Cloud,
  Search,
  AlertTriangle,
  FileText,
  Settings,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Connect Account', href: '/dashboard/connect', icon: Cloud },
  { name: 'Run Scan', href: '/dashboard/scan', icon: Search },
  { name: 'Findings', href: '/dashboard/findings', icon: AlertTriangle },
  { name: 'Cost Report', href: '/dashboard/report', icon: FileText },
  { name: 'Remediation', href: '/dashboard/remediation', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-slate-900 rounded flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">CloudOpt</h1>
              <p className="text-xs text-slate-500">Cost Analyzer</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-medium text-slate-700">Security Status</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span>All credentials encrypted</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
