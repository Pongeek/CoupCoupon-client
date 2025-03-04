import { Dialog, DialogTitle, DialogContent, Typography, Button, DialogActions, Chip, Divider, Box, Grid } from "@mui/material";
import { CouponDetails } from "../../Model/CouponDetails";
import "./SingleCoupon.css";
import { CalendarMonth, LocalOffer, Info, ShoppingCart, Event, EventAvailable } from '@mui/icons-material';

interface couponProps {
    coupon: CouponDetails;
    open: boolean;
    onClose: () => void;
    onPurchase?: () => void;
}

export function SingleCoupon({ coupon, open, onClose, onPurchase }: couponProps): JSX.Element {
    // Function to check if coupon is expired
    const isExpired = (endDate: string) => {
        const today = new Date();
        const expiry = new Date(endDate);
        return today > expiry;
    };

    // Function to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    // Calculate days remaining until expiration or days since expiration
    const getDaysRemaining = (endDate: string) => {
        const today = new Date();
        const expiry = new Date(endDate);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
            return `${diffDays} days remaining`;
        } else if (diffDays === 0) {
            return "Expires today";
        } else {
            return `Expired ${Math.abs(diffDays)} days ago`;
        }
    };

    return (
        <div className="SingleCoupon">
            <Dialog 
                open={open} 
                onClose={onClose} 
                fullWidth 
                maxWidth="sm"
                className="coupon-dialog"
            >
                <DialogTitle className="coupon-dialog-title">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5">Coupon Details</Typography>
                        <Chip 
                            label={isExpired(coupon.endDate) ? "Expired" : "Active"} 
                            color={isExpired(coupon.endDate) ? "error" : "success"}
                            size="small"
                            className={isExpired(coupon.endDate) ? "status-expired" : "status-active"}
                        />
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <div className="CouponContainer">
                        <div className="coupon-header">
                            <Typography className="CouponTitle" variant="h4">{coupon.title}</Typography>
                            <Chip 
                                label={coupon.category} 
                                color="primary" 
                                size="small" 
                                className="category-chip"
                            />
                        </div>
                        
                        <Divider className="coupon-divider" />
                        
                        <Box className="coupon-content">
                            <Typography className="CouponDescription" variant="body1">
                                <Info fontSize="small" className="icon-margin"/> {coupon.description}
                            </Typography>
                            
                            <Grid container spacing={2} className="coupon-details-grid">
                                <Grid item xs={12} sm={6}>
                                    <Typography className="CouponDetails" variant="body2">
                                        <Event fontSize="small" className="icon-margin"/> <span>Start Date:</span> {formatDate(coupon.startDate)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography className="CouponDetails" variant="body2">
                                        <EventAvailable fontSize="small" className="icon-margin"/> <span>End Date:</span> {formatDate(coupon.endDate)}
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Typography className="coupon-time-remaining" variant="body2">
                                        <CalendarMonth fontSize="small" className="icon-margin"/> {getDaysRemaining(coupon.endDate)}
                                    </Typography>
                                </Grid>
                                
                                {!onPurchase && (
                                    <Grid item xs={12}>
                                        <Typography className="CouponDetails" variant="body2">
                                            <LocalOffer fontSize="small" className="icon-margin"/> <span>Amount:</span> {coupon.amount} available
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                        
                        <div className="coupon-price-section">
                            <Typography className="CouponPrice" variant="h5">
                                ${coupon.price}
                            </Typography>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className="coupon-dialog-actions">
                    <Button onClick={onClose} color="primary" variant="outlined">
                        Close
                    </Button>
                    {onPurchase && (
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={onPurchase}
                            startIcon={<ShoppingCart />}
                            disabled={isExpired(coupon.endDate)}
                            className="purchase-button"
                        >
                            Purchase
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
}
