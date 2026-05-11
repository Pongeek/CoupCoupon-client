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
  People as PeopleIcon,
} from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '../../../../hooks/useAppStore';
import { setCustomers, addCustomer, updateCustomer, deleteCustomer } from '../../../../store';
import type { Customer } from '../../../../types';
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
interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

const EMPTY_FORM: CustomerFormData = { firstName: '', lastName: '', email: '', password: '' };

function validateForm(data: CustomerFormData, isUpdate = false): FormErrors {
  const errors: FormErrors = {};
  if (!data.firstName.trim()) errors.firstName = 'First name is required';
  if (!data.lastName.trim()) errors.lastName = 'Last name is required';
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
export function GetAllCustomers(): JSX.Element {
  const dispatch = useAppDispatch();
  const customers = useAppSelector((s) => s.admin.customers);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<CustomerFormData>(EMPTY_FORM);
  const [addErrors, setAddErrors] = useState<FormErrors>({});
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<CustomerFormData>(EMPTY_FORM);
  const [editErrors, setEditErrors] = useState<FormErrors>({});
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const { data } = await axiosJWT.get(
          `${import.meta.env.VITE_API_URL}/admin/customers`
        );
        if (!cancelled) {
          const list = Array.isArray(data) ? data : data.content ?? [];
          dispatch(setCustomers(list));
        }
      } catch (err) {
        console.error('Failed to fetch customers:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchCustomers();
    return () => { cancelled = true; };
  }, [dispatch]);

  // ── Filtering / pagination ──────────────────────────────────────
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return customers;
    const q = searchTerm.toLowerCase();
    return customers.filter(
      (c) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [customers, searchTerm]);

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
        `${import.meta.env.VITE_API_URL}/admin/customers`,
        {
          firstName: addForm.firstName.trim(),
          lastName: addForm.lastName.trim(),
          email: addForm.email.trim(),
          password: addForm.password,
        }
      );
      const created: Customer = data.id
        ? data
        : {
            id: data,
            firstName: addForm.firstName.trim(),
            lastName: addForm.lastName.trim(),
            email: addForm.email.trim(),
            coupons: [],
          };
      dispatch(addCustomer(created));
      setAddOpen(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to add customer. Email may already exist.';
      setAddErrors({ email: msg });
    } finally {
      setAddSubmitting(false);
    }
  }, [addForm, dispatch]);

  // ── Edit handler ────────────────────────────────────────────────
  const openEditDialog = useCallback((c: Customer) => {
    setEditId(c.id);
    setEditForm({
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      password: '',
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
      await axiosJWT.put(
        `${import.meta.env.VITE_API_URL}/admin/customers/${editId}`,
        {
          id: editId,
          firstName: editForm.firstName.trim(),
          lastName: editForm.lastName.trim(),
          email: editForm.email.trim(),
          ...(editForm.password ? { password: editForm.password } : {}),
        }
      );
      dispatch(
        updateCustomer({
          id: editId,
          firstName: editForm.firstName.trim(),
          lastName: editForm.lastName.trim(),
          email: editForm.email.trim(),
          coupons: customers.find((c) => c.id === editId)?.coupons ?? [],
        })
      );
      setEditOpen(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to update customer.';
      setEditErrors({ email: msg });
    } finally {
      setEditSubmitting(false);
    }
  }, [editForm, editId, dispatch, customers]);

  // ── Delete handler ──────────────────────────────────────────────
  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await axiosJWT.delete(
        `${import.meta.env.VITE_API_URL}/admin/customers/${deleteTarget.id}`
      );
      dispatch(deleteCustomer(deleteTarget.id));
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete customer:', err);
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
    form: CustomerFormData,
    setForm: React.Dispatch<React.SetStateAction<CustomerFormData>>,
    errors: FormErrors,
    isUpdate: boolean
  ) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="First Name"
          required
          fullWidth
          size="small"
          value={form.firstName}
          onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          label="Last Name"
          required
          fullWidth
          size="small"
          value={form.lastName}
          onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
      </Box>
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
        title="Customer Management"
        subtitle={
          loading
            ? 'Loading customers...'
            : `${customers.length} customer${customers.length !== 1 ? 's' : ''} registered`
        }
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            Add Customer
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
            title={searchTerm ? 'No customers match your search' : 'No customers yet'}
            description={
              searchTerm
                ? 'Try adjusting your search to find what you\'re looking for.'
                : 'Add your first customer to get started.'
            }
            icon={<PeopleIcon sx={{ fontSize: 64 }} />}
            action={!searchTerm ? { label: 'Add Customer', onClick: openAddDialog } : undefined}
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
                {paginated.map((customer) => (
                  <TableRow key={customer.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            bgcolor: 'secondary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          {customer.firstName.charAt(0).toUpperCase()}
                          {customer.lastName.charAt(0).toUpperCase()}
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {customer.firstName} {customer.lastName}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {customer.email}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={customer.coupons?.length || 0}
                        size="small"
                        color={customer.coupons?.length ? 'primary' : 'default'}
                        sx={{ fontWeight: 600, borderRadius: '8px', minWidth: 32 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        <Tooltip title="Edit customer">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => openEditDialog(customer)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete customer">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setDeleteTarget({
                                id: customer.id,
                                name: `${customer.firstName} ${customer.lastName}`,
                              });
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

      {/* ── Add Customer Dialog ───────────────────────────────────── */}
      <Dialog
        open={addOpen}
        onClose={addSubmitting ? undefined : () => setAddOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Customer</DialogTitle>
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
            {addSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Add Customer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit Customer Dialog ──────────────────────────────────── */}
      <Dialog
        open={editOpen}
        onClose={editSubmitting ? undefined : () => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Update Customer</DialogTitle>
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
        title="Delete Customer"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
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
