import { useState, useEffect } from "react";
import { CouponDetails } from "../../../Model/CouponDetails";
import { store } from "../../../Redux/store";
import { SingleCoupon } from "../../SingleCoupon/SingleCoupon";
import { Grid, Card, CardContent, Typography, Button, MenuItem, TextField, DialogTitle, Dialog, DialogActions, DialogContent, DialogContentText, Container, Box, CardMedia, CardActions, FormControl, InputLabel, Select, CircularProgress } from "@mui/material";
import "./CustomerMenu.css";
import { checkData } from "../../../Util/checkData";
import axiosJWT from "../../../Util/AxiosJWT";
import { getAvailableCouponsAction, getCustomerCouponsAction, getCustomerDetailsAction, purchaseCouponAction } from "../../../Redux/CustomerReducer";
import { useNavigate } from "react-router-dom";
import { CustomerDetails } from "../../../Model/CustomerDetails";

// Define Category enum directly for consistent usage
enum Category {
    FOOD = "FOOD",
    SPA = "SPA",
    RESTAURANT = "RESTAURANT",
    VACATION = "VACATION",
    CONCERTS = "CONCERTS",
    ELECTRICITY = "ELECTRICITY"
}

/**
 * CustomerMenu component that displays a list of all available coupons for customers in an e-commerce style format.
 * Provides functionality to filter, view, and purchase coupons.
 * @returns {JSX.Element} The rendered CustomerMenu component.
 */
