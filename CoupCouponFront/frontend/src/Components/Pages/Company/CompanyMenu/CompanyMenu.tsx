import "./CompanyMenu.css";
import { 
    TableContainer, 
    Paper, 
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody, 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    Typography, 
    DialogActions, 
    TextField, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Select, 
    Grid, 
    SelectChangeEvent,
    IconButton,
    Chip,
    Box,
    Tooltip,
    Divider,
    CircularProgress,
    Pagination
} from "@mui/material";
import { store } from "../../../Redux/store";
import { SingleCoupon } from "../../SingleCoupon/SingleCoupon";
import { useEffect, useState } from "react";
import { CouponDetails } from "../../../Model/CouponDetails";
import { useNavigate } from "react-router-dom";
import axiosJWT from "../../../Util/AxiosJWT";
import { addCouponAction, deleteCouponAction, getCompanyCouponsAction, updateCouponAction } from "../../../Redux/CompanyReducer";
import { checkData } from "../../../Util/checkData";
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';

/**
 * Enum for coupon categories.
 */
enum CouponCategory {
    FOOD = "FOOD",
    ELECTRONICS = "ELECTRICITY",
    SPA = "SPA",
    VACATION = "VACATION",
    CONCERTS = "CONCERTS",
    RESTAURANT = "RESTAURANT"
}

/**
 * CompanyMenu component that displays a list of all company coupons and provides functionality to add, update, and delete coupons.
 * @returns {JSX.Element} The rendered CompanyMenu component.
 */
