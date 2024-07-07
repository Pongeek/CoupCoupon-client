import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography, List, ListItem, ListItemText } from "@mui/material";
import { CompanyDetails } from "../../Model/CompanyDetails";
import "./SingleCompany.css"; // Ensure this import is correct

interface companyProps {
    company: CompanyDetails;
    open: boolean;
    onClose: () => void;
}

export function SingleCompany({ company, open, onClose }: companyProps): JSX.Element {
    return (
        <div className="SingleCompany">
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Company Details</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">Name: {company.name}</Typography>
                    <Typography variant="body1">Email: {company.email}</Typography>
                    <Typography variant="h6" sx={{ marginTop: 2 }}>Coupons:</Typography>
                    {company.coupons && company.coupons.length > 0 ? (
                        <List>
                            {company.coupons.map((coupon, index) => (
                                <ListItem key={coupon.id || index}>
                                    <ListItemText primary={coupon.title} secondary={coupon.description} />
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