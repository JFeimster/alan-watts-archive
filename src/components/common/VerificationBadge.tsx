import React from 'react';
import { VerificationStatus } from '../../types';
import { ShieldCheck, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  status, 
  size = 'md',
  showLabel = true 
}) => {
  const getDetails = () => {
    switch (status) {
      case 'verified-source':
        return {
          label: 'Verified Source',
          bg: 'bg-[#2E4033]/10 text-[#2E4033] border-[#2E4033]/20',
          icon: ShieldCheck,
          description: 'Confirmed against master archival tapes and publishing records.'
        };
      case 'probable-attribution':
        return {
          label: 'Probable Attribution',
          bg: 'bg-[#8C6D1F]/10 text-[#735818] border-[#8C6D1F]/20',
          icon: CheckCircle2,
          description: 'Strong scholarly corroboration from secondary lecture transcripts.'
        };
      case 'source-unconfirmed':
        return {
          label: 'Source Unconfirmed',
          bg: 'bg-[#7A6B5D]/10 text-[#5C4F44] border-[#7A6B5D]/20',
          icon: HelpCircle,
          description: 'Pending verification against primary audio logs.'
        };
      case 'commonly-misattributed':
        return {
          label: 'Commonly Misattributed',
          bg: 'bg-[#A63A3A]/10 text-[#8A2B2B] border-[#A63A3A]/20',
          icon: AlertCircle,
          description: 'Often mistakenly attributed to Alan Watts on social media.'
        };
    }
  };

  const details = getDetails();
  const Icon = details.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <div 
      className={`inline-flex items-center font-medium rounded-full border ${details.bg} ${sizeClasses[size]} transition-all duration-200 cursor-help`}
      title={details.description}
    >
      <Icon size={iconSizes[size]} className="shrink-0" />
      {showLabel && <span>{details.label}</span>}
    </div>
  );
};