export function CompanyMenu(): JSX.Element {
    const [coupon, setCoupon] = useState<CouponDetails[]>([]);
    const [filteredCoupons, setFilteredCoupons] = useState<CouponDetails[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<CouponDetails | null>(null);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState<number | null>(null);
    const [couponToDeleteName, setCouponToDeleteName] = useState<string>("");
    const navigate = useNavigate();
    const [couponToUpdate, setCouponToUpdate] = useState<CouponDetails | null>(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [titleExistsError, setTitleExistsError] = useState<string | null>(null);
    const [addCouponDialogOpen, setAddCouponDialogOpen] = useState(false);
    const [priceError, setPriceError] = useState<string | null>(null);
    const [amountError, setAmountError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<number>(0);
    const [today, setToday] = useState<string>(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [rowsPerPage] = useState<number>(10);
    const [newCoupon, setNewCoupon] = useState<CouponDetails>({
        id: 0,
        companyID: store.getState().auth.id,
        category: "",
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        amount: 0,
        price: 0,
        image: ":)",
    });

    // useEffect hook to fetch coupons when the component mounts
    useEffect(() => {
        checkData();
        fetchCoupons();
    }, []);

    // Async function to fetch coupons from the API
    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const response = await axiosJWT.get("http://localhost:8080/CoupCouponAPI/Company/GetAllCompanyCoupons");
            const coupons = response.data.map((coupon: CouponDetails) => ({
                ...coupon,
                startDate: coupon.startDate,
                endDate: coupon.endDate,
            }));
            
            // Dispatch action to replace coupons in Redux store
            store.dispatch(getCompanyCouponsAction(coupons));
            
            // Use the coupons from the response directly
            setCoupon(coupons);
            setFilteredCoupons(coupons);
            setLoading(false);
        }
        catch (error) {
            console.log("Error fetching coupons:", error);
            checkData();
            navigate("/login");
            setLoading(false);
        }
    };
    
    // Effect for filtering coupons based on search term, category, and max price
    useEffect(() => {
        let result = [...coupon];
        
        // Filter by search term
        if (searchTerm.trim() !== "") {
            result = result.filter(c => 
                c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Filter by category
        if (selectedCategory !== "") {
            result = result.filter(c => c.category === selectedCategory);
        }
        
        // Filter by max price
        if (maxPrice > 0) {
            result = result.filter(c => c.price <= maxPrice);
        }
        
        setFilteredCoupons(result);
        setPage(1); // Reset to first page when filters change
    }, [searchTerm, selectedCategory, maxPrice, coupon]);

    // Function to handle coupon selection and open the dialog
    const handleOpen = (coupon: CouponDetails) => {
        setSelectedCoupon(coupon);
        setOpen(true);
    };

    // Function to handle dialog close
    const handleClose = () => {
        setOpen(false);
    };

    // Function to handle the delete confirmation dialog
    const handleDeleteConfirmation = (id: number, title: string) => {
        setCouponToDelete(id);
        setCouponToDeleteName(title);
        setDeleteDialogOpen(true);
    };

    // Function to delete a coupon
    const handleDelete = async () => {
        if (couponToDelete === null) return;

        try {
            await axiosJWT.delete(`http://localhost:8080/CoupCouponAPI/Company/DeleteCoupon/${couponToDelete}`);
            store.dispatch(deleteCouponAction(couponToDelete));
            setCoupon(store.getState().company.coupons);
            setDeleteDialogOpen(false);
            setCouponToDelete(null);
        } catch (error) {
            console.log("Error deleting coupon:", error);
            checkData();
        }
    };

    // Function to check if a coupon is expired
    const isExpired = (endDate: string): boolean => {
        const today = new Date();
        const expiry = new Date(endDate);
        return today > expiry;
    };

    // Handle update coupon action
    const handleUpdate = async () => {
        if (couponToUpdate === null) return;

        // Validate that title is unique
        const companyCouponList: CouponDetails[] = store.getState().company.coupons;
        const titleExists = companyCouponList.some(c => 
            c.title === couponToUpdate.title && c.id !== couponToUpdate.id
        );
        
        if (titleExists) {
            setTitleExistsError("Title already exists");
            return;
        } else {
            setTitleExistsError(null);
        }

        // Validate dates
        const currentDate = new Date().toISOString().split('T')[0];
        if (couponToUpdate.startDate < currentDate) {
            alert("Start date cannot be before today");
            return;
        }
        
        if (couponToUpdate.endDate < couponToUpdate.startDate) {
            alert("End date cannot be before start date");
            return;
        }

        // Validate required fields
        if (!couponToUpdate.startDate || !couponToUpdate.endDate || !couponToUpdate.category || !couponToUpdate.title) {
            alert("All fields are required");
            return;
        }

        try {
            setLoading(true);
            await axiosJWT.put(`http://localhost:8080/CoupCouponAPI/Company/UpdateCoupon/${couponToUpdate.id}`, couponToUpdate);
            
            store.dispatch(updateCouponAction(couponToUpdate, couponToUpdate.id));
            const updatedCoupon = coupon.map(c => c.id === couponToUpdate.id ? couponToUpdate : c);
            setCoupon(updatedCoupon);
            setFilteredCoupons(prev => prev.map(c => c.id === couponToUpdate.id ? couponToUpdate : c));
            
            setUpdateDialogOpen(false);
            setCouponToUpdate(null);
            setLoading(false);
        } catch (error) {
            console.log("Error updating coupon:", error);
            checkData();
            setLoading(false);
        }
    };

    // Handle add coupon submit
    const handleAddCouponSubmit = async () => {
        // Validate that title is unique
        const companyCouponList: CouponDetails[] = store.getState().company.coupons;
        const titleExists = companyCouponList.some(c => c.title === newCoupon.title);
        
        if (titleExists) {
            setTitleExistsError("Title already exists");
            return;
        } else {
            setTitleExistsError(null);
        }
        
        // Validate dates
        const currentDate = new Date().toISOString().split('T')[0];
        if (newCoupon.startDate < currentDate) {
            alert("Start date cannot be before today");
            return;
        }
        
        if (newCoupon.endDate < newCoupon.startDate) {
            alert("End date cannot be before start date");
            return;
        }

        // Validate price
        if (newCoupon.price < 1) {
            setPriceError("Price must be at least 1");
            return;
        } else {
            setPriceError(null);
        }
        
        // Validate amount
        if (newCoupon.amount < 10) {
            setAmountError("Amount must be at least 10");
            return;
        } else {
            setAmountError(null);
        }

        // Validate required fields
        if (!newCoupon.startDate || !newCoupon.endDate || !newCoupon.category || !newCoupon.title) {
            alert("All fields are required");
            return;
        }

        try {
            setLoading(true);
            const response = await axiosJWT.post("http://localhost:8080/CoupCouponAPI/Company/AddCoupon", newCoupon);
            
            // Create a new coupon with the ID from the response
            const createdCoupon = {
                ...newCoupon,
                id: response.data.id || newCoupon.id
            };
            
            store.dispatch(addCouponAction(createdCoupon));
            const updatedCoupons = [...coupon, createdCoupon];
            setCoupon(updatedCoupons);
            setFilteredCoupons([...filteredCoupons, createdCoupon]);
            
            setAddCouponDialogOpen(false);
            
            // Reset form
            setNewCoupon({
                id: 0,
                companyID: store.getState().auth.id,
                category: "",
                title: "",
                description: "",
                startDate: "",
                endDate: "",
                amount: 0,
                price: 0,
                image: ":)",
            });
            
            setLoading(false);
        } catch (error) {
            console.log("Error adding coupon:", error);
            checkData();
            setLoading(false);
        }
    };

    // Calculate the slice of coupons to display based on pagination
    const paginatedCoupons = filteredCoupons.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    // Handle page change
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <div className="CompanyMenu">
            <div className="company-header">
                <Typography variant="h4" className="page-title">
                    Company Dashboard
                </Typography>
                <Typography variant="h6" className="welcome-subtitle">
                    Welcome, {store.getState().auth.name}
                </Typography>
                <Typography variant="body1" className="sub-heading">
                    Manage your coupons and monitor their performance
                </Typography>
            </div>

            <div className="filters-container">
                <div className="top-actions">
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            className="action-button add-button"
                            onClick={() => setAddCouponDialogOpen(true)}
                            startIcon={<AddIcon />}
                        >
                            Add New Coupon
                        </Button>
                    </div>
                    
                    <Tooltip title="Refresh Coupons">
                        <IconButton onClick={fetchCoupons} color="primary" size="large" style={{ position: 'absolute', right: '40px' }}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                
                <div className="filter-actions">
                    <TextField
                        label="Search Coupons"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            endAdornment: <SearchIcon />
                        }}
                    />
                    
                    <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={selectedCategory}
                            onChange={(e: SelectChangeEvent) => setSelectedCategory(e.target.value)}
                            label="Category"
                        >
                            <MenuItem value="">
                                <em>All Categories</em>
                            </MenuItem>
                            {Object.values(CouponCategory).map((category) => (
                                <MenuItem key={category} value={category}>{category}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    <TextField
                        label="Max Price"
                        type="number"
                        variant="outlined"
                        size="small"
                        value={maxPrice === 0 ? "" : maxPrice}
                        onChange={(e) => setMaxPrice(parseFloat(e.target.value) || 0)}
                        inputProps={{ min: 0 }}
                    />
                </div>
            </div>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress />
                </Box>
            ) : filteredCoupons.length === 0 ? (
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    justifyContent="center" 
                    p={3}
                    bgcolor="#f8f9fa"
                    borderRadius={2}
                >
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        No coupons found
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="center">
                        {searchTerm || selectedCategory || maxPrice > 0 
                            ? "Try adjusting your filters" 
                            : "Click 'Add New Coupon' to create your first coupon"}
                    </Typography>
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper} className="coupon-table">
                        <Table>
                            <TableHead className="table-header">
                                <TableRow>
                                    <TableCell className="table-header-cell">ID</TableCell>
                                    <TableCell className="table-header-cell">Title</TableCell>
                                    <TableCell className="table-header-cell">Category</TableCell>
                                    <TableCell className="table-header-cell">Start Date</TableCell>
                                    <TableCell className="table-header-cell">End Date</TableCell>
                                    <TableCell className="table-header-cell">Amount</TableCell>
                                    <TableCell className="table-header-cell">Price</TableCell>
                                    <TableCell className="table-header-cell">Status</TableCell>
                                    <TableCell className="table-header-cell">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedCoupons.map((c) => (
                                    <TableRow key={c.id} className="coupon-row">
                                        <TableCell className="table-cell">{c.id}</TableCell>
                                        <TableCell className="table-cell">{c.title}</TableCell>
                                        <TableCell className="table-cell">
                                            <Chip 
                                                label={c.category} 
                                                size="small" 
                                                style={{ 
                                                    backgroundColor: 'rgba(52, 152, 219, 0.1)', 
                                                    color: '#3498db' 
                                                }} 
                                            />
                                        </TableCell>
                                        <TableCell className="table-cell">
                                            {new Date(c.startDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="table-cell">
                                            {new Date(c.endDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="table-cell">{c.amount}</TableCell>
                                        <TableCell className="table-cell">${c.price.toFixed(2)}</TableCell>
                                        <TableCell className="table-cell">
                                            <span className={isExpired(c.endDate) ? "status-expired" : "status-active"}>
                                                {isExpired(c.endDate) ? "Expired" : "Active"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="table-cell">
                                            <div className="action-buttons-container">
                                                <Tooltip title="View Details">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleOpen(c)}
                                                        className="view-button"
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit Coupon">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => {
                                                            setCouponToUpdate(c);
                                                            setUpdateDialogOpen(true);
                                                        }}
                                                        className="update-button"
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Coupon">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleDeleteConfirmation(c.id, c.title)}
                                                        className="delete-button"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    <div className="pagination-container">
                        <Pagination 
                            count={Math.ceil(filteredCoupons.length / rowsPerPage)} 
                            page={page} 
                            onChange={handlePageChange} 
                            color="primary" 
                        />
                    </div>
                </>
            )}

            {selectedCoupon && (
                <SingleCoupon
                    coupon={selectedCoupon}
                    open={open}
                    onClose={handleClose}
                />
            )}

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to delete the coupon "{couponToDeleteName}"?
                    </Typography>
                    <Typography variant="body2" color="error" style={{ marginTop: '10px' }}>
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
                <DialogTitle>Update Coupon</DialogTitle>
                <DialogContent>
                    {couponToUpdate && (
                        <>
                            <TextField
                                label="Title"
                                value={couponToUpdate.title}
                                onChange={(e) => setCouponToUpdate({ ...couponToUpdate, title: e.target.value })}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                error={!!titleExistsError}
                                helperText={titleExistsError}
                            />
                            <TextField
                                select
                                label="Category"
                                value={couponToUpdate.category}
                                onChange={(e) => setCouponToUpdate({ ...couponToUpdate, category: e.target.value })}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            >
                                {Object.values(CouponCategory).map((category) => (
                                    <MenuItem key={category} value={category}>{category}</MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Description"
                                value={couponToUpdate.description}
                                onChange={(e) => setCouponToUpdate({ ...couponToUpdate, description: e.target.value })}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                type="date"
                                label="Start Date"
                                value={couponToUpdate.startDate}
                                onChange={(e) => setCouponToUpdate({ ...couponToUpdate, startDate: e.target.value.split('T')[0] })}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                            />
                            <TextField
                                type="date"
                                label="End Date"
                                value={couponToUpdate.endDate}
                                onChange={(e) => setCouponToUpdate({ ...couponToUpdate, endDate: e.target.value.split('T')[0] })}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: couponToUpdate.startDate }}
                            />
                            <TextField
                                type="number"
                                label="Price"
                                value={couponToUpdate.price}
                                onChange={(e) => setCouponToUpdate({ ...couponToUpdate, price: parseFloat(e.target.value) })}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                type="number"
                                label="Amount"
                                value={couponToUpdate.amount}
                                onChange={(e) => setCouponToUpdate({ ...couponToUpdate, amount: parseInt(e.target.value) })}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} color="primary">Update</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={addCouponDialogOpen} onClose={() => setAddCouponDialogOpen(false)}>
                <DialogTitle>Add Coupon</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        label="Category"
                        value={newCoupon.category}
                        onChange={(e) => setNewCoupon({ ...newCoupon, category: e.target.value })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    >
                        {Object.values(CouponCategory).map((category) => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Title"
                        value={newCoupon.title}
                        onChange={(e) => setNewCoupon({ ...newCoupon, title: e.target.value })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        label="Description"
                        value={newCoupon.description}
                        onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        type="date"
                        label="Start Date"
                        value={newCoupon.startDate}
                        onChange={(e) => setNewCoupon({ ...newCoupon, startDate: e.target.value.split('T')[0] })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: new Date().toISOString().split('T')[0] }}
                    />
                    <TextField
                        type="date"
                        label="End Date"
                        value={newCoupon.endDate}
                        onChange={(e) => setNewCoupon({ ...newCoupon, endDate: e.target.value.split('T')[0] })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: newCoupon.startDate }}
                    />
                    <TextField
                        type="number"
                        label="Amount"
                        value={newCoupon.amount}
                        onChange={(e) => setNewCoupon({ ...newCoupon, amount: parseInt(e.target.value) })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        error={!!amountError}
                        helperText={amountError}
                    />
                    <TextField
                        type="number"
                        label="Price"
                        value={newCoupon.price}
                        onChange={(e) => setNewCoupon({ ...newCoupon, price: parseFloat(e.target.value) })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        error={!!priceError}
                        helperText={priceError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddCouponDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddCouponSubmit} color="primary">Add</Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}



