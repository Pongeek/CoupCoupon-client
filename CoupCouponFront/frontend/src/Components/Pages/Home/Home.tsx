import { useEffect, useState } from "react";
import "./Home.css";
import { CouponDetails } from "../../Model/CouponDetails";
import { Typography, Container, Grid, Card, CardMedia, CardContent, CardActions, Button, FormControl, InputLabel, Select, MenuItem, TextField, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { SingleCoupon } from "../SingleCoupon/SingleCoupon";
import { useNavigate } from "react-router-dom";

// Define the Category enum directly in this file to fix the import error
enum Category {
    FOOD = "FOOD",
    SPA = "SPA",
    RESTAURANT = "RESTAURANT",
    VACATION = "VACATION",
    CONCERTS = "CONCERTS",
    ELECTRICITY = "ELECTRICITY"
}

export function Home(): JSX.Element {
    const [coupons, setCoupons] = useState<CouponDetails[]>([]);
    const [filteredCoupons, setFilteredCoupons] = useState<CouponDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedCoupon, setSelectedCoupon] = useState<CouponDetails | null>(null);
    const [open, setOpen] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all coupons
        const fetchCoupons = async () => {
            try {
                // Use the new public endpoint that doesn't require authentication
                const response = await axios.get("http://localhost:8080/CoupCouponAPI/Public/GetAllCoupons");
                
                const fetchedCoupons = response.data.map((coupon: any) => ({
                    ...coupon,
                    startDate: coupon.startDate,
                    endDate: coupon.endDate,
                }));
                
                setCoupons(fetchedCoupons);
                setFilteredCoupons(fetchedCoupons);
                setLoading(false);
            } catch (error) {
                console.log("Error fetching coupons:", error);
                setError("Failed to load coupons. Please try again later.");
                setLoading(false);
            }
        };
        
        fetchCoupons();
    }, []);

    useEffect(() => {
        // Apply filters whenever they change
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

    const handleViewCoupon = (coupon: CouponDetails) => {
        setSelectedCoupon(coupon);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCoupon(null);
    };

    const handlePurchase = () => {
        navigate("/login");
    };

    return (
        <div className="Home">
            <Container maxWidth="lg">
                <Typography variant="h3" component="h1" className="page-title" gutterBottom>
                    Explore Amazing Deals
                </Typography>
                <Typography variant="subtitle1" gutterBottom className="sub-heading">
                    Discover the best coupons and save big on your favorite products and services!
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
                                                <Typography variant="h6" color="primary">
                                                    ${coupon.price}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                        <CardActions>
                                            <Button 
                                                size="small" 
                                                color="primary" 
                                                onClick={() => handleViewCoupon(coupon)}
                                            >
                                                View Details
                                            </Button>
                                            <Button 
                                                size="small" 
                                                variant="contained" 
                                                color="primary"
                                                onClick={handlePurchase}
                                            >
                                                Buy Now
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}
                
                {selectedCoupon && (
                    <SingleCoupon 
                        open={open} 
                        onClose={handleClose} 
                        coupon={selectedCoupon} 
                        onPurchase={handlePurchase}
                    />
                )}
            </Container>
        </div>
    );
}
