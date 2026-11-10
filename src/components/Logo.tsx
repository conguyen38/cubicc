import { Box } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="logo" aria-label="Cubic Flow">
      <span className="logo-mark" aria-hidden="true">
        <Box size={compact ? 18 : 20} strokeWidth={2.5} />
      </span>
      {!compact && (
        <span className="logo-copy">
          Cubic<span>Flow</span>
        </span>
      )}
    </div>
  );
}
