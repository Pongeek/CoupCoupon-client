import React, { useState } from "react";
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Box, 
    Chip, 
    Avatar, 
    Divider, 
    Button, 
    DialogActions, 
    ListItemAvatar,
    Paper,
    Badge,
    Pagination
} from "@mui/material";
import { CustomerDetails } from "../../Model/CustomerDetails";
import "./SingleCustomer.css";
import { Email, Person, LocalOffer, ShoppingBag, Info, CalendarToday } from "@mui/icons-material";

interface customerProps {
    customer: CustomerDetails;
    open: boolean;
    onClose: () => void;
}

export function SingleCustomer({ customer, open, onClose }: customerProps): JSX.Element {
    const [page, setPage] = useState(1);
    const couponsPerPage = 2;
    
    // Calculate which coupons to display based on pagination
    const displayedCoupons = customer.coupons ? 
        customer.coupons.slice((page - 1) * couponsPerPage, page * couponsPerPage) : [];
    
    // Calculate total number of pages
    const totalPages = customer.coupons ? Math.ceil(customer.coupons.length / couponsPerPage) : 0;
    
    // Handle page change
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // Function to create customer initials for the avatar
    const getInitials = () => {
        return `${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}`.toUpperCase();
    };

    // Function to format date
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <div className="SingleCustomer">
            <Dialog 
                open={open} 
                onClose={onClose} 
                fullWidth 
                maxWidth="sm" 
                className="customer-dialog"
                PaperProps={{
                    sx: { 
                        maxHeight: '90vh', 
                        display: 'flex', 
                        flexDirection: 'column'
                    }
                }}
            >
                <DialogTitle className="dialog-title">
                    <Box display="flex" alignItems="center">
                        <Avatar className="customer-avatar">
                            {getInitials()}
                        </Avatar>
                        <Box ml={2}>
                            <Typography variant="h5" className="customer-name">
                                {customer.firstName} {customer.lastName}
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary" className="customer-id">
                                ID: {customer.id}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                
                <DialogContent className="dialog-content" sx={{ overflowY: 'auto', flexGrow: 1 }}>
                    <Box className="info-section">
                        <Box display="flex" alignItems="center" className="info-item">
                            <Email className="info-icon" />
                            <Typography variant="body1">{customer.email}</Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="center" className="info-item">
                            <Person className="info-icon" />
                            <Typography variant="body1">Customer profile</Typography>
                        </Box>
                    </Box>
                    
                    <Divider className="section-divider" />
                    
                    <Box className="coupons-section">
                        <Box display="flex" alignItems="center" className="section-header">
                            <LocalOffer className="section-icon" />
                            <Typography variant="h6" className="section-title">
                                Purchased Coupons
                            </Typography>
                            <Chip 
                                label={`${customer.coupons?.length || 0} coupons`} 
                                size="small" 
                                className="coupons-count"
                            />
                        </Box>
                        
                        {customer.coupons && customer.coupons.length > 0 ? (
                            <>
                                <Paper elevation={0} className="coupons-container">
                                    <List sx={{ padding: 0 }}>
                                        {displayedCoupons.map((coupon, index) => (
                                            <React.Fragment key={`${customer.id}-${coupon.id || index}`}>
                                                <ListItem className="coupon-list-item">
                                                    <ListItemAvatar>
                                                        <Badge
                                                            overlap="circular"
                                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                            badgeContent={
                                                                <Avatar className="coupon-company-avatar">
                                                                    {coupon.companyID?.toString().charAt(0) || 'C'}
                                                                </Avatar>
                                                            }
                                                        >
                                                            <Avatar className="coupon-avatar">
                                                                <ShoppingBag />
                                                            </Avatar>
                                                        </Badge>
                                                    </ListItemAvatar>
                                                    <ListItemText 
                                                        primary={
                                                            <Box display="flex" justifyContent="space-between">
                                                                <Typography className="coupon-title">
                                                                    {coupon.title || "No Title"}
                                                                </Typography>
                                                                <Chip 
                                                                    label={`$${coupon.price}`} 
                                                                    size="small" 
                                                                    className="coupon-price"
                                                                />
                                                            </Box>
                                                        } 
                                                        secondary={
                                                            <Box>
                                                                <Typography variant="body2" className="coupon-description">
                                                                    {coupon.description || "No Description"}
                                                                </Typography>
                                                                <Box display="flex" justifyContent="space-between" mt={1}>
                                                                    <Box display="flex" alignItems="center">
                                                                        <Chip 
                                                                            label={coupon.category} 
                                                                            size="small" 
                                                                            className="coupon-category"
                                                                        />
                                                                    </Box>
                                                                    <Box display="flex" alignItems="center">
                                                                        <CalendarToday fontSize="small" className="date-icon" />
                                                                        <Typography variant="caption" className="coupon-expiry">
                                                                            Expires: {formatDate(coupon.endDate)}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                        } 
                                                    />
                                                </ListItem>
                                                {index < displayedCoupons.length - 1 && 
                                                    <Divider variant="inset" component="li" />
                                                }
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </Paper>
                                {totalPages > 1 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <Pagination 
                                            count={totalPages} 
                                            page={page} 
                                            onChange={handlePageChange} 
                                            color="primary" 
                                            size="small"
                                        />
                                    </Box>
                                )}
                            </>
                        ) : (
                            <Box className="no-coupons">
                                <Info color="disabled" fontSize="large" />
                                <Typography variant="body2" color="textSecondary" align="center">
                                    No coupons available for this customer.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                
                <DialogActions className="dialog-actions">
                    <Button onClick={onClose} color="primary" variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}