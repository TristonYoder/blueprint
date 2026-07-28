'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const tabs = [
  { code: 'A-001', label: 'OVERVIEW', href: '/' },
  { code: 'A-101', label: 'PERSONAL', href: '/personal' },
  { code: 'A-201', label: 'WORK', href: '/work' },
  { code: 'A-301', label: 'SHARED', href: '/shared' },
];

export default function SheetTabs() {
  const pathname = usePathname();

  return (
    <div className="border-b border-bp-line overflow-x-auto">
      <div className="flex gap-6 px-4 sm:gap-8 sm:px-8 w-max min-w-full">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.code}
              href={tab.href}
              className={`flex flex-col py-3 border-b-2 shrink-0 whitespace-nowrap ${
                isActive
                  ? 'border-bp-ink text-bp-ink'
                  : 'border-transparent text-bp-ink-faint hover:text-bp-ink-dim'
              }`}
            >
              <span className="bp-label text-xs">{tab.code}</span>
              <span className="bp-label text-sm">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
