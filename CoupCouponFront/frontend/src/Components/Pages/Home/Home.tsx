import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Snackbar,
  Alert,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import {
  SearchRounded,
  ShoppingCartRounded,
  CelebrationRounded,
  LocalOfferRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { Coupon, Category } from "../../../types";
import { couponService } from "../../../api";
import {
  CouponCard,
  CouponCardSkeleton,
  EmptyState,
  PageTransition,
  StaggerContainer,
  StaggerItem,
} from "../../shared";
import { SingleCoupon } from "../SingleCoupon/SingleCoupon";

// ── Helpers ──────────────────────────────────────────────────────────────

const HOW_IT_WORKS_STEPS = [
  {
    icon: <SearchRounded sx={{ fontSize: 32 }} />,
    title: "Browse",
    description: "Find deals across categories — food, spa, vacations and more.",
  },
  {
    icon: <ShoppingCartRounded sx={{ fontSize: 32 }} />,
    title: "Purchase",
    description: "Buy coupons at discounted prices with a secure checkout.",
  },
  {
    icon: <CelebrationRounded sx={{ fontSize: 32 }} />,
    title: "Enjoy",
    description: "Use your coupons and start saving on the things you love.",
  },
];

const ALL_CATEGORIES = ["ALL", ...Object.values(Category)] as const;

// ── Component ────────────────────────────────────────────────────────────

export function Home(): JSX.Element {
  const theme = useTheme();
  const navigate = useNavigate();
  const couponsSectionRef = useRef<HTMLDivElement>(null);

  // Data
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Dialog
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Toast
  const [toastOpen, setToastOpen] = useState(false);

  // ── Fetch coupons ───────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    couponService
      .searchCoupons({ size: 8 })
      .then((page) => {
        if (!cancelled) setCoupons(page.content);
      })
      .catch((err) => console.error("Failed to fetch coupons:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Client-side category filter ─────────────────────────────────────
  const filteredCoupons = useMemo(() => {
    if (selectedCategory === "ALL") return coupons;
    return coupons.filter((c) => c.category === selectedCategory);
  }, [coupons, selectedCategory]);

  // ── Handlers ────────────────────────────────────────────────────────
  const scrollToCoupons = () =>
    couponsSectionRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleViewDetails = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCoupon(null);
  };

  const handleLoginPrompt = () => {
    setToastOpen(true);
  };

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <PageTransition>
      <Box sx={{ overflow: "hidden" }}>
        {/* ─── Hero ─────────────────────────────────────────────────── */}
        <Box
          sx={{
            position: "relative",
            pt: { xs: 8, md: 12 },
            pb: { xs: 8, md: 10 },
            textAlign: "center",
            background: `radial-gradient(ellipse at 50% 0%, ${alpha(
              theme.palette.primary.main,
              0.08
            )} 0%, transparent 70%)`,
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "2.25rem", sm: "3rem", md: "3.75rem" },
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
              Discover Amazing Deals
            </Typography>

            <Typography
              variant="h5"
              component="p"
              sx={{
                color: "text.secondary",
                fontWeight: 400,
                maxWidth: 520,
                mx: "auto",
                mb: 4,
                fontSize: { xs: "1rem", sm: "1.15rem" },
                lineHeight: 1.6,
              }}
            >
              Save big on your favorite products and services
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={scrollToCoupons}
                endIcon={<ArrowForwardRounded />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  },
                }}
              >
                Browse Coupons
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/register")}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  borderRadius: "12px",
                  borderWidth: 2,
                  "&:hover": { borderWidth: 2 },
                }}
              >
                Sign Up Free
              </Button>
            </Box>
          </Container>
        </Box>

        {/* ─── How It Works ─────────────────────────────────────────── */}
        <Box
          sx={{
            py: { xs: 6, md: 8 },
            bgcolor: "background.paper",
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              sx={{
                textAlign: "center",
                fontWeight: 700,
                mb: 1,
              }}
            >
              How It Works
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", mb: 6, maxWidth: 480, mx: "auto" }}
            >
              Start saving in three simple steps
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {HOW_IT_WORKS_STEPS.map((step, index) => (
                <Grid item xs={12} sm={4} key={step.title}>
                  <Box
                    sx={{
                      textAlign: "center",
                      px: 2,
                    }}
                  >
                    {/* Numbered circle */}
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                        position: "relative",
                        background: `linear-gradient(135deg, ${alpha(
                          theme.palette.primary.main,
                          0.1
                        )}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                        color: theme.palette.primary.main,
                      }}
                    >
                      {step.icon}
                      <Box
                        sx={{
                          position: "absolute",
                          top: -4,
                          right: -4,
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          bgcolor: theme.palette.primary.main,
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        {index + 1}
                      </Box>
                    </Box>

                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{ fontWeight: 700, mb: 1 }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ maxWidth: 280, mx: "auto" }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ─── Stats Banner ─────────────────────────────────────────── */}
        {!loading && coupons.length > 0 && (
          <Box
            sx={{
              py: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          >
            <Container maxWidth="lg">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                }}
              >
                <LocalOfferRounded sx={{ color: "#fff", fontSize: 28 }} />
                <Typography
                  variant="h5"
                  sx={{ color: "#fff", fontWeight: 700 }}
                >
                  {coupons.length}+ Active Deals
                </Typography>
              </Box>
            </Container>
          </Box>
        )}

        {/* ─── Featured Coupons ─────────────────────────────────────── */}
        <Box
          ref={couponsSectionRef}
          sx={{
            py: { xs: 6, md: 8 },
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              sx={{ textAlign: "center", fontWeight: 700, mb: 1 }}
            >
              Featured Coupons
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", mb: 4, maxWidth: 480, mx: "auto" }}
            >
              Explore our latest deals and start saving today
            </Typography>

            {/* Category chips */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 1,
                mb: 4,
              }}
            >
              {ALL_CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  label={cat === "ALL" ? "All" : cat.charAt(0) + cat.slice(1).toLowerCase()}
                  clickable
                  variant={selectedCategory === cat ? "filled" : "outlined"}
                  color={selectedCategory === cat ? "primary" : "default"}
                  onClick={() => setSelectedCategory(cat)}
                  sx={{
                    fontWeight: 600,
                    px: 1,
                    transition: "all 0.2s ease",
                    ...(selectedCategory === cat && {
                      boxShadow: `0 2px 8px ${alpha(
                        theme.palette.primary.main,
                        0.35
                      )}`,
                    }),
                  }}
                />
              ))}
            </Box>

            {/* Coupon grid */}
            {loading ? (
              <Grid container spacing={3}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                    <CouponCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : filteredCoupons.length === 0 ? (
              <EmptyState
                title="No coupons found"
                description={
                  selectedCategory !== "ALL"
                    ? "Try selecting a different category."
                    : "Check back soon for new deals!"
                }
              />
            ) : (
              <StaggerContainer>
                <Grid container spacing={3}>
                  {filteredCoupons.map((coupon) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={coupon.id}>
                      <StaggerItem>
                        <CouponCard
                          coupon={coupon}
                          onViewDetails={handleViewDetails}
                          onPurchase={handleLoginPrompt}
                          showPurchaseButton={false}
                        />
                      </StaggerItem>
                    </Grid>
                  ))}
                </Grid>
              </StaggerContainer>
            )}
          </Container>
        </Box>

        {/* ─── Coupon Detail Dialog ─────────────────────────────────── */}
        {selectedCoupon && (
          <SingleCoupon
            open={dialogOpen}
            onClose={handleDialogClose}
            coupon={selectedCoupon as any}
            onPurchase={handleLoginPrompt}
          />
        )}

        {/* ─── Login Prompt Toast ───────────────────────────────────── */}
        <Snackbar
          open={toastOpen}
          autoHideDuration={4000}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setToastOpen(false)}
            severity="info"
            variant="filled"
            sx={{ borderRadius: "12px", fontWeight: 500 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => navigate("/login")}
                sx={{ fontWeight: 700 }}
              >
                Log In
              </Button>
            }
          >
            Please log in to purchase coupons.
          </Alert>
        </Snackbar>
      </Box>
    </PageTransition>
  );
}
