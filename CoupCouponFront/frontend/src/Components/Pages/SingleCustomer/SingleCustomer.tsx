import { Dialog, DialogTitle, DialogContent, Typography, List, ListItem, ListItemText } from "@mui/material";
import { CustomerDetails } from "../../Model/CustomerDetails";
import "./SingleCustomer.css";

interface customerProps {
    customer: CustomerDetails;
    open: boolean;
    onClose: () => void;
}

export function SingleCustomer({ customer, open, onClose }: customerProps): JSX.Element {
    return (
        <div className="singleCustomer">
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Customer Details</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">Name: {customer.firstName} {customer.lastName}</Typography>
                    <Typography variant="body1">Email: {customer.email}</Typography>
                    <Typography variant="h6" sx={{ marginTop: 2 }}>Coupons:</Typography>
                    {customer.coupons && customer.coupons.length > 0 ? (
                        <List>
                            {customer.coupons.map((coupon, index) => (
                                <ListItem key={`${customer.id}-${coupon.id}-${index}`}>
                                    <ListItemText 
                                        primary={coupon.title ? coupon.title : "No Title"} 
                                        secondary={coupon.description ? coupon.description : "No Description"} 
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No coupons available.
                        </Typography>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}