import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../../../../hooks/useAppStore";
import {
  setCompanyCoupons,
  addCoupon,
  updateCoupon,
  deleteCompanyCoupon,
} from "../../../../store";
import { Category, type Coupon } from "../../../../types";
import axiosJWT from "../../../Util/AxiosJWT";
import { CouponDetails } from "../../../Model/CouponDetails";
import { SingleCoupon } from "../../SingleCoupon/SingleCoupon";
import {
  PageHeader,
  SearchBar,
  ConfirmDialog,
  EmptyState,
  PageTransition,
  StatusBadge,
} from "../../../shared";

// ── Constants ────────────────────────────────────────────────────────

const ROWS_PER_PAGE = 10;

const CATEGORY_OPTIONS = Object.values(Category);

type SortOption = "newest" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const CATEGORY_COLORS: Record<string, string> = {
  FOOD: "#ef6c00",
  SPA: "#7b1fa2",
  RESTAURANT: "#c62828",
  VACATION: "#0277bd",
  CONCERTS: "#ad1457",
  ELECTRICITY: "#2e7d32",
};

// ── Helpers ──────────────────────────────────────────────────────────

function isExpired(endDate: string): boolean {
  return new Date() > new Date(endDate);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Map a Coupon to the CouponDetails class that SingleCoupon expects. */
function toCouponDetails(c: Coupon): CouponDetails {
  return new CouponDetails(
    c.id,
    c.companyID,
    c.category,
    c.title,
    c.description,
    c.startDate,
    c.endDate,
    c.amount,
    c.price,
    c.image,
  );
}

// ── Form state ───────────────────────────────────────────────────────

interface CouponFormData {
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  amount: number | string;
  price: number | string;
  image: string;
}

interface FormErrors {
  title?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  amount?: string;
  price?: string;
}

const EMPTY_FORM: CouponFormData = {
  title: "",
  description: "",
  category: "",
  startDate: "",
  endDate: "",
  amount: "",
  price: "",
  image: "",
};

function validateForm(data: CouponFormData, isUpdate = false): FormErrors {
  const errors: FormErrors = {};

  if (!data.title.trim()) {
    errors.title = "Title is required";
  }
  if (!data.category) {
    errors.category = "Category is required";
  }
  if (!data.startDate) {
    errors.startDate = "Start date is required";
  }
  if (!data.endDate) {
    errors.endDate = "End date is required";
  }
  if (data.startDate && data.endDate && data.endDate <= data.startDate) {
    errors.endDate = "End date must be after start date";
  }

  const amount = Number(data.amount);
  if (!data.amount || isNaN(amount) || amount < 1) {
    errors.amount = "Amount must be at least 1";
  }

  const price = Number(data.price);
  if (!data.price || isNaN(price) || price <= 0) {
    errors.price = "Price must be greater than 0";
  }

  return errors;
}

// ── Table header styling ─────────────────────────────────────────────

const headerCellSx = {
  fontWeight: 700,
  fontSize: "0.8rem",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  color: "text.secondary",
  borderBottom: 2,
  borderColor: "divider",
  py: 1.5,
  whiteSpace: "nowrap" as const,
};

// ══════════════════════════════════════════════════════════════════════
// Component
// ══════════════════════════════════════════════════════════════════════

export function CompanyMenu(): JSX.Element {
  const dispatch = useAppDispatch();
  const coupons = useAppSelector((s) => s.company.coupons);

  // ── Local state ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);

  // View dialog
  const [viewCoupon, setViewCoupon] = useState<CouponDetails | null>(null);

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<CouponFormData>(EMPTY_FORM);
  const [addErrors, setAddErrors] = useState<FormErrors>({});
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Update dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<CouponFormData>(EMPTY_FORM);
  const [editErrors, setEditErrors] = useState<FormErrors>({});
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete confirmation
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Fetch coupons on mount ───────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const { data } = await axiosJWT.get(
          `${import.meta.env.VITE_API_URL}/company/coupons`,
        );
        if (!cancelled) {
          const list: Coupon[] = Array.isArray(data) ? data : data.content ?? [];
          dispatch(setCompanyCoupons(list));
        }
      } catch (err) {
        console.error("Failed to fetch company coupons:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCoupons();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  // ── Filtering / sorting / pagination ─────────────────────────────
  const filtered = useMemo(() => {
    let result = [...coupons];

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q),
      );
    }

    // Category
    if (categoryFilter) {
      result = result.filter((c) => c.category === categoryFilter);
    }

    // Sort
    switch (sortOption) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        );
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [coupons, searchTerm, categoryFilter, sortOption]);

  const pageCount = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, categoryFilter, sortOption]);

  // ── Handlers: View ───────────────────────────────────────────────
  const handleView = useCallback(
    (c: Coupon) => setViewCoupon(toCouponDetails(c)),
    [],
  );

  // ── Handlers: Add ────────────────────────────────────────────────
  const openAddDialog = useCallback(() => {
    setAddForm(EMPTY_FORM);
    setAddErrors({});
    setAddOpen(true);
  }, []);

  const handleAddSubmit = useCallback(async () => {
    const errors = validateForm(addForm);
    setAddErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setAddSubmitting(true);
    try {
      const payload: Omit<Coupon, "id"> = {
        companyID: 0, // server infers from token
        title: addForm.title.trim(),
        description: addForm.description.trim(),
        category: addForm.category,
        startDate: addForm.startDate,
        endDate: addForm.endDate,
        amount: Number(addForm.amount),
        price: Number(addForm.price),
        image: addForm.image.trim() || "",
      };

      const { data } = await axiosJWT.post(
        `${import.meta.env.VITE_API_URL}/company/coupons`,
        payload,
      );

      const created: Coupon = data.id
        ? data
        : { ...payload, id: data };
      dispatch(addCoupon(created));
      setAddOpen(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to add coupon. Please try again.";
      setAddErrors({ title: msg });
    } finally {
      setAddSubmitting(false);
    }
  }, [addForm, dispatch]);

  // ── Handlers: Edit ───────────────────────────────────────────────
  const openEditDialog = useCallback((c: Coupon) => {
    setEditId(c.id);
    setEditForm({
      title: c.title,
      description: c.description,
      category: c.category,
      startDate: c.startDate,
      endDate: c.endDate,
      amount: c.amount,
      price: c.price,
      image: c.image,
    });
    setEditErrors({});
    setEditOpen(true);
  }, []);

  const handleEditSubmit = useCallback(async () => {
    if (editId === null) return;

    const errors = validateForm(editForm, true);
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setEditSubmitting(true);
    try {
      const payload: Coupon = {
        id: editId,
        companyID: 0,
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        category: editForm.category,
        startDate: editForm.startDate,
        endDate: editForm.endDate,
        amount: Number(editForm.amount),
        price: Number(editForm.price),
        image: editForm.image.trim() || "",
      };

      await axiosJWT.put(
        `${import.meta.env.VITE_API_URL}/company/coupons/${editId}`,
        payload,
      );
      dispatch(updateCoupon(payload));
      setEditOpen(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to update coupon. Please try again.";
      setEditErrors({ title: msg });
    } finally {
      setEditSubmitting(false);
    }
  }, [editForm, editId, dispatch]);

  // ── Handlers: Delete ─────────────────────────────────────────────
  const openDeleteDialog = useCallback((c: Coupon) => {
    setDeleteTarget({ id: c.id, title: c.title });
    setDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;

    setDeleteLoading(true);
    try {
      await axiosJWT.delete(
        `${import.meta.env.VITE_API_URL}/company/coupons/${deleteTarget.id}`,
      );
      dispatch(deleteCompanyCoupon(deleteTarget.id));
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete coupon:", err);
    } finally {
      setDeleteLoading(false);
    }
  }, [deleteTarget, dispatch]);

  // ── Render helpers ───────────────────────────────────────────────
  const renderTableSkeleton = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
        {Array.from({ length: 9 }).map((_, j) => (
          <TableCell key={j}>
            <Skeleton variant="text" animation="wave" />
          </TableCell>
        ))}
      </TableRow>
    ));

  const renderCouponFormFields = (
    form: CouponFormData,
    setForm: React.Dispatch<React.SetStateAction<CouponFormData>>,
    errors: FormErrors,
    isUpdate: boolean,
  ) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      {/* Title */}
      <TextField
        label="Title"
        required
        fullWidth
        size="small"
        disabled={isUpdate}
        value={form.title}
        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
        error={!!errors.title}
        helperText={errors.title || (isUpdate ? "Title cannot be changed" : undefined)}
      />

      {/* Description */}
      <TextField
        label="Description"
        fullWidth
        size="small"
        multiline
        minRows={2}
        value={form.description}
        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
      />

      {/* Category */}
      <FormControl fullWidth size="small" required error={!!errors.category}>
        <InputLabel>Category</InputLabel>
        <Select
          value={form.category}
          label="Category"
          onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
        >
          {CATEGORY_OPTIONS.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
        {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
      </FormControl>

      {/* Dates */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Start Date"
          type="date"
          required
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
          value={form.startDate}
          onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
          error={!!errors.startDate}
          helperText={errors.startDate}
        />
        <TextField
          label="End Date"
          type="date"
          required
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: form.startDate || undefined }}
          value={form.endDate}
          onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
          error={!!errors.endDate}
          helperText={errors.endDate}
        />
      </Box>

      {/* Amount & Price */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Amount"
          type="number"
          required
          fullWidth
          size="small"
          inputProps={{ min: 1 }}
          value={form.amount}
          onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
          error={!!errors.amount}
          helperText={errors.amount}
        />
        <TextField
          label="Price ($)"
          type="number"
          required
          fullWidth
          size="small"
          inputProps={{ min: 0.01, step: 0.01 }}
          value={form.price}
          onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
          error={!!errors.price}
          helperText={errors.price}
        />
      </Box>

      {/* Image URL */}
      <TextField
        label="Image URL"
        fullWidth
        size="small"
        placeholder="https://..."
        value={form.image}
        onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
      />
    </Box>
  );

  // ══════════════════════════════════════════════════════════════════
  // JSX
  // ══════════════════════════════════════════════════════════════════

  return (
    <PageTransition>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <PageHeader
        title="My Coupons"
        subtitle={
          loading
            ? "Loading coupons..."
            : `${coupons.length} coupon${coupons.length !== 1 ? "s" : ""} total`
        }
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
          >
            Add Coupon
          </Button>
        }
      />

      {/* ── Search & Filter Bar ────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          alignItems: "center",
        }}
      >
        <Box sx={{ flex: "1 1 260px", minWidth: 200 }}>
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
            sx={{ borderRadius: "12px", bgcolor: "background.paper" }}
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
            sx={{ borderRadius: "12px", bgcolor: "background.paper" }}
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
          sx={{ borderRadius: "16px", border: 1, borderColor: "divider" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {["Title", "Category", "Price", "Amount", "Start Date", "End Date", "Status", "Actions"].map(
                  (h) => (
                    <TableCell key={h} sx={headerCellSx}>
                      {h}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>
            <TableBody>{renderTableSkeleton()}</TableBody>
          </Table>
        </TableContainer>
      ) : filtered.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: 1,
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <EmptyState
            title={
              searchTerm || categoryFilter
                ? "No coupons match your filters"
                : "No coupons yet"
            }
            description={
              searchTerm || categoryFilter
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Create your first coupon to start engaging customers."
            }
            action={
              !searchTerm && !categoryFilter
                ? { label: "Add Coupon", onClick: openAddDialog }
                : undefined
            }
          />
        </Paper>
      ) : (
        <>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: "16px", border: 1, borderColor: "divider" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellSx}>Title</TableCell>
                  <TableCell sx={headerCellSx}>Category</TableCell>
                  <TableCell sx={headerCellSx} align="right">
                    Price
                  </TableCell>
                  <TableCell sx={headerCellSx} align="right">
                    Amount
                  </TableCell>
                  <TableCell sx={headerCellSx}>Start Date</TableCell>
                  <TableCell sx={headerCellSx}>End Date</TableCell>
                  <TableCell sx={headerCellSx}>Status</TableCell>
                  <TableCell sx={headerCellSx} align="center">
                    Actions
                  </TableCell>
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
                        "&:last-child td": { borderBottom: 0 },
                        opacity: expired ? 0.65 : 1,
                      }}
                    >
                      {/* Title */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        >
                          {c.title}
                        </Typography>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Chip
                          label={c.category}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.72rem",
                            borderRadius: "8px",
                            bgcolor: `${CATEGORY_COLORS[c.category] || "#757575"}14`,
                            color: CATEGORY_COLORS[c.category] || "#757575",
                          }}
                        />
                      </TableCell>

                      {/* Price */}
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ${c.price.toFixed(2)}
                        </Typography>
                      </TableCell>

                      {/* Amount */}
                      <TableCell align="right">
                        <Typography variant="body2">{c.amount}</Typography>
                      </TableCell>

                      {/* Start Date */}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(c.startDate)}
                        </Typography>
                      </TableCell>

                      {/* End Date */}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(c.endDate)}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={expired ? "expired" : "active"} />
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                          <Tooltip title="View details">
                            <IconButton size="small" onClick={() => handleView(c)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit coupon">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => openEditDialog(c)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete coupon">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => openDeleteDialog(c)}
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

          {/* Pagination */}
          {pageCount > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
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

      {/* ── View Coupon Dialog (SingleCoupon) ──────────────────────── */}
      {viewCoupon && (
        <SingleCoupon
          coupon={viewCoupon}
          open={!!viewCoupon}
          onClose={() => setViewCoupon(null)}
        />
      )}

      {/* ── Add Coupon Dialog ──────────────────────────────────────── */}
      <Dialog
        open={addOpen}
        onClose={addSubmitting ? undefined : () => setAddOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Coupon</DialogTitle>
        <DialogContent>
          {renderCouponFormFields(addForm, setAddForm, addErrors, false)}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setAddOpen(false)}
            disabled={addSubmitting}
            sx={{ borderRadius: "8px", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddSubmit}
            disabled={addSubmitting}
            sx={{ borderRadius: "8px", textTransform: "none", minWidth: 100 }}
          >
            {addSubmitting ? <CircularProgress size={20} color="inherit" /> : "Add Coupon"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Update Coupon Dialog ───────────────────────────────────── */}
      <Dialog
        open={editOpen}
        onClose={editSubmitting ? undefined : () => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Update Coupon</DialogTitle>
        <DialogContent>
          {renderCouponFormFields(editForm, setEditForm, editErrors, true)}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setEditOpen(false)}
            disabled={editSubmitting}
            sx={{ borderRadius: "8px", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            disabled={editSubmitting}
            sx={{ borderRadius: "8px", textTransform: "none", minWidth: 100 }}
          >
            {editSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirmation ────────────────────────────────────── */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Coupon"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        confirmColor="error"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
      />
    </PageTransition>
  );
}