export function CustomerMenu(): JSX.Element {
    const [coupons, setCoupons] = useState<CouponDetails[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<CouponDetails | null>(null);
    const [customer, setCustomer] = useState<CustomerDetails | null>(null);
    const [open, setOpen] = useState(false);
    const [filteredCoupons, setFilteredCoupons] = useState<CouponDetails[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [thankYouOpen, setThankYouOpen] = useState(false);
    
    const navigate = useNavigate();

    // Fetch customer details and available coupons when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            checkData();
            // Get customer details if not already in store
            if (store.getState().customer.customer == null) {
                try {
                    const response = await axiosJWT.get("http://localhost:8080/CoupCouponAPI/Customer/GetCustomerDetails");
                    const customer = response.data;
                    store.dispatch(getCustomerDetailsAction(customer));
                    setCustomer(customer);
                    store.dispatch(getCustomerCouponsAction(customer.coupons));
                } catch (error) {
                    console.log("Error fetching customer details:", error);
                    setError("Failed to load customer details. Please try again later.");
                }
            } else {
                setCustomer(store.getState().customer.customer);
            }

            // Get available coupons
            try {
                const response = await axiosJWT.get("http://localhost:8080/CoupCouponAPI/Customer/getAllAvailableCoupons");
                const fetchedCoupons = response.data.map((coupon: any) => ({
                    ...coupon,
                    startDate: coupon.startDate,
                    endDate: coupon.endDate,
                }));

                store.dispatch(getAvailableCouponsAction(fetchedCoupons));
                setCoupons(fetchedCoupons);
                setFilteredCoupons(fetchedCoupons);
                setLoading(false);
            } catch (error) {
                console.log("Error fetching coupons:", error);
                setError("Failed to load available coupons. Please try again later.");
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // Apply filters whenever they change
    useEffect(() => {
        let result = [...coupons];
        
        // Filter by category
        if (selectedCategory !== "ALL") {
            result = result.filter(coupon => coupon.category === selectedCategory);
        }
        
        // Filter by max price
        if (maxPrice !== "") {
            const price = parseFloat(maxPrice);
            if (!isNaN(price)) {
                result = result.filter(coupon => coupon.price <= price);
            }
        }
        
        // Filter by search term
        if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            result = result.filter(coupon => 
                coupon.title.toLowerCase().includes(term) || 
                coupon.description.toLowerCase().includes(term)
            );
        }
        
        setFilteredCoupons(result);
    }, [coupons, selectedCategory, maxPrice, searchTerm]);

    // Handle coupon purchase
    const handlePurchase = async (coupon: CouponDetails) => {
        const customerCoupons = store.getState().customer.customer?.coupons;
        
        // Check if customer already has this coupon
        if (customerCoupons?.some(c => c.id === coupon.id)) {
            alert("You've already purchased this coupon");
            return;
        }

        try {
            await axiosJWT.post(`http://localhost:8080/CoupCouponAPI/Customer/PurchaseCoupon/${coupon.id}`);
            console.log("Coupon purchased successfully", coupon.title);
            store.dispatch(purchaseCouponAction(coupon.id));
            customerCoupons?.push(coupon);
            setOpen(false);
            setThankYouOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.log("Error purchasing coupon:", error);
            alert("Failed to purchase coupon. Please try again.");
        };
    }

    // Handle confirmation of coupon purchase
    const handleConfirmPurchase = () => {
        if (selectedCoupon) {
            handlePurchase(selectedCoupon);
        }
        setConfirmOpen(false);
    };

    // Handle purchase button click - open confirmation dialog
    const handlePurchaseClick = () => {
        setConfirmOpen(true);
    };

    // Handle click to view coupon details
    const handleViewCoupon = (coupon: CouponDetails) => {
        setSelectedCoupon(coupon);
        setOpen(true);
    };

    // Handle close dialog
    const handleClose = () => {
        setOpen(false);
        setSelectedCoupon(null);
    };

    // Get customer name from auth state or customer object
    const getCustomerName = () => {
        if (customer && customer.firstName) {
            return customer.firstName;
        }
        // Fallback to auth if customer details aren't loaded yet
        const auth = store.getState().auth;
        return auth.name || "Customer";
    };

    return (
        <div className="CustomerMenu">
            <Container maxWidth="lg">
                <Typography variant="h3" component="h1" className="page-title" gutterBottom>
                    Hello {getCustomerName()},
                </Typography>
                <Typography variant="h4" component="h2" className="welcome-subtitle" gutterBottom>
                    Explore & Purchase Coupons
                </Typography>
                <Typography variant="subtitle1" gutterBottom className="sub-heading">
                    Browse our selection of exclusive deals just for you!
                </Typography>
                
                {/* Filters */}
                <Box className="filters-container" mb={3}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4} md={3}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value as string)}
                                    label="Category"
                                >
                                    <MenuItem value="ALL">All Categories</MenuItem>
                                    {Object.values(Category).map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4} md={3}>
                            <TextField
                                fullWidth
                                label="Max Price"
                                variant="outlined"
                                size="small"
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={6}>
                            <TextField
                                fullWidth
                                label="Search coupons"
                                variant="outlined"
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by title or description"
                            />
                        </Grid>
                    </Grid>
                </Box>
                
                {/* Coupons display */}
                {loading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center">{error}</Typography>
                ) : (
                    <>
                        <Typography variant="subtitle1" gutterBottom>
                            {filteredCoupons.length} coupons found
                        </Typography>
                        
                        <Grid container spacing={3}>
                            {filteredCoupons.map((coupon) => (
                                <Grid item key={coupon.id} xs={12} sm={6} md={4} lg={3}>
                                    <Card className="coupon-card">
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={coupon.image || "https://via.placeholder.com/300x140?text=Coupon"}
                                            alt={coupon.title}
                                        />
                                        <div className="coupon-category">{coupon.category}</div>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="h2" className="coupon-title" noWrap>
                                                {coupon.title}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" component="p" className="coupon-description">
                                                {coupon.description.length > 100 
                                                    ? `${coupon.description.substring(0, 100)}...` 
                                                    : coupon.description}
                                            </Typography>
                                            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="caption" color="textSecondary">
                                                    Valid until: {new Date(coupon.endDate).toLocaleDateString()}
                                                </Typography>
                                                <Typography variant="h6" className="coupon-price">
                                                    ${coupon.price}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                        <CardActions>
                                            <Button 
                                                size="small" 
                                                color="primary" 
                                                className="view-button"
                                                onClick={() => handleViewCoupon(coupon)}
                                                variant="outlined"
                                            >
                                                View Details
                                            </Button>
                                            <Button 
                                                size="small" 
                                                variant="contained" 
                                                color="primary"
                                                className="purchase-button"
                                                onClick={() => {
                                                    setSelectedCoupon(coupon);
                                                    handlePurchaseClick();
                                                }}
                                            >
                                                Purchase
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}
                
                {/* Coupon details modal */}
                {selectedCoupon && (
                    <SingleCoupon 
                        open={open} 
                        onClose={handleClose} 
                        coupon={selectedCoupon} 
                        onPurchase={handlePurchaseClick}
                    />
                )}
                
                {/* Purchase confirmation dialog */}
                <Dialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                >
                    <DialogTitle>Confirm Purchase</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to purchase this coupon for ${selectedCoupon?.price}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmPurchase} color="primary" variant="contained">
                            Confirm Purchase
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Thank you dialog */}
                <Dialog open={thankYouOpen} onClose={() => setThankYouOpen(false)}>
                    <DialogTitle>Thank You!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Thank you for your purchase! Your coupon has been added to your account.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions> 
                        <Button onClick={() => setThankYouOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </div>
    );
}