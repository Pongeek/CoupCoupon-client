import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Pagination,
  CircularProgress,
} from '@mui/material';
import { ShoppingBag as ShoppingBagIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../hooks/useAppStore';
import { setAvailableCoupons, purchaseCoupon } from '../../../../store';
import { Category, type Coupon } from '../../../../types';
import axiosJWT from '../../../Util/AxiosJWT';
import {
  CouponCard,
  CouponCardSkeleton,
  SearchBar,
  ConfirmDialog,
  EmptyState,
  PageHeader,
  PageTransition,
  StaggerContainer,
  StaggerItem,
} from '../../../shared';

// ── Constants ─────────────────────────────────────────────────────────
const PAGE_SIZE = 12;
const CATEGORY_OPTIONS = Object.values(Category);

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'expiring-soon';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'expiring-soon', label: 'Expiring Soon' },
];

// ── Component ─────────────────────────────────────────────────────────
export function CustomerMenu(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { name, id: userId } = useAppSelector((s) => s.auth);
  const availableCoupons = useAppSelector((s) => s.customer.availableCoupons);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [page, setPage] = useState(1);

  // Purchase flow
  const [purchaseTarget, setPurchaseTarget] = useState<Coupon | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  // ── Fetch available coupons ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const { data } = await axiosJWT.get(
          `${import.meta.env.VITE_API_URL}/customer/available-coupons`
        );
        if (!cancelled) {
          const list: Coupon[] = Array.isArray(data) ? data : data.content ?? [];
          dispatch(setAvailableCoupons(list));

          // Compute max price for slider
          if (list.length > 0) {
            const highest = Math.ceil(Math.max(...list.map((c) => c.price)));
            const rounded = Math.ceil(highest / 50) * 50 || 500;
            setMaxPrice(rounded);
            setPriceRange([0, rounded]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch available coupons:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCoupons();
    return () => { cancelled = true; };
  }, [dispatch]);

  // ── Filtering / sorting / pagination ────────────────────────────
  const filtered = useMemo(() => {
    let result = [...availableCoupons];

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (categoryFilter) {
      result = result.filter((c) => c.category === categoryFilter);
    }

    // Price range
    result = result.filter(
      (c) => c.price >= priceRange[0] && c.price <= priceRange[1]
    );

    // Sort
    switch (sortOption) {
      case 'newest':
        result.sort(
          (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'expiring-soon':
        result.sort(
          (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );
        break;
    }

    return result;
  }, [availableCoupons, searchTerm, categoryFilter, sortOption, priceRange]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, categoryFilter, sortOption, priceRange]);

  // ── Purchase handler ────────────────────────────────────────────
  const handlePurchaseConfirm = useCallback(async () => {
    if (!purchaseTarget) return;
    setPurchaseLoading(true);
    setPurchaseError(null);

    try {
      await axiosJWT.post(
        `${import.meta.env.VITE_API_URL}/customer/coupons/${purchaseTarget.id}/purchase`
      );
      dispatch(purchaseCoupon(purchaseTarget.id));
      setPurchaseTarget(null);
      navigate(`/customer/${userId}/thank-you/${name || ''}`);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Failed to purchase coupon. Please try again.';
      setPurchaseError(msg);
    } finally {
      setPurchaseLoading(false);
    }
  }, [purchaseTarget, dispatch, navigate, userId, name]);

  // ── Active category chips ────────────────────────────────────────
  const activeFilterCount = [
    categoryFilter,
    priceRange[1] < maxPrice ? 'price' : '',
  ].filter(Boolean).length;

  return (
    <PageTransition>
      <PageHeader
        title={`Welcome, ${name || 'Customer'}`}
        subtitle="Explore exclusive coupons and start saving today"
      />

      {/* ── Search & Filters ──────────────────────────────────────── */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2,
            alignItems: 'center',
          }}
        >
          <Box sx={{ flex: '1 1 280px', minWidth: 200 }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search coupons by title, description, or category..."
            />
          </Box>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{ borderRadius: '12px', bgcolor: 'background.paper' }}
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {CATEGORY_OPTIONS.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOption}
              label="Sort By"
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              sx={{ borderRadius: '12px', bgcolor: 'background.paper' }}
            >
              {SORT_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Price range slider */}
        <Box sx={{ maxWidth: 360, px: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Price Range: ${priceRange[0]} – ${priceRange[1]}
          </Typography>
          <Slider
            value={priceRange}
            onChange={(_e, v) => setPriceRange(v as [number, number])}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `$${v}`}
            min={0}
            max={maxPrice}
            step={5}
            size="small"
            sx={{ color: 'primary.main' }}
          />
        </Box>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            {categoryFilter && (
              <Chip
                label={categoryFilter}
                size="small"
                onDelete={() => setCategoryFilter('')}
                sx={{ borderRadius: '8px' }}
              />
            )}
            {priceRange[1] < maxPrice && (
              <Chip
                label={`Max $${priceRange[1]}`}
                size="small"
                onDelete={() => setPriceRange([0, maxPrice])}
                sx={{ borderRadius: '8px' }}
              />
            )}
          </Box>
        )}
      </Box>

      {/* ── Results count ─────────────────────────────────────────── */}
      {!loading && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {filtered.length} coupon{filtered.length !== 1 ? 's' : ''} found
        </Typography>
      )}

      {/* ── Coupon Grid ───────────────────────────────────────────── */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <CouponCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={
            searchTerm || categoryFilter || priceRange[1] < maxPrice
              ? 'No coupons match your filters'
              : 'No coupons available'
          }
          description={
            searchTerm || categoryFilter || priceRange[1] < maxPrice
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Check back later for new deals and exclusive offers!'
          }
          icon={<ShoppingBagIcon sx={{ fontSize: 64 }} />}
        />
      ) : (
        <>
          <StaggerContainer>
            <Grid container spacing={3}>
              {paginated.map((coupon) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={coupon.id}>
                  <StaggerItem>
                    <CouponCard
                      coupon={coupon}
                      showPurchaseButton
                      onPurchase={(c) => {
                        setPurchaseError(null);
                        setPurchaseTarget(c);
                      }}
                    />
                  </StaggerItem>
                </Grid>
              ))}
            </Grid>
          </StaggerContainer>

          {/* Pagination */}
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_e, v) => setPage(v)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}

      {/* ── Purchase Confirmation Dialog ──────────────────────────── */}
      <ConfirmDialog
        open={!!purchaseTarget}
        title="Confirm Purchase"
        message={
          purchaseTarget
            ? `Purchase "${purchaseTarget.title}" for $${purchaseTarget.price.toFixed(2)}?${
                purchaseError ? `\n\nError: ${purchaseError}` : ''
              }`
            : ''
        }
        confirmLabel={purchaseLoading ? 'Purchasing...' : 'Confirm Purchase'}
        confirmColor="primary"
        loading={purchaseLoading}
        onConfirm={handlePurchaseConfirm}
        onCancel={() => {
          setPurchaseTarget(null);
          setPurchaseError(null);
        }}
      />
    </PageTransition>
  );
}
