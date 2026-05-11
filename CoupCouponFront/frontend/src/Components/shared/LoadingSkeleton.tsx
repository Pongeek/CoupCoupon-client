import { Box, Card, CardContent, Skeleton, TableCell, TableRow } from "@mui/material";

/** Skeleton matching CouponCard layout */
export function CouponCardSkeleton() {
  return (
    <Card sx={{ borderRadius: "16px", overflow: "hidden", height: "100%" }}>
      <Skeleton variant="rectangular" height={160} animation="wave" />
      <CardContent>
        <Skeleton variant="text" width="75%" height={28} animation="wave" />
        <Skeleton variant="text" width="100%" animation="wave" />
        <Skeleton variant="text" width="60%" animation="wave" />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Skeleton variant="text" width={100} animation="wave" />
          <Skeleton variant="text" width={60} height={32} animation="wave" />
        </Box>
      </CardContent>
      <Box sx={{ px: 2, pb: 2, display: "flex", gap: 1 }}>
        <Skeleton
          variant="rounded"
          width={100}
          height={32}
          sx={{ borderRadius: "8px" }}
          animation="wave"
        />
        <Skeleton
          variant="rounded"
          width={80}
          height={32}
          sx={{ borderRadius: "8px" }}
          animation="wave"
        />
      </Box>
    </Card>
  );
}

/** Skeleton matching a table row with 5 cells */
export function TableRowSkeleton() {
  return (
    <TableRow>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton variant="text" animation="wave" />
        </TableCell>
      ))}
    </TableRow>
  );
}

/** Skeleton matching StatCard layout */
export function StatCardSkeleton() {
  return (
    <Card sx={{ borderRadius: "16px", height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Skeleton
            variant="rounded"
            width={48}
            height={48}
            sx={{ borderRadius: "12px", flexShrink: 0 }}
            animation="wave"
          />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="40%" height={40} animation="wave" />
            <Skeleton variant="text" width="60%" animation="wave" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
