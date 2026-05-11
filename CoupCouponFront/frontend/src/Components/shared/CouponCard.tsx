import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import { Coupon } from "../../types";

interface CouponCardProps {
  coupon: Coupon;
  onViewDetails?: (coupon: Coupon) => void;
  onPurchase?: (coupon: Coupon) => void;
  showPurchaseButton?: boolean;
}

const PLACEHOLDER_GRADIENT = "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)";

export function CouponCard({
  coupon,
  onViewDetails,
  onPurchase,
  showPurchaseButton = false,
}: CouponCardProps) {
  const hasImage = Boolean(coupon.image);

  return (
    <Card
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
        },
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Image or placeholder gradient */}
      {hasImage ? (
        <CardMedia
          component="img"
          height="160"
          image={coupon.image}
          alt={coupon.title}
          sx={{ objectFit: "cover" }}
        />
      ) : (
        <Box
          sx={{
            height: 160,
            background: PLACEHOLDER_GRADIENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>
            {coupon.title.charAt(0).toUpperCase()}
          </Typography>
        </Box>
      )}

      {/* Category chip */}
      <Chip
        label={coupon.category}
        size="small"
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          fontWeight: 600,
          fontSize: "0.7rem",
          bgcolor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(4px)",
        }}
      />

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Title - truncated to 1 line */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {coupon.title}
        </Typography>

        {/* Description - truncated to 2 lines */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "2.6em",
          }}
        >
          {coupon.description}
        </Typography>

        {/* Price and expiry */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Expires: {new Date(coupon.endDate).toLocaleDateString()}
          </Typography>
          <Typography
            variant="h6"
            color="primary"
            sx={{ fontWeight: 800, fontSize: "1.15rem" }}
          >
            ${coupon.price.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => onViewDetails?.(coupon)}
          sx={{ borderRadius: "8px", textTransform: "none" }}
        >
          View Details
        </Button>
        {showPurchaseButton && (
          <Button
            size="small"
            variant="contained"
            onClick={() => onPurchase?.(coupon)}
            sx={{ borderRadius: "8px", textTransform: "none", ml: "auto" }}
          >
            Purchase
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
