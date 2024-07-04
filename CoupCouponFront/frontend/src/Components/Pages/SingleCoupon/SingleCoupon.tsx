import { Dialog, DialogTitle, DialogContent, Typography, Button } from "@mui/material";
import { CouponDetails } from "../../Model/CouponDetails";
import "./SingleCoupon.css";


interface couponProps {
    coupon: CouponDetails;
    open: boolean;
    onClose: () => void;
    onPurchase?: () => void;
}

export function SingleCoupon({ coupon, open, onClose,onPurchase }: couponProps): JSX.Element {
    return (
        <div className="SingleCoupon">
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Coupon Details</DialogTitle>
                <DialogContent>
                    <div className="CouponContainer">
                        <Typography className="CouponTitle" variant="h3">{coupon.title}</Typography>
                        <Typography className="CouponDescription" variant="subtitle1">{coupon.description}</Typography>
                        <Typography className="CouponDetails" variant="subtitle1">
                        <span>Start Date:</span> {coupon.startDate}
                        </Typography>
                        <Typography className="CouponDetails" variant="subtitle1">
                        <span>End Date:</span> {coupon.endDate}
                        </Typography>
                        {!onPurchase && (
                        <Typography className="CouponDetails" variant="subtitle1">
                            <span>Amount:</span> {coupon.amount}
                        </Typography>
                        )}
                        <Typography className="CouponPrice" variant="h4">
                            <span>Price:</span> ${coupon.price}
                        </Typography>
                        {onPurchase && (
                            <Button variant="contained" color="primary" onClick={onPurchase} style={{marginTop: "10px"}}>
                                Purchase
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
