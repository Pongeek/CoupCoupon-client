import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Pagination, IconButton, InputAdornment, Box, Chip, Tooltip } from "@mui/material";
import "./GetAllCompanies.css";
import { useEffect, useState } from "react";
import { CompanyDetails } from "../../../Model/CompanyDetails";
import { SingleCompany } from "../../SingleCompany/SingleCompany";
import { addCompanyAction, getCompaniesAction, deleteCompanyAction, updateCompanyAction } from "../../../Redux/AdminReducer";
import { store } from "../../../Redux/store";
import axiosJWT from "../../../Util/AxiosJWT";
import { useNavigate } from "react-router-dom";
import { checkData } from "../../../Util/checkData";
import { Search as SearchIcon, Refresh as RefreshIcon, Delete as DeleteIcon, Edit as EditIcon, Business as BusinessIcon, Add as AddIcon } from '@mui/icons-material';
import { CouponDetails } from "../../../Model/CouponDetails";

/**
 * GetAllCompanies component that displays a list of all companies and provides functionality to add, update, and delete companies.
 * @returns {JSX.Element} The rendered GetAllCompanies component.
 */
export function GetAllCompanies(): JSX.Element {
    const [companies, setCompanies] = useState<CompanyDetails[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<CompanyDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCompany, setSelectedCompany] = useState<CompanyDetails | null>(null);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [companyToUpdate, setCompanyToUpdate] = useState<CompanyDetails | null>(null);
    const [emailExistsError, setEmailExistsError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [addCompanyDialogOpen, setAddCompanyDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(5);
    
    const [companyToAdd, setCompanyToAdd] = useState<CompanyDetails>({
        id: 0,
        name: '',
        email: '',
        password: '',
        coupons: []
    });

    const navigate = useNavigate();

    // useEffect hook to fetch companies when the component mounts
    useEffect(() => {
        checkData();
        const fetchCompanies = async () => {
            setIsLoading(true);
            try {
                const response = await axiosJWT.get("http://localhost:8080/CoupCouponAPI/Admin/GetAllCompanies");
                console.log("Companies:", response.data);
                store.dispatch(getCompaniesAction(response.data));
                setCompanies(store.getState().admin.companies);
                setFilteredCompanies(store.getState().admin.companies);
            } catch (error) {
                console.error("Error fetching companies:", error);
                checkData();
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        };

        if (store.getState().admin.companies.length === 0) {
            fetchCompanies();
        } else {
            setCompanies(store.getState().admin.companies);
            setFilteredCompanies(store.getState().admin.companies);
        }
    }, [navigate]);

    // Search filter effect
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredCompanies(companies);
        } else {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = companies.filter(
                company => 
                    company.name.toLowerCase().includes(lowercasedSearchTerm) ||
                    company.email.toLowerCase().includes(lowercasedSearchTerm)
            );
            setFilteredCompanies(filtered);
        }
        // Reset to first page when filtering
        setPage(1);
    }, [searchTerm, companies]);

    // Handle row click to view company details
    const handleRowClick = (company: CompanyDetails) => {
        console.log("Company coupons:", company.coupons);
        setSelectedCompany(company);
        setOpen(true);
    };

    // Handle close dialog
    const handleClose = () => {
        setOpen(false);
        setSelectedCompany(null);
    };

    // Handle add company submit
    const handleAddCompany = async () => {
        // Validation
        if (
            !companyToAdd.name.trim() ||
            !companyToAdd.email.trim() ||
            !companyToAdd.password.trim()
        ) {
            setEmailExistsError("All fields are required");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(companyToAdd.email)) {
            setEmailExistsError("Invalid email format");
            return;
        }

        // Password validation
        if (companyToAdd.password.length < 5) {
            setPasswordError("Password must be at least 5 characters");
            return;
        }

        try {
            setIsLoading(true);
            const response = await axiosJWT.post("http://localhost:8080/CoupCouponAPI/Admin/AddCompany", companyToAdd);
            
            console.log("Company added successfully:", response.data);
            
            // Update Redux store
            const addedCompany = {
                ...companyToAdd,
                id: response.data.id, // Use the ID from the response
                coupons: [] // Initialize with empty coupons array
            };
            
            store.dispatch(addCompanyAction(addedCompany));
            setCompanies([...companies, addedCompany]);
            
            // Reset form & close dialog
            setCompanyToAdd({
                id: 0,
                name: '',
                email: '',
                password: '',
                coupons: []
            });
            setEmailExistsError(null);
            setPasswordError(null);
            setAddCompanyDialogOpen(false);
        } catch (error) {
            console.error("Error adding company:", error);
            setEmailExistsError("Email already exists or server error");
        } finally {
            setIsLoading(false);
        }
    };
    
    // Handle delete company action
    const handleDeleteCompany = (companyId: number) => {
        setCompanyToDelete(companyId);
        setDeleteDialogOpen(true);
    };

    // Confirm delete company action
    const confirmDeleteCompany = async () => {
        if (companyToDelete !== null) {
            setIsLoading(true);
            try {
                await axiosJWT.delete(`http://localhost:8080/CoupCouponAPI/Admin/DeleteCompany/${companyToDelete}`);
                
                // Update Redux store and local state
                store.dispatch(deleteCompanyAction(companyToDelete));
                const updatedCompanies = companies.filter(company => company.id !== companyToDelete);
                setCompanies(updatedCompanies);
                
                setDeleteDialogOpen(false);
                setCompanyToDelete(null);
            } catch (error) {
                console.error("Error deleting company:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle update company action
    const handleUpdateCompany = (company: CompanyDetails) => {
        setCompanyToUpdate({ ...company });
        setUpdateDialogOpen(true);
    };

    // Handle update submit
    const handleUpdate = async () => {
        if (!companyToUpdate) return;
        
        // Validation
        if (
            !companyToUpdate.name.trim() ||
            !companyToUpdate.email.trim()
        ) {
            setEmailExistsError("All fields are required");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(companyToUpdate.email)) {
            setEmailExistsError("Invalid email format");
            return;
        }

        setIsLoading(true);
        try {
            await axiosJWT.put(`http://localhost:8080/CoupCouponAPI/Admin/UpdateCompany`, companyToUpdate);
            
            // Update Redux store and local state
            store.dispatch(updateCompanyAction(companyToUpdate, companyToUpdate.id));
            const updatedCompanies = companies.map(company => 
                company.id === companyToUpdate.id ? companyToUpdate : company
            );
            setCompanies(updatedCompanies);
            
            setUpdateDialogOpen(false);
            setCompanyToUpdate(null);
            setEmailExistsError(null);
        } catch (error) {
            console.error("Error updating company:", error);
            setEmailExistsError("Email already exists or server error");
        } finally {
            setIsLoading(false);
        }
    };

    // Refresh companies data
    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            const response = await axiosJWT.get("http://localhost:8080/CoupCouponAPI/Admin/GetAllCompanies");
            store.dispatch(getCompaniesAction(response.data));
            setCompanies(response.data);
            setSearchTerm("");
        } catch (error) {
            console.error("Error refreshing companies:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Get current page items
    const getCurrentPageItems = () => {
        const startIndex = (page - 1) * rowsPerPage;
        return filteredCompanies.slice(startIndex, startIndex + rowsPerPage);
    };

    // Handle page change
    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className="GetAllCompanies">
            <h1>Company Management</h1>
            
            <div className="table-actions-container">
                <div className="search-filter-container">
                    <TextField
                        placeholder="Search companies..."
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
                    onClick={() => setAddCompanyDialogOpen(true)}
                    className="add-button">
                    Add Company
                </Button>
            </div>

            <TableContainer component={Paper} className="table-container">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Company Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Coupons</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getCurrentPageItems().map((company) => (
                            <TableRow key={company.id}>
                                <TableCell>{company.id}</TableCell>
                                <TableCell>{company.name}</TableCell>
                                <TableCell>{company.email}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={`${company.coupons?.length || 0} coupons`} 
                                        color={company.coupons?.length ? "primary" : "default"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <Tooltip title="View details">
                                            <IconButton onClick={() => handleRowClick(company)} color="info" size="small">
                                                <BusinessIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit company">
                                            <IconButton onClick={() => handleUpdateCompany(company)} color="primary" size="small">
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete company">
                                            <IconButton onClick={() => handleDeleteCompany(company.id)} color="error" size="small">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredCompanies.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="body1" color="textSecondary">
                                        {searchTerm ? "No companies found matching your search" : "No companies found"}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {filteredCompanies.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination 
                        count={Math.ceil(filteredCompanies.length / rowsPerPage)} 
                        page={page} 
                        onChange={handlePageChange} 
                        color="primary" 
                    />
                </Box>
            )}

            {/* View Company Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
            >
                <DialogTitle>Company Details</DialogTitle>
                <DialogContent>
                    {selectedCompany && <SingleCompany open={open} onClose={handleClose} company={selectedCompany} />}
                </DialogContent>
            </Dialog>

            {/* Delete Company Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this company? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteCompany} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Update Company Dialog */}
            <Dialog
                open={updateDialogOpen}
                onClose={() => {
                    setUpdateDialogOpen(false);
                    setEmailExistsError(null);
                }}
            >
                <DialogTitle>Update Company</DialogTitle>
                <DialogContent>
                    {companyToUpdate && (
                        <>
                            <TextField
                                label="Company Name"
                                value={companyToUpdate.name}
                                onChange={(e) => setCompanyToUpdate({ ...companyToUpdate, name: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Email"
                                value={companyToUpdate.email}
                                onChange={(e) => setCompanyToUpdate({ ...companyToUpdate, email: e.target.value })}
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

            {/* Add Company Dialog */}
            <Dialog
                open={addCompanyDialogOpen}
                onClose={() => {
                    setAddCompanyDialogOpen(false);
                    setEmailExistsError(null);
                    setPasswordError(null);
                    setCompanyToAdd({
                        id: 0,
                        name: '',
                        email: '',
                        password: '',
                        coupons: []
                    });
                }}
            >
                <DialogTitle>Add New Company</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Company Name"
                        value={companyToAdd.name}
                        onChange={(e) => setCompanyToAdd({ ...companyToAdd, name: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        value={companyToAdd.email}
                        onChange={(e) => setCompanyToAdd({ ...companyToAdd, email: e.target.value })}
                        fullWidth
                        margin="normal"
                        error={!!emailExistsError}
                        helperText={emailExistsError}
                    />
                    <TextField
                        label="Password"
                        value={companyToAdd.password}
                        onChange={(e) => setCompanyToAdd({ ...companyToAdd, password: e.target.value })}
                        fullWidth
                        margin="normal"
                        type="password"
                        error={!!passwordError}
                        helperText={passwordError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setAddCompanyDialogOpen(false);
                        setEmailExistsError(null);
                        setPasswordError(null);
                        setCompanyToAdd({
                            id: 0,
                            name: '',
                            email: '',
                            password: '',
                            coupons: []
                        });
                    }} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddCompany} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}