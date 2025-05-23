import React from 'react';

interface KpiCardProps {
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  percent: string;
  percentColor: string;
  arrowDirection: 'up' | 'down';
}

const KpiCard: React.FC<KpiCardProps> = ({ value, subtitle, icon, iconBg, percent, percentColor, arrowDirection }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 min-w-[200px]">
      <div className="flex items-center justify-between">
        <div className={`rounded-full p-2 ${iconBg} flex items-center justify-center w-10 h-10`}>{icon}</div>
        <div className={`flex items-center text-sm font-semibold ${percentColor}`}>
          {arrowDirection === 'up' ? (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          ) : (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          )}
          {percent}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mt-2">{value}</div>
      <div className="text-sm text-gray-500">{subtitle}</div>
    </div>
  );
};

export default KpiCard; 