import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  LocalOffer as CouponIcon,
} from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '../../../../hooks/useAppStore';
import { setAdminCoupons, deleteAdminCoupon } from '../../../../store';
import { Category, type Coupon } from '../../../../types';
import axiosJWT from '../../../Util/AxiosJWT';
import { CouponDetails } from '../../../Model/CouponDetails';
import { SingleCoupon } from '../../SingleCoupon/SingleCoupon';
import {
  SearchBar,
  ConfirmDialog,
  EmptyState,
  StatusBadge,
  PageHeader,
  PageTransition,
} from '../../../shared';

// ── Constants ─────────────────────────────────────────────────────────
const ROWS_PER_PAGE = 10;
const CATEGORY_OPTIONS = Object.values(Category);

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'expiring-soon';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'expiring-soon', label: 'Expiring Soon' },
];

const CATEGORY_COLORS: Record<string, string> = {
  FOOD: '#ef6c00',
  SPA: '#7b1fa2',
  RESTAURANT: '#c62828',
  VACATION: '#0277bd',
  CONCERTS: '#ad1457',
  ELECTRICITY: '#2e7d32',
};

const headerCellSx = {
  fontWeight: 700,
  fontSize: '0.8rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  color: 'text.secondary',
  borderBottom: 2,
  borderColor: 'divider',
  py: 1.5,
  whiteSpace: 'nowrap' as const,
};

function isExpired(endDate: string): boolean {
  return new Date() > new Date(endDate);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function toCouponDetails(c: Coupon): CouponDetails {
  return new CouponDetails(
    c.id, c.companyID, c.category, c.title, c.description,
    c.startDate, c.endDate, c.amount, c.price, c.image,
  );
}

// ── Component ─────────────────────────────────────────────────────────
export function GetAllCoupons(): JSX.Element {
  const dispatch = useAppDispatch();
  const coupons = useAppSelector((s) => s.admin.coupons);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);

  // View
  const [viewCoupon, setViewCoupon] = useState<CouponDetails | null>(null);

  // Delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const { data } = await axiosJWT.get(
          `${import.meta.env.VITE_API_URL}/admin/coupons`
        );
        if (!cancelled) {
          const list: Coupon[] = Array.isArray(data) ? data : data.content ?? [];
          dispatch(setAdminCoupons(list));
        }
      } catch (err) {
        console.error('Failed to fetch coupons:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchCoupons();
    return () => { cancelled = true; };
  }, [dispatch]);

  // ── Filtering / sorting / pagination ────────────────────────────
  const filtered = useMemo(() => {
    let result = [...coupons];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    if (categoryFilter) {
      result = result.filter((c) => c.category === categoryFilter);
    }

    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'expiring-soon':
        result.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
        break;
    }

    return result;
  }, [coupons, searchTerm, categoryFilter, sortOption]);

  const pageCount = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  useEffect(() => { setPage(1); }, [searchTerm, categoryFilter, sortOption]);

  // ── Handlers ────────────────────────────────────────────────────
  const handleView = useCallback((c: Coupon) => setViewCoupon(toCouponDetails(c)), []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await axiosJWT.delete(
        `${import.meta.env.VITE_API_URL}/admin/coupons/${deleteTarget.id}`
      );
      dispatch(deleteAdminCoupon(deleteTarget.id));
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete coupon:', err);
    } finally {
      setDeleteLoading(false);
    }
  }, [deleteTarget, dispatch]);

  // ── Stats ────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const active = coupons.filter((c) => !isExpired(c.endDate)).length;
    return { total: coupons.length, active, expired: coupons.length - active };
  }, [coupons]);

  // ── Skeleton ────────────────────────────────────────────────────
  const renderSkeleton = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
        {Array.from({ length: 8 }).map((_, j) => (
          <TableCell key={j}>
            <Skeleton variant="text" animation="wave" />
          </TableCell>
        ))}
      </TableRow>
    ));

  return (
    <PageTransition>
      <PageHeader
        title="Coupon Management"
        subtitle={
          loading
            ? 'Loading coupons...'
            : `${stats.total} coupon${stats.total !== 1 ? 's' : ''} — ${stats.active} active, ${stats.expired} expired`
        }
      />

      {/* ── Search & Filter Bar ────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
          alignItems: 'center',
        }}
      >
        <Box sx={{ flex: '1 1 260px', minWidth: 200 }}>
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

      {/* ── Table ──────────────────────────────────────────────────── */}
      {loading ? (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: '16px', border: 1, borderColor: 'divider' }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {['Title', 'Category', 'Price', 'Amount', 'Start', 'End', 'Status', 'Actions'].map((h) => (
                  <TableCell key={h} sx={headerCellSx}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>{renderSkeleton()}</TableBody>
          </Table>
        </TableContainer>
      ) : filtered.length === 0 ? (
        <Paper
          elevation={0}
          sx={{ borderRadius: '16px', border: 1, borderColor: 'divider', overflow: 'hidden' }}
        >
          <EmptyState
            title={searchTerm || categoryFilter ? 'No coupons match your filters' : 'No coupons yet'}
            description={
              searchTerm || categoryFilter
                ? 'Try adjusting your search or filters.'
                : 'Coupons will appear here once companies create them.'
            }
            icon={<CouponIcon sx={{ fontSize: 64 }} />}
          />
        </Paper>
      ) : (
        <>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: '16px', border: 1, borderColor: 'divider' }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellSx}>Title</TableCell>
                  <TableCell sx={headerCellSx}>Category</TableCell>
                  <TableCell sx={headerCellSx} align="right">Price</TableCell>
                  <TableCell sx={headerCellSx} align="right">Amount</TableCell>
                  <TableCell sx={headerCellSx}>Start Date</TableCell>
                  <TableCell sx={headerCellSx}>End Date</TableCell>
                  <TableCell sx={headerCellSx}>Status</TableCell>
                  <TableCell sx={headerCellSx} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((c) => {
                  const expired = isExpired(c.endDate);
                  return (
                    <TableRow
                      key={c.id}
                      hover
                      sx={{
                        '&:last-child td': { borderBottom: 0 },
                        opacity: expired ? 0.65 : 1,
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            maxWidth: 220,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {c.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={c.category}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            borderRadius: '8px',
                            bgcolor: `${CATEGORY_COLORS[c.category] || '#757575'}14`,
                            color: CATEGORY_COLORS[c.category] || '#757575',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ${c.price.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{c.amount}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(c.startDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(c.endDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={expired ? 'expired' : 'active'} />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="View details">
                            <IconButton size="small" onClick={() => handleView(c)}>
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete coupon">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                setDeleteTarget({ id: c.id, title: c.title });
                                setDeleteOpen(true);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
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

      {/* ── View Coupon Dialog ─────────────────────────────────────── */}
      {viewCoupon && (
        <SingleCoupon
          coupon={viewCoupon}
          open={!!viewCoupon}
          onClose={() => setViewCoupon(null)}
        />
      )}

      {/* ── Delete Confirmation ────────────────────────────────────── */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Coupon"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        confirmColor="error"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteOpen(false); setDeleteTarget(null); }}
      />
    </PageTransition>
  );
}
