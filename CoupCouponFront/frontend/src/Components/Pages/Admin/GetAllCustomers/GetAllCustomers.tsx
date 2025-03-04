import { useEffect, useState } from "react";
import "./GetAllCustomers.css";
import { CustomerDetails } from "../../../Model/CustomerDetails";
import axiosJWT from "../../../Util/AxiosJWT";
import { SingleCustomer } from "../../SingleCustomer/SingleCustomer";
import { checkData } from "../../../Util/checkData";
import { store } from "../../../Redux/store";
import { useNavigate } from "react-router-dom";
import { addCustomerAction, deleteCustomerAction, getCustomersAction, updateCustomerAction } from "../../../Redux/AdminReducer";
import { 
    Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, 
    Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, 
    Pagination, IconButton, InputAdornment, Box, Chip, Tooltip
} from "@mui/material";
import { Search as SearchIcon, Refresh as RefreshIcon, Delete as DeleteIcon, Edit as EditIcon, Person as PersonIcon, Add as AddIcon } from '@mui/icons-material';
import { CouponDetails } from "../../../Model/CouponDetails";

/**
 * GetAllCustomers component that displays a list of all customers and provides functionality to add, update, and delete customers.
 * @returns {JSX.Element} The rendered GetAllCustomers component.
 */
export function GetAllCustomers(): JSX.Element {
    const [customers, setCustomers] = useState<CustomerDetails[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<CustomerDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);
    const [customerCoupons, setCustomerCoupons] = useState<CouponDetails[]>([]);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [customerToUpdate, setCustomerToUpdate] = useState<CustomerDetails | null>(null);
    const [emailExistsError, setEmailExistsError] = useState<string | null>(null);
    const [addCustomerDialogOpen, setAddCustomerDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(5);
    
    const [newCustomer, setNewCustomer] = useState<CustomerDetails>({
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        coupons: []
    });

    const navigate = useNavigate();

    // useEffect hook to fetch customers when the component mounts
    useEffect(() => {
        checkData();
        const fetchCustomers = async () => {
            setIsLoading(true);
            try {
                const response = await axiosJWT.get("http://localhost:8080/CoupCouponAPI/Admin/GetAllCustomers");
                console.log("Customers:", response.data);
                store.dispatch(getCustomersAction(response.data));
                setCustomers(store.getState().admin.customers);
                setFilteredCustomers(store.getState().admin.customers);
            } catch (error) {
                console.error("Error fetching customers:", error);
                checkData();
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        };

        if (store.getState().admin.customers.length === 0) {
            fetchCustomers();
        } else {
            setCustomers(store.getState().admin.customers);
            setFilteredCustomers(store.getState().admin.customers);
        }
    }, [navigate]);

    // Search filter effect
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredCustomers(customers);
        } else {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = customers.filter(
                customer => 
                    customer.firstName.toLowerCase().includes(lowercasedSearchTerm) ||
                    customer.lastName.toLowerCase().includes(lowercasedSearchTerm) ||
                    customer.email.toLowerCase().includes(lowercasedSearchTerm)
            );
            setFilteredCustomers(filtered);
        }
        // Reset to first page when filtering
        setPage(1);
    }, [searchTerm, customers]);

    // Handle row click to view customer details
    const handleRowClick = (customer: CustomerDetails) => {
        console.log("Customer coupons:", customer.coupons);
        setSelectedCustomer(customer);
        setOpen(true);
    };

    // Handle close dialog
    const handleClose = () => {
        setOpen(false);
        setSelectedCustomer(null);
    };

    // Handle add customer submit
    const handleAddCustomerSubmit = async () => {
        // Validation
        if (
            !newCustomer.firstName.trim() ||
            !newCustomer.lastName.trim() ||
            !newCustomer.email.trim() ||
            !newCustomer.password.trim()
        ) {
            setEmailExistsError("All fields are required");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newCustomer.email)) {
            setEmailExistsError("Invalid email format");
            return;
        }

        try {
            setIsLoading(true);
            const response = await axiosJWT.post("http://localhost:8080/CoupCouponAPI/Admin/AddCustomer", newCustomer);
            
            console.log("Customer added successfully:", response.data);
            
            // Update Redux store
            const addedCustomer = {
                ...newCustomer,
                id: response.data.id, // Use the ID from the response
                coupons: [] // Initialize with empty coupons array
            };
            
            store.dispatch(addCustomerAction(addedCustomer));
            setCustomers([...customers, addedCustomer]);
            
            // Reset form & close dialog
            setNewCustomer({
                id: 0,
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                coupons: []
            });
            setEmailExistsError(null);
            setAddCustomerDialogOpen(false);
        } catch (error) {
            console.error("Error adding customer:", error);
            setEmailExistsError("Email already exists or server error");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle delete customer action
    const handleDeleteCustomer = (customerId: number) => {
        setCustomerToDelete(customerId);
        setDeleteDialogOpen(true);
    };

    // Confirm delete customer action
    const confirmDeleteCustomer = async () => {
        if (customerToDelete !== null) {
            setIsLoading(true);
            try {
                await axiosJWT.delete(`http://localhost:8080/CoupCouponAPI/Admin/DeleteCustomer/${customerToDelete}`);
                
                // Update Redux store and local state
                store.dispatch(deleteCustomerAction(customerToDelete));
                const updatedCustomers = customers.filter(customer => customer.id !== customerToDelete);
                setCustomers(updatedCustomers);
                
                setDeleteDialogOpen(false);
                setCustomerToDelete(null);
            } catch (error) {
                console.error("Error deleting customer:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle update customer action
    const handleUpdateCustomer = (customer: CustomerDetails) => {
        setCustomerToUpdate({ ...customer });
        setUpdateDialogOpen(true);
    };

    // Handle update submit
    const handleUpdate = async () => {
        if (!customerToUpdate) return;
        
        // Validation
        if (
            !customerToUpdate.firstName.trim() ||
            !customerToUpdate.lastName.trim() ||
            !customerToUpdate.email.trim()
        ) {
            setEmailExistsError("All fields are required");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerToUpdate.email)) {
            setEmailExistsError("Invalid email format");
            return;
        }

        setIsLoading(true);
        try {
            await axiosJWT.put(`http://localhost:8080/CoupCouponAPI/Admin/UpdateCustomer`, customerToUpdate);
            
            // Update Redux store and local state
            store.dispatch(updateCustomerAction(customerToUpdate, customerToUpdate.id));
            const updatedCustomers = customers.map(customer => 
                customer.id === customerToUpdate.id ? customerToUpdate : customer
            );
            setCustomers(updatedCustomers);
            
            setUpdateDialogOpen(false);
            setCustomerToUpdate(null);
            setEmailExistsError(null);
        } catch (error) {
            console.error("Error updating customer:", error);
            setEmailExistsError("Email already exists or server error");
        } finally {
            setIsLoading(false);
        }
    };

    // Refresh customers data
    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            const response = await axiosJWT.get("http://localhost:8080/CoupCouponAPI/Admin/GetAllCustomers");
            store.dispatch(getCustomersAction(response.data));
            setCustomers(response.data);
            setSearchTerm("");
        } catch (error) {
            console.error("Error refreshing customers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Get current page items
    const getCurrentPageItems = () => {
        const startIndex = (page - 1) * rowsPerPage;
        return filteredCustomers.slice(startIndex, startIndex + rowsPerPage);
    };

    // Handle page change
    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className="GetAllCustomers">
            <h1>Customer Management</h1>
            
            <div className="table-actions-container">
                <div className="search-filter-container">
                    <TextField
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                        variant="outlined"
                        size="small"
                    />
                    
                    <Tooltip title="Refresh data">
                        <IconButton onClick={handleRefresh} className="refresh-button">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => setAddCustomerDialogOpen(true)}
                    className="add-button">
                    Add Customer
                </Button>
            </div>

            <TableContainer component={Paper} className="table-container">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Coupons</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getCurrentPageItems().map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell>{customer.id}</TableCell>
                                <TableCell>{customer.firstName}</TableCell>
                                <TableCell>{customer.lastName}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={`${customer.coupons?.length || 0} coupons`} 
                                        color={customer.coupons?.length ? "primary" : "default"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <Tooltip title="View details">
                                            <IconButton onClick={() => handleRowClick(customer)} color="info" size="small">
                                                <PersonIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit customer">
                                            <IconButton onClick={() => handleUpdateCustomer(customer)} color="primary" size="small">
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete customer">
                                            <IconButton onClick={() => handleDeleteCustomer(customer.id)} color="error" size="small">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredCustomers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="body1" color="textSecondary">
                                        {searchTerm ? "No customers found matching your search" : "No customers found"}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {filteredCustomers.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination 
                        count={Math.ceil(filteredCustomers.length / rowsPerPage)} 
                        page={page} 
                        onChange={handlePageChange} 
                        color="primary" 
                    />
                </Box>
            )}

            {/* View Customer Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
            >
                <DialogTitle>Customer Details</DialogTitle>
                <DialogContent>
                    {selectedCustomer && <SingleCustomer customer={selectedCustomer} open={open} onClose={handleClose} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Customer Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this customer? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteCustomer} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Update Customer Dialog */}
            <Dialog
                open={updateDialogOpen}
                onClose={() => {
                    setUpdateDialogOpen(false);
                    setEmailExistsError(null);
                }}
            >
                <DialogTitle>Update Customer</DialogTitle>
                <DialogContent>
                    {customerToUpdate && (
                        <>
                            <TextField
                                label="First Name"
                                value={customerToUpdate.firstName}
                                onChange={(e) => setCustomerToUpdate({ ...customerToUpdate, firstName: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Last Name"
                                value={customerToUpdate.lastName}
                                onChange={(e) => setCustomerToUpdate({ ...customerToUpdate, lastName: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Email"
                                value={customerToUpdate.email}
                                onChange={(e) => setCustomerToUpdate({ ...customerToUpdate, email: e.target.value })}
                                fullWidth
                                margin="normal"
                                error={!!emailExistsError}
                                helperText={emailExistsError}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setUpdateDialogOpen(false);
                        setEmailExistsError(null);
                    }} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Customer Dialog */}
            <Dialog
                open={addCustomerDialogOpen}
                onClose={() => {
                    setAddCustomerDialogOpen(false);
                    setEmailExistsError(null);
                    setNewCustomer({
                        id: 0,
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        coupons: []
                    });
                }}
            >
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogContent>
                    <TextField
                        label="First Name"
                        value={newCustomer.firstName}
                        onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Last Name"
                        value={newCustomer.lastName}
                        onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        fullWidth
                        margin="normal"
                        error={!!emailExistsError}
                        helperText={emailExistsError}
                    />
                    <TextField
                        label="Password"
                        value={newCustomer.password}
                        onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
                        fullWidth
                        margin="normal"
                        type="password"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setAddCustomerDialogOpen(false);
                        setEmailExistsError(null);
                        setNewCustomer({
                            id: 0,
                            firstName: '',
                            lastName: '',
                            email: '',
                            password: '',
                            coupons: []
                        });
                    }} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddCustomerSubmit} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}