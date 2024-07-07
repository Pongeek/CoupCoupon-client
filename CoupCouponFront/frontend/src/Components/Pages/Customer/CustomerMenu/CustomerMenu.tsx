import { useState, useEffect } from "react";
import { CouponDetails } from "../../../Model/CouponDetails";
import { store } from "../../../Redux/store";
import { SingleCoupon } from "../../SingleCoupon/SingleCoupon";
import { Grid, Card, CardContent, Typography, Button, MenuItem, Slider, TextField, DialogTitle, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import "./CustomerMenu.css";
import { checkData } from "../../../Util/checkData";
import axiosJWT from "../../../Util/AxiosJWT";
import { getAvailableCouponsAction, getCustomerCouponsAction, getCustomerDetailsAction, purchaseCouponAction } from "../../../Redux/CustomerReducer";
import { useNavigate } from "react-router-dom";
import { CustomerDetails } from "../../../Model/CustomerDetails";

/**
 * CustomerMenu component that displays a list of all available coupons for customers and provides functionality to filter, view, and purchase coupons.
 * @returns {JSX.Element} The rendered CustomerMenu component.
 */
export function CustomerMenu(): JSX.Element {
    const [coupons, setCoupons] = useState<CouponDetails[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<CouponDetails | null>(null);
    const [customer, setCustomer] = useState<CustomerDetails | null>(null);
    const [open, setOpen] = useState(false);
    const [filteredCoupons, setFilteredCoupons] = useState<CouponDetails[]>([]);
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [thankYouOpen, setThankYouOpen] = useState(false);
    const navigate = useNavigate();

    // useEffect hook to fetch customer details and available coupons when the component mounts
    useEffect(() => {
        const fetchCoupons = async () => {
            checkData();
            if (store.getState().customer.customer == null) {
                try {
                    const response = await axiosJWT.get("http://localhost:8080/CoupCouponAPI/Customer/GetCustomerDetails");
                    const customer = response.data;
                    store.dispatch(getCustomerDetailsAction(customer));
                    setCustomer(customer);
                    store.dispatch(getCustomerCouponsAction(customer.coupons));
                } catch (error) {
                    console.log("Error fetching customer details:", error);
                }
            }

            try {
                const response = await axiosJWT.get("http://localhost:8080/CoupCouponAPI/Customer/getAllAvailableCoupons");
                const coupons = response.data.map((coupon: CouponDetails) => ({
                    ...coupon,
                    startDate: coupon.startDate,
                    endDate: coupon.endDate,
                }));

                store.dispatch(getAvailableCouponsAction(coupons));
                setCoupons(coupons);
                setLoading(false);
            } catch (error) {
                console.log("Error fetching coupons:", error);
                setLoading(false);
            }
        };
        if (coupons.length === 0) {
            fetchCoupons();
        } else {
            setFilteredCoupons(coupons);
            setLoading(false);
        }
    }, [coupons]);

    // useEffect hook to filter coupons based on category and max price
    useEffect(() => {
        filterCoupons();
    }, [category, maxPrice]);

    // Function to filter coupons based on selected category and max price
    const filterCoupons = () => {
        let filtered = coupons;
        if (category) {
            filtered = filtered.filter(coupon => coupon.category === category);
        }
        if (maxPrice) {
            filtered = filtered.filter(coupon => coupon.price <= Number(maxPrice));
        }
        setFilteredCoupons(filtered);
    };

    // Function to handle coupon purchase
    const handlePurchase = async (coupon: CouponDetails) => {
        const customerCoupons = store.getState().customer.customer?.coupons;
        if (customerCoupons?.some(c => c.id === coupon.id)) {
            console.log("Customer already has this coupon");
            alert("Customer already purchased this coupon");
            return;
        }

        try {
            const response = await axiosJWT.post(`http://localhost:8080/CoupCouponAPI/Customer/PurchaseCoupon/${coupon.id}`);
            console.log("Coupon purchased successfully", coupon.title);
            store.dispatch(purchaseCouponAction(coupon.id));
            customerCoupons?.push(coupon);
            setOpen(false);
            setThankYouOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.log("Error purchasing coupon:", error);
        };
    }

    // Function to handle confirmation of coupon purchase
    const handleConfirmPurchase = () => {
        if (selectedCoupon) {
            handlePurchase(selectedCoupon);
        }
        setConfirmOpen(false); // Close confirmation dialog
    };

    // Function to handle purchase button click
    const handlePurchaseClick = () => {
        setConfirmOpen(true); // Open confirmation dialog
    };

    // Function to handle row click to view coupon details
    const handleRowClick = (coupon: CouponDetails) => {
        setSelectedCoupon(coupon);
        setOpen(true);
    };

    // Function to handle close dialog
    const handleClose = () => {
        setOpen(false);
        setSelectedCoupon(null);
    };

    // Function to handle category change
    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCategory(event.target.value);
    };

    // Function to handle price change
    const handlePriceChange = (event: Event, newValue: number | number[]) => {
        setMaxPrice(newValue as number);
    };

    return (
        <div className="CustomerMenu">
            <h1 className="CouponsToPurchase">Coupons to purchase</h1>
            <Grid container spacing={3} className="Filters">
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        select
                        label="Category"
                        value={category}
                        onChange={handleCategoryChange}
                        fullWidth
                        variant="outlined"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="FOOD">Food</MenuItem>
                        <MenuItem value="ELECTRICITY">Electronics</MenuItem>
                        <MenuItem value="SPA">Spa</MenuItem>
                        <MenuItem value="VACATION">Vacation</MenuItem>
                        <MenuItem value="CONCERT">Concert</MenuItem>
                        <MenuItem value="RESTAURANT">Restaurant</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Typography gutterBottom>Max Price: ${maxPrice}</Typography>
                    <Slider
                        value={maxPrice}
                        onChange={handlePriceChange}
                        aria-labelledby="max-price-slider"
                        valueLabelDisplay="auto"
                        min={0}
                        max={1000}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {filteredCoupons.map((coupon) => (
                    <Grid item xs={12} sm={6} md={4} key={coupon.id}>
                        <Card className="CouponItem" onClick={() => handleRowClick(coupon)}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {coupon.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {coupon.description}
                                </Typography>
                                <Typography variant="h6" color="textPrimary">
                                    Price: ${coupon.price}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {selectedCoupon && (
                <SingleCoupon
                    coupon={selectedCoupon}
                    open={open}
                    onClose={handleClose}
                    onPurchase={handlePurchaseClick} // Updated
                />
            )}
            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
            >
                <DialogTitle>Confirm Purchase</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to purchase this coupon?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmPurchase} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={thankYouOpen} onClose={() => setThankYouOpen(false)}>
                <DialogTitle>Thank You</DialogTitle>
                <DialogContent>Thank you for purchasing this coupon!</DialogContent>
                <DialogActions>
                    <Button onClick={() => setThankYouOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}