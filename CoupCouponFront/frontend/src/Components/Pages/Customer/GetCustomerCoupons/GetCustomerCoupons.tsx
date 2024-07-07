import { Grid, TextField, MenuItem, Typography, Slider, Card, CardContent } from "@mui/material";
import "./GetCustomerCoupons.css";
import { useEffect, useState } from "react";
import { CouponDetails } from "../../../Model/CouponDetails";
import { store } from "../../../Redux/store";
import { CustomerDetails } from "../../../Model/CustomerDetails";
import { checkData } from "../../../Util/checkData";
import axiosJWT from "../../../Util/AxiosJWT";
import { getCustomerCouponsAction, getCustomerDetailsAction } from "../../../Redux/CustomerReducer";
import { SingleCoupon } from "../../SingleCoupon/SingleCoupon";
import { useNavigate } from "react-router-dom";

export function GetCustomerCoupons(): JSX.Element {
    const [selectedCoupon, setSelectedCoupon] = useState<CouponDetails | null>(null);
    const [filteredCoupons, setFilteredCoupons] = useState<CouponDetails[]>([]);
    const [category, setCategory] = useState("");
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [open, setOpen] = useState(false);
    const [customerCoupons, setCustomerCoupons] = useState<CouponDetails[]>([]);
    const [customer, setCustomer] = useState<CustomerDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const getCustomer = async () => {
            try {
                const response = await axiosJWT.get("http://localhost:8080/CoupCouponAPI/Customer/GetCustomerDetails");
                store.dispatch(getCustomerDetailsAction(response.data));
                setCustomer(response.data);
                store.dispatch(getCustomerCouponsAction(response.data.coupons));
                setCustomerCoupons(response.data.coupons);
                setFilteredCoupons(response.data.coupons);
                setLoading(false);

            } catch (error) {
                console.log("Error fetching customer details:", error);
                navigate("/login");
                setLoading(false);
            }
        };

        if (store.getState().customer.customer === null || store.getState().customer.customer === undefined) {
            getCustomer();
        } else {
            const customerData = store.getState().customer.customer;
            const customerCouponsData = customerData?.coupons;
            setCustomer(customerData);
            setCustomerCoupons(customerCouponsData || []);
            setFilteredCoupons(customerCouponsData || []); // Ensure filteredCoupons is set correctly
            setLoading(false);
        }


    }, []);

    useEffect(() => {
        if(!loading){
            filterCoupons();
        }
    }, [category, maxPrice,customerCoupons,loading]);

    const filterCoupons = () => {
        let filtered = customerCoupons
        if (category) {
            filtered = filtered?.filter(coupon => coupon.category === category);
        }
        if (maxPrice) {
            filtered = filtered?.filter(coupon => coupon.price <= Number(maxPrice));
        }
        setFilteredCoupons(filtered || []);

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
        <div className="GetCustomerCoupons">
            <h1 className="CouponsTitle">{store.getState().auth.name}'s Coupons</h1>
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
                {filteredCoupons.length > 0 ? (
                    filteredCoupons.map((coupon) => (
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
                    ))
                ) : (
                    <Typography variant="h6" color="textSecondary" style={{ margin: "20px auto" }}>
                        No purchased coupons found
                    </Typography>
                )}
            </Grid>
            {selectedCoupon && (
                <SingleCoupon
                    coupon={selectedCoupon}
                    open={open}
                    onClose={handleClose}
                />
            )}
        </div>
    );
}
