import { useState, useEffect } from "react";
import { CouponDetails } from "../../../Model/CouponDetails";
import { store } from "../../../Redux/store";
import { SingleCoupon } from "../../SingleCoupon/SingleCoupon";
import { Grid, Card, CardContent, Typography, Button, MenuItem, Slider, TextField } from "@mui/material";
import "./CustomerMenu.css";
import { checkData } from "../../../Util/checkData";
import axiosJWT from "../../../Util/AxiosJWT";
import { getAvailableCouponsAction, getCustomerCouponsAction, purchaseCouponAction } from "../../../Redux/CustomerReducer";
import { useNavigate } from "react-router-dom";
import { CustomerDetails } from "../../../Model/CustomerDetails";



export function CustomerMenu(): JSX.Element {
    const [coupons, setCoupons] = useState<CouponDetails[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<CouponDetails | null>(null);
    const [customer, setCustomer] = useState<CustomerDetails | null>(null);
    const [open, setOpen] = useState(false);
    const [filteredCoupons, setFilteredCoupons] = useState<CouponDetails[]>([]);
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const navigate = useNavigate();


    
    useEffect(() => {
        const fetchCoupons = async () => {
            checkData();

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

    useEffect(() => {
        filterCoupons();
    }, [category, maxPrice]);

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

    const handlePurchase = async (coupon: CouponDetails) => {
        console.log("Attempting to purchase coupon:", coupon);
        const customerCoupons = store.getState().customer.customer?.coupons
        console.log("Customer Coupons:", customerCoupons);
        const customer = store.getState().customer.customer;
        console.log("Customer:", customer);
    };

    const handleRowClick = (coupon: CouponDetails) => {
        setSelectedCoupon(coupon);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCoupon(null);
    };
    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCategory(event.target.value);
    };
    const handlePriceChange = (event: Event, newValue: number | number[]) => {
        setMaxPrice(newValue as number);
    };

    return (
        <div className="CustomerMenu">
            <Typography variant="h4" className="Welcome">
                Coupons to Purchase
            </Typography>
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
                    onPurchase={() => handlePurchase(selectedCoupon)}
                />
            )}
        </div>
    );
}