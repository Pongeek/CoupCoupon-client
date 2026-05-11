import { useEffect, useMemo, useState } from 'react';
import {
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Pagination,
  Typography,
} from '@mui/material';
import { Loyalty as LoyaltyIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../hooks/useAppStore';
import { setMyCoupons } from '../../../../store';
import { Category, type Coupon } from '../../../../types';
import axiosJWT from '../../../Util/AxiosJWT';
import {
  CouponCard,
  CouponCardSkeleton,
  SearchBar,
  EmptyState,
  PageHeader,
  StatusBadge,
  PageTransition,
  StaggerContainer,
  StaggerItem,
} from '../../../shared';

// ── Constants ─────────────────────────────────────────────────────────
const PAGE_SIZE = 12;
const CATEGORY_OPTIONS = Object.values(Category);

type StatusFilter = '' | 'active' | 'expired';
type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'expiring-soon';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'expiring-soon', label: 'Expiring Soon' },
];

function isExpired(endDate: string): boolean {
  return new Date() > new Date(endDate);
}

// ── Component ─────────────────────────────────────────────────────────
export function GetCustomerCoupons(): JSX.Element {
  const dispatch = useAppDispatch();
  const { name } = useAppSelector((s) => s.auth);
  const myCoupons = useAppSelector((s) => s.customer.myCoupons);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);

  // ── Fetch purchased coupons ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchMyCoupons = async () => {
      setLoading(true);
      try {
        const { data } = await axiosJWT.get(
          `${import.meta.env.VITE_API_URL}/customer/coupons`
        );
        if (!cancelled) {
          const list: Coupon[] = Array.isArray(data) ? data : data.content ?? [];
          dispatch(setMyCoupons(list));
        }
      } catch (err) {
        console.error('Failed to fetch customer coupons:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMyCoupons();
    return () => { cancelled = true; };
  }, [dispatch]);

  // ── Stats ────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const active = myCoupons.filter((c) => !isExpired(c.endDate)).length;
    const expired = myCoupons.length - active;
    return { total: myCoupons.length, active, expired };
  }, [myCoupons]);

  // ── Filtering / sorting / pagination ────────────────────────────
  const filtered = useMemo(() => {
    let result = [...myCoupons];

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

    // Status
    if (statusFilter === 'active') {
      result = result.filter((c) => !isExpired(c.endDate));
    } else if (statusFilter === 'expired') {
      result = result.filter((c) => isExpired(c.endDate));
    }

    // Sort
    switch (sortOption) {
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
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
          (a, b) =>
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );
        break;
    }

    return result;
  }, [myCoupons, searchTerm, categoryFilter, statusFilter, sortOption]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, categoryFilter, statusFilter, sortOption]);

  return (
    <PageTransition>
      <PageHeader
        title="My Coupons"
        subtitle={
          loading
            ? 'Loading your coupons...'
            : `${stats.total} coupon${stats.total !== 1 ? 's' : ''} — ${stats.active} active, ${stats.expired} expired`
        }
      />

      {/* ── Status chips ──────────────────────────────────────────── */}
      {!loading && stats.total > 0 && (
        <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
          <Chip
            label={`All (${stats.total})`}
            variant={statusFilter === '' ? 'filled' : 'outlined'}
            color="primary"
            onClick={() => setStatusFilter('')}
            sx={{ borderRadius: '10px', fontWeight: 600 }}
          />
          <Chip
            label={`Active (${stats.active})`}
            variant={statusFilter === 'active' ? 'filled' : 'outlined'}
            color="success"
            onClick={() => setStatusFilter('active')}
            sx={{ borderRadius: '10px', fontWeight: 600 }}
          />
          <Chip
            label={`Expired (${stats.expired})`}
            variant={statusFilter === 'expired' ? 'filled' : 'outlined'}
            color="error"
            onClick={() => setStatusFilter('expired')}
            sx={{ borderRadius: '10px', fontWeight: 600 }}
          />
        </Box>
      )}

      {/* ── Search & Filters ──────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
          alignItems: 'center',
        }}
      >
        <Box sx={{ flex: '1 1 280px', minWidth: 200 }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search your coupons..."
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

      {/* ── Results count ─────────────────────────────────────────── */}
      {!loading && filtered.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Showing {filtered.length} coupon{filtered.length !== 1 ? 's' : ''}
        </Typography>
      )}

      {/* ── Coupons Grid ──────────────────────────────────────────── */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <CouponCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={
            searchTerm || categoryFilter || statusFilter
              ? 'No coupons match your filters'
              : 'No purchased coupons yet'
          }
          description={
            searchTerm || categoryFilter || statusFilter
              ? 'Try adjusting your filters to find what you\'re looking for.'
              : 'Start browsing available coupons and make your first purchase!'
          }
          icon={<LoyaltyIcon sx={{ fontSize: 64 }} />}
          action={
            !searchTerm && !categoryFilter && !statusFilter
              ? { label: 'Browse Coupons', onClick: () => window.history.back() }
              : undefined
          }
        />
      ) : (
        <>
          <StaggerContainer>
            <Grid container spacing={3}>
              {paginated.map((coupon) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={coupon.id}>
                  <StaggerItem>
                    <Box sx={{ position: 'relative' }}>
                      <CouponCard coupon={coupon} />
                      {/* Status overlay badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          zIndex: 1,
                        }}
                      >
                        <StatusBadge
                          status={isExpired(coupon.endDate) ? 'expired' : 'active'}
                        />
                      </Box>
                    </Box>
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
    </PageTransition>
  );
}
