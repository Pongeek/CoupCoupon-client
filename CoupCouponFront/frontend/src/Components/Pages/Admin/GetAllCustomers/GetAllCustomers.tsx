import { useEffect, useState } from "react";
import "./GetAllCustomers.css";
import { CustomerDetails } from "../../../Model/CustomerDetails";
import axiosJWT from "../../../Util/AxiosJWT";
import { SingleCustomer } from "../../SingleCustomer/SingleCustomer";
import { checkData } from "../../../Util/checkData";
import { store } from "../../../Redux/store";
import { useNavigate } from "react-router-dom";
import { addCustomerAction, deleteCustomerAction, getCustomersAction, updateCustomerAction } from "../../../Redux/AdminReducer";
import { Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField } from "@mui/material";
import axios from "axios";
import { CouponDetails } from "../../../Model/CouponDetails";

/**
 * GetAllCustomers component that displays a list of all customers and provides functionality to add, update, and delete customers.
 * @returns {JSX.Element} The rendered GetAllCustomers component.
 */
export function GetAllCustomers(): JSX.Element {
    const [customers, setCustomers] = useState<CustomerDetails[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);
    const [customerCoupons, setCustomerCoupons] = useState<CouponDetails[]>([]);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [customerToUpdate, setCustomerToUpdate] = useState<CustomerDetails | null>(null);
    const [emailExistsError, setEmailExistsError] = useState<string | null>(null);
    const [addCustomerDialogOpen, setAddCustomerDialogOpen] = useState(false);
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
            try {
                const response = await axiosJWT.get("http://localhost:8080/CoupCouponAPI/Admin/GetAllCustomers");
                console.log("Customers:", response.data);
                store.dispatch(getCustomersAction(response.data));
                setCustomers(store.getState().admin.customers);
            } catch (error) {
                console.error("Error fetching customers:", error);
                checkData();
                navigate("/login");
            }
        };

        if (store.getState().admin.customers.length === 0) {
            fetchCustomers();
        } else {
            setCustomers(store.getState().admin.customers);
        }
    }, [navigate]);

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
        try {
            const checkEmailExists = await axios.get(`http://localhost:8080/CoupCouponAPI/Login/IsEmailExist/${newCustomer.email}`);
            if (checkEmailExists.data === true && newCustomer.email !== customers.find(c => c.id === newCustomer.id)?.email) {
                setEmailExistsError("Email already exists");
                return;
            } else {
                setEmailExistsError(null);
            }
        }
        catch (error) {
            console.error("Error checking email:", error);
        }

        try {
            const response = await axiosJWT.post("http://localhost:8080/CoupCouponAPI/Admin/AddCustomer", newCustomer);
            store.dispatch(addCustomerAction(newCustomer));
            setCustomers([...customers, newCustomer]);
            console.log("Add a new customer successfully", newCustomer);
            setAddCustomerDialogOpen(false);
            setEmailExistsError(null);
            setNewCustomer({ id: 0, firstName: '', lastName: '', email: '', password: '', coupons: [] });
        } catch (error) {
            console.error("Error adding customer:", error);
        }
        window.location.reload();
    };

    // Handle delete customer action
    const handleDeleteCustomer = (customerId: number) => {
        setCustomerToDelete(customerId);
        setDeleteDialogOpen(true);
    };

    // Confirm delete customer action
    const confirmDeleteCustomer = async () => {
        if (customerToDelete !== null) {
            try {
                const response = await axiosJWT.delete(`http://localhost:8080/CoupCouponAPI/Admin/DeleteCustomer/${customerToDelete}`);

                if (response.status === 202 || response.status === 200) {
                    const updatedCustomers = customers.filter(customer => customer.id !== customerToDelete);
                    setCustomers(updatedCustomers);
                    store.dispatch(deleteCustomerAction(customerToDelete));
                    console.log("Customer deleted successfully");
                } else {
                    console.error("Unexpected response status:", response);
                }

                setDeleteDialogOpen(false);
                setCustomerToDelete(null);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    console.error("Error deleting customer:", error.response.data);
                } else {
                    console.error("Error deleting customer:", error);
                }
                setDeleteDialogOpen(false);
                setCustomerToDelete(null);
            }
        }
    };

    // Handle update customer action
    const handleUpdateCustomer = (customer: CustomerDetails) => {
        setCustomerToUpdate(customer);
        setUpdateDialogOpen(true);
    };

    // Confirm update customer action
    const handleUpdate = async () => {
        if (customerToUpdate) {
            try {
                const checkEmailExists = await axiosJWT.get(`http://localhost:8080/CoupCouponAPI/Login/IsEmailExist/${customerToUpdate.email}`);
                if (checkEmailExists.data === true && customerToUpdate.email !== customers.find(c => c.id === customerToUpdate.id)?.email) {
                    setEmailExistsError("Email already exists");
                    return;
                } else {
                    setEmailExistsError(null);
                }
            }
            catch (error) {
                console.error("Error checking email:", error);
            }

            try {
                console.log("Customer to update:", customerToUpdate);
                const response = await axiosJWT.put(`http://localhost:8080/CoupCouponAPI/Admin/UpdateCustomer/${customerToUpdate.id}`, customerToUpdate);
                store.dispatch(updateCustomerAction(customerToUpdate, customerToUpdate.id));
                const updatedCustomers = customers.map(c => c.id === customerToUpdate.id ? customerToUpdate : c);
                setCustomers(updatedCustomers);
                console.log("Update a customer successfully", customerToUpdate);
                setUpdateDialogOpen(false);
                setCustomerToUpdate(null);
            } catch (error) {
                console.error("Error updating customer:", error);
            }
        }
    };

    return (
        <div className="GetAllCustomers">
            <h1>All Customers</h1>
            <Button variant="contained" color="primary" onClick={() => setAddCustomerDialogOpen(true)}>
                Add Customer
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell> <h3>ID</h3></TableCell>
                            <TableCell> <h3>First Name</h3></TableCell>
                            <TableCell> <h3>Last Name</h3></TableCell>
                            <TableCell> <h3>Email</h3></TableCell>
                            <TableCell> <h3>Actions</h3></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer.id} onClick={() => handleRowClick(customer)} style={{ cursor: 'pointer' }}>
                                <TableCell>{customer.id}</TableCell>
                                <TableCell>{customer.firstName}</TableCell>
                                <TableCell>{customer.lastName}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteCustomer(customer.id); }}>
                                        Delete
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); handleUpdateCustomer(customer); }}>
                                        Update
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {selectedCustomer && (
                <SingleCustomer open={open} onClose={handleClose} customer={selectedCustomer} />
            )}

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Customer</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this customer?</Typography>
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

            <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
                <DialogTitle>Update Customer</DialogTitle>
                <DialogContent>
                    {customerToUpdate && (
                        <>
                            <TextField
                                label="First Name"
                                value={customerToUpdate.firstName}
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
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
                            <TextField
                                label="Password"
                                value={customerToUpdate.password}
                                onChange={(e) => setCustomerToUpdate({ ...customerToUpdate, password: e.target.value })}
                                fullWidth
                                margin="normal"
                                type="password"
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={addCustomerDialogOpen} onClose={() => setAddCustomerDialogOpen(false)}>
                <DialogTitle>Add Customer</DialogTitle>
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
                    <Button onClick={() => setAddCustomerDialogOpen(false)} color="primary">
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