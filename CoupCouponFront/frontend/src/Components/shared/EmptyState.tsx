import { type ReactNode } from "react";
import { Box, Button, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/InboxOutlined";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 8,
        px: 3,
      }}
    >
      <Box
        sx={{
          color: "text.disabled",
          mb: 2,
          "& > svg": { fontSize: 64 },
        }}
      >
        {icon ?? <InboxIcon sx={{ fontSize: 64 }} />}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 360 }}
        >
          {description}
        </Typography>
      )}

      {action && (
        <Button
          variant="contained"
          onClick={action.onClick}
          sx={{ mt: 3, borderRadius: "12px", textTransform: "none" }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
}
