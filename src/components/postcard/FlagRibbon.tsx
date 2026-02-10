interface FlagRibbonProps {
  flags: string[];
}

export const FlagRibbon = ({ flags }: FlagRibbonProps) => {
  if (flags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 py-2 px-3 border-y border-dashed border-[#c4b89a]">
      {flags.map((flag, i) => (
        <span key={i} className="text-lg leading-none">
          {flag}
        </span>
      ))}
    </div>
  );
};
