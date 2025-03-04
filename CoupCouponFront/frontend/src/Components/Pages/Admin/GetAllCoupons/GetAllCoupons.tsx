import { useEffect, useState } from "react";
import "./GetAllCoupons.css";
import { CouponDetails } from "../../../Model/CouponDetails";
import { useNavigate } from "react-router-dom";
import { 
    Table, TableHead, TableRow, TableCell, TableBody, Button, TableContainer, Paper, 
    DialogTitle, Dialog, DialogContent, Typography, DialogActions, TextField, 
    Pagination, IconButton, InputAdornment, Box, Chip, Tooltip
} from "@mui/material";
import { SingleCoupon } from "../../SingleCoupon/SingleCoupon";
import { store } from "../../../Redux/store";
import axiosJWT from "../../../Util/AxiosJWT";
import { deleteCouponAction, getCouponsAction } from "../../../Redux/AdminReducer";
import { checkData } from "../../../Util/checkData";
import { Search as SearchIcon, Refresh as RefreshIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

/**
 * GetAllCoupons component that displays a list of all coupons and provides functionality to delete coupons.
 * @returns {JSX.Element} The rendered GetAllCoupons component.
 */
export function GetAllCoupons(): JSX.Element {
    const [coupons, setCoupons] = useState<CouponDetails[]>([]);
    const [filteredCoupons, setFilteredCoupons] = useState<CouponDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCoupon, setSelectedCoupon] = useState<CouponDetails | null>(null);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(5);

    const navigate = useNavigate();

    // useEffect hook to fetch coupons when the component mounts
    useEffect(() => {
        const fetchCoupons = async () => {
            setIsLoading(true);
            try {
                const response = await axiosJWT.get("http://localhost:8080/CoupCouponAPI/Admin/GetAllCoupons");
                const coupons = response.data.map((coupon: any) => ({
                    ...coupon,
                    startDate: coupon.startDate,
                    endDate: coupon.endDate,
                }));
                store.dispatch(getCouponsAction(coupons));
                setCoupons(store.getState().admin.coupons);
                setFilteredCoupons(store.getState().admin.coupons);
            } catch (error) {
                console.log("Error fetching coupons:", error);
                checkData();
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        };
        if (store.getState().admin.coupons.length === 0) {
            fetchCoupons();
        } else {
            setCoupons(store.getState().admin.coupons);
            setFilteredCoupons(store.getState().admin.coupons);
        }
    }, [navigate]);

    // Search filter effect
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredCoupons(coupons);
        } else {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = coupons.filter(
                coupon => 
                    coupon.title.toLowerCase().includes(lowercasedSearchTerm) ||
                    coupon.description.toLowerCase().includes(lowercasedSearchTerm) ||
                    coupon.category.toLowerCase().includes(lowercasedSearchTerm)
            );
            setFilteredCoupons(filtered);
        }
        // Reset to first page when filtering
        setPage(1);
    }, [searchTerm, coupons]);

    // Confirm delete coupon action
    const confirmDeleteCoupon = async () => {
        if (couponToDelete !== null) {
            setIsLoading(true);
            try {
                await axiosJWT.delete(`http://localhost:8080/CoupCouponAPI/Admin/DeleteCoupon/${couponToDelete}`);
                
                // Update Redux store and local state
                store.dispatch(deleteCouponAction(couponToDelete));
                const updatedCoupons = coupons.filter(coupon => coupon.id !== couponToDelete);
                setCoupons(updatedCoupons);

                setDeleteDialogOpen(false);
                setCouponToDelete(null);

                console.log("Coupon deleted successfully", couponToDelete);
            } catch (error) {
                console.log("Error deleting coupon:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle delete coupon action
    const handleDeleteCoupon = (couponId: number) => {
        setCouponToDelete(couponId);
        setDeleteDialogOpen(true);
    };

    // Handle row click to view coupon details
    const handleRowClick = (coupon: CouponDetails) => {
        setSelectedCoupon(coupon);
        setOpen(true);
    };

    // Handle close dialog
    const handleClose = () => {
        setOpen(false);
        setSelectedCoupon(null);
    };

    // Refresh coupons data
    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            const response = await axiosJWT.get("http://localhost:8080/CoupCouponAPI/Admin/GetAllCoupons");
            const coupons = response.data.map((coupon: any) => ({
                ...coupon,
                startDate: coupon.startDate,
                endDate: coupon.endDate,
            }));
            store.dispatch(getCouponsAction(coupons));
            setCoupons(coupons);
            setSearchTerm("");
        } catch (error) {
            console.log("Error refreshing coupons:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Get current page items
    const getCurrentPageItems = () => {
        const startIndex = (page - 1) * rowsPerPage;
        return filteredCoupons.slice(startIndex, startIndex + rowsPerPage);
    };

    // Handle page change
    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    // Function to check if a coupon is expired
    const isExpired = (endDate: string) => {
        const today = new Date();
        const expiry = new Date(endDate);
        return today > expiry;
    };

    // Function to format the date in a more readable way
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <div className="GetAllCoupons">
            <h1>Coupon Management</h1>
            
            <div className="table-actions-container">
                <div className="search-filter-container">
                    <TextField
                        placeholder="Search coupons..."
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
            </div>

            <TableContainer component={Paper} className="table-container">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getCurrentPageItems().map((coupon) => (
                            <TableRow key={coupon.id}>
                                <TableCell>{coupon.id}</TableCell>
                                <TableCell>{coupon.title}</TableCell>
                                <TableCell>{coupon.category}</TableCell>
                                <TableCell>{formatDate(coupon.startDate)}</TableCell>
                                <TableCell>{formatDate(coupon.endDate)}</TableCell>
                                <TableCell>{coupon.amount}</TableCell>
                                <TableCell>${coupon.price}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={isExpired(coupon.endDate) ? "Expired" : "Active"} 
                                        color={isExpired(coupon.endDate) ? "error" : "success"}
                                        size="small"
                                        className={isExpired(coupon.endDate) ? "status-inactive" : "status-active"}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <Tooltip title="View details">
                                            <IconButton onClick={() => handleRowClick(coupon)} color="info" size="small">
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete coupon">
                                            <IconButton onClick={() => handleDeleteCoupon(coupon.id)} color="error" size="small">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredCoupons.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    <Typography variant="body1" color="textSecondary">
                                        {searchTerm ? "No coupons found matching your search" : "No coupons found"}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {filteredCoupons.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination 
                        count={Math.ceil(filteredCoupons.length / rowsPerPage)} 
                        page={page} 
                        onChange={handlePageChange} 
                        color="primary" 
                    />
                </Box>
            )}

            {/* View Coupon Dialog */}
            {selectedCoupon && (
                <SingleCoupon 
                    open={open} 
                    onClose={handleClose} 
                    coupon={selectedCoupon} 
                />
            )}

            {/* Delete Coupon Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this coupon? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteCoupon} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}