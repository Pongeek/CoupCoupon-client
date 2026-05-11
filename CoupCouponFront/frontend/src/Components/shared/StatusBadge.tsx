import { Chip } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

type Status = "active" | "expired" | "sold-out" | "pending";

interface StatusBadgeProps {
  status: Status;
}

const STATUS_CONFIG: Record<
  Status,
  { label: string; color: "success" | "error" | "warning" | "info" }
> = {
  active: { label: "Active", color: "success" },
  expired: { label: "Expired", color: "error" },
  "sold-out": { label: "Sold Out", color: "warning" },
  pending: { label: "Pending", color: "info" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant="outlined"
      icon={<CircleIcon sx={{ fontSize: 8 }} />}
      sx={{
        fontWeight: 600,
        fontSize: "0.75rem",
        borderRadius: "8px",
        "& .MuiChip-icon": {
          ml: "6px",
        },
      }}
    />
  );
}
