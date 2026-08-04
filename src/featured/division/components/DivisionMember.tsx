// src/featured/division/components/DivisionMember.tsx
import React from 'react';
import type { Member } from '../types';

interface DivisionMemberProps {
  member: Member;
}

export const DivisionMember: React.FC<DivisionMemberProps> = ({ member }) => {
  return (
    <div className="group relative flex w-full flex-col items-start text-left justify-center gap-1 rounded-xl border-2 border-[#4a2e1b]/40 bg-[#fef3c7]/60 p-2.5 sm:p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#4a2e1b] hover:bg-[#fde68a]/60 hover:shadow-md">
      {/* 1. Nama */}
      <h4 className="w-full truncate font-heading text-xs sm:text-sm font-bold text-[#2b170c] group-hover:text-[#4a2e1b] text-left">
        {member.name}
      </h4>

      {/* 2. Jabatan */}
      <div className="text-left">
        <span className="inline-block rounded-md bg-[#4a2e1b] px-2 py-0.5 text-[9px] sm:text-xs font-semibold text-[#fde68a] border border-[#2b170c]/50">
          {member.position}
        </span>
      </div>

      {/* 3. NIM */}
      {member.nim && (
        <span className="text-[9px] sm:text-xs text-[#4a2e1b]/80 font-mono font-semibold text-left">
          ({member.nim})
        </span>
      )}
    </div>
  );
};
