import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
  Paper,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '../../../../hooks/useAppStore';
import { setCompanies, addCompany, updateCompany, deleteCompany } from '../../../../store';
import type { Company } from '../../../../types';
import axiosJWT from '../../../Util/AxiosJWT';
import {
  SearchBar,
  ConfirmDialog,
  EmptyState,
  PageHeader,
  PageTransition,
} from '../../../shared';

// ── Constants ─────────────────────────────────────────────────────────
const ROWS_PER_PAGE = 10;

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

// ── Form types ────────────────────────────────────────────────────────
interface CompanyFormData {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

const EMPTY_FORM: CompanyFormData = { name: '', email: '', password: '' };

function validateForm(data: CompanyFormData, isUpdate = false): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = 'Company name is required';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Invalid email format';
  if (!isUpdate) {
    if (!data.password.trim()) errors.password = 'Password is required';
    else if (data.password.length < 5)
      errors.password = 'Password must be at least 5 characters';
  }
  return errors;
}

// ── Component ─────────────────────────────────────────────────────────
export function GetAllCompanies(): JSX.Element {
  const dispatch = useAppDispatch();
  const companies = useAppSelector((s) => s.admin.companies);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<CompanyFormData>(EMPTY_FORM);
  const [addErrors, setAddErrors] = useState<FormErrors>({});
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<CompanyFormData>(EMPTY_FORM);
  const [editErrors, setEditErrors] = useState<FormErrors>({});
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const { data } = await axiosJWT.get(
          `${import.meta.env.VITE_API_URL}/admin/companies`
        );
        if (!cancelled) {
          const list = Array.isArray(data) ? data : data.content ?? [];
          dispatch(setCompanies(list));
        }
      } catch (err) {
        console.error('Failed to fetch companies:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchCompanies();
    return () => { cancelled = true; };
  }, [dispatch]);

  // ── Filtering / pagination ──────────────────────────────────────
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return companies;
    const q = searchTerm.toLowerCase();
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [companies, searchTerm]);

  const pageCount = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  useEffect(() => { setPage(1); }, [searchTerm]);

  // ── Add handler ─────────────────────────────────────────────────
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
      const { data } = await axiosJWT.post(
        `${import.meta.env.VITE_API_URL}/admin/companies`,
        {
          name: addForm.name.trim(),
          email: addForm.email.trim(),
          password: addForm.password,
        }
      );
      const created: Company = data.id
        ? data
        : { id: data, name: addForm.name.trim(), email: addForm.email.trim(), coupons: [] };
      dispatch(addCompany(created));
      setAddOpen(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to add company. Email may already exist.';
      setAddErrors({ email: msg });
    } finally {
      setAddSubmitting(false);
    }
  }, [addForm, dispatch]);

  // ── Edit handler ────────────────────────────────────────────────
  const openEditDialog = useCallback((c: Company) => {
    setEditId(c.id);
    setEditForm({ name: c.name, email: c.email, password: '' });
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
      await axiosJWT.put(
        `${import.meta.env.VITE_API_URL}/admin/companies/${editId}`,
        {
          id: editId,
          name: editForm.name.trim(),
          email: editForm.email.trim(),
          ...(editForm.password ? { password: editForm.password } : {}),
        }
      );
      dispatch(
        updateCompany({
          id: editId,
          name: editForm.name.trim(),
          email: editForm.email.trim(),
          coupons: companies.find((c) => c.id === editId)?.coupons ?? [],
        })
      );
      setEditOpen(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to update company.';
      setEditErrors({ email: msg });
    } finally {
      setEditSubmitting(false);
    }
  }, [editForm, editId, dispatch, companies]);

  // ── Delete handler ──────────────────────────────────────────────
  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await axiosJWT.delete(
        `${import.meta.env.VITE_API_URL}/admin/companies/${deleteTarget.id}`
      );
      dispatch(deleteCompany(deleteTarget.id));
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete company:', err);
    } finally {
      setDeleteLoading(false);
    }
  }, [deleteTarget, dispatch]);

  // ── Skeleton ────────────────────────────────────────────────────
  const renderSkeleton = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
        {Array.from({ length: 5 }).map((_, j) => (
          <TableCell key={j}>
            <Skeleton variant="text" animation="wave" />
          </TableCell>
        ))}
      </TableRow>
    ));

  // ── Form fields helper ──────────────────────────────────────────
  const renderFormFields = (
    form: CompanyFormData,
    setForm: React.Dispatch<React.SetStateAction<CompanyFormData>>,
    errors: FormErrors,
    isUpdate: boolean
  ) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
      <TextField
        label="Company Name"
        required
        fullWidth
        size="small"
        value={form.name}
        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        label="Email"
        required
        fullWidth
        size="small"
        type="email"
        value={form.email}
        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        label={isUpdate ? 'New Password (leave blank to keep)' : 'Password'}
        required={!isUpdate}
        fullWidth
        size="small"
        type="password"
        value={form.password}
        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
        error={!!errors.password}
        helperText={errors.password}
      />
    </Box>
  );

  return (
    <PageTransition>
      <PageHeader
        title="Company Management"
        subtitle={
          loading
            ? 'Loading companies...'
            : `${companies.length} compan${companies.length !== 1 ? 'ies' : 'y'} registered`
        }
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            Add Company
          </Button>
        }
      />

      {/* Search */}
      <Box sx={{ maxWidth: 420, mb: 3 }}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name or email..."
        />
      </Box>

      {/* Table */}
      {loading ? (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ borderRadius: '16px', border: 1, borderColor: 'divider' }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {['Name', 'Email', 'Coupons', 'Actions'].map((h) => (
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
            title={searchTerm ? 'No companies match your search' : 'No companies yet'}
            description={
              searchTerm
                ? 'Try adjusting your search to find what you\'re looking for.'
                : 'Add your first company to get started.'
            }
            icon={<BusinessIcon sx={{ fontSize: 64 }} />}
            action={!searchTerm ? { label: 'Add Company', onClick: openAddDialog } : undefined}
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
                  <TableCell sx={headerCellSx}>Name</TableCell>
                  <TableCell sx={headerCellSx}>Email</TableCell>
                  <TableCell sx={headerCellSx} align="center">Coupons</TableCell>
                  <TableCell sx={headerCellSx} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((company) => (
                  <TableRow key={company.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '10px',
                            bgcolor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          {company.name.charAt(0).toUpperCase()}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {company.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {company.email}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={company.coupons?.length || 0}
                        size="small"
                        color={company.coupons?.length ? 'primary' : 'default'}
                        sx={{ fontWeight: 600, borderRadius: '8px', minWidth: 32 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        <Tooltip title="Edit company">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => openEditDialog(company)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete company">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setDeleteTarget({ id: company.id, name: company.name });
                              setDeleteOpen(true);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
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

      {/* ── Add Company Dialog ────────────────────────────────────── */}
      <Dialog
        open={addOpen}
        onClose={addSubmitting ? undefined : () => setAddOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Company</DialogTitle>
        <DialogContent>{renderFormFields(addForm, setAddForm, addErrors, false)}</DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddOpen(false)} disabled={addSubmitting} sx={{ borderRadius: '8px', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddSubmit}
            disabled={addSubmitting}
            sx={{ borderRadius: '8px', textTransform: 'none', minWidth: 100 }}
          >
            {addSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Add Company'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit Company Dialog ───────────────────────────────────── */}
      <Dialog
        open={editOpen}
        onClose={editSubmitting ? undefined : () => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Update Company</DialogTitle>
        <DialogContent>{renderFormFields(editForm, setEditForm, editErrors, true)}</DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)} disabled={editSubmitting} sx={{ borderRadius: '8px', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            disabled={editSubmitting}
            sx={{ borderRadius: '8px', textTransform: 'none', minWidth: 100 }}
          >
            {editSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirmation ───────────────────────────────────── */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Company"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? All associated coupons will also be removed. This action cannot be undone.`
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
