import { type ReactNode } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  trend?: { value: number; label: string };
}

export function StatCard({
  title,
  value,
  icon,
  color = "#2563EB",
  trend,
}: StatCardProps) {
  const trendIsPositive = trend && trend.value >= 0;

  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          {/* Icon in colored circle */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: `${color}14`,
              color: color,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {/* Value */}
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, lineHeight: 1.2, color: "text.primary" }}
            >
              {value}
            </Typography>

            {/* Title */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {title}
            </Typography>
          </Box>
        </Box>

        {/* Optional trend */}
        {trend && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mt: 2,
              color: trendIsPositive ? "success.main" : "error.main",
            }}
          >
            {trendIsPositive ? (
              <TrendingUpIcon fontSize="small" />
            ) : (
              <TrendingDownIcon fontSize="small" />
            )}
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {trendIsPositive ? "+" : ""}
              {trend.value}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {trend.label}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
