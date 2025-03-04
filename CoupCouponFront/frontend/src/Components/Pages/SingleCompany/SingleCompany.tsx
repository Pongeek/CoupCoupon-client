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
    Grid,
    Pagination
} from "@mui/material";
import { CompanyDetails } from "../../Model/CompanyDetails";
import "./SingleCompany.css";
import { BusinessCenter, Email, LocalOffer, ShoppingBag, Info } from "@mui/icons-material";

interface companyProps {
    company: CompanyDetails;
    open: boolean;
    onClose: () => void;
}

export function SingleCompany({ company, open, onClose }: companyProps): JSX.Element {
    const [page, setPage] = useState(1);
    const couponsPerPage = 2;
    
    // Calculate which coupons to display based on pagination
    const displayedCoupons = company.coupons ? 
        company.coupons.slice((page - 1) * couponsPerPage, page * couponsPerPage) : [];
    
    // Calculate total number of pages
    const totalPages = company.coupons ? Math.ceil(company.coupons.length / couponsPerPage) : 0;
    
    // Handle page change
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    
    return (
        <div className="SingleCompany">
            <Dialog 
                open={open} 
                onClose={onClose} 
                fullWidth 
                maxWidth="sm" 
                className="company-dialog"
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
                        <Avatar className="company-avatar">
                            {company.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box ml={2}>
                            <Typography variant="h5" className="company-name">
                                {company.name}
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary" className="company-id">
                                ID: {company.id}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                
                <DialogContent className="dialog-content" sx={{ overflowY: 'auto', flexGrow: 1 }}>
                    <Box className="info-section">
                        <Box display="flex" alignItems="center" className="info-item">
                            <Email className="info-icon" />
                            <Typography variant="body1">{company.email}</Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="center" className="info-item">
                            <BusinessCenter className="info-icon" />
                            <Typography variant="body1">
                                Business details
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Divider className="section-divider" />
                    
                    <Box className="coupons-section">
                        <Box display="flex" alignItems="center" className="section-header">
                            <LocalOffer className="section-icon" />
                            <Typography variant="h6" className="section-title">
                                Company Coupons
                            </Typography>
                            <Chip 
                                label={`${company.coupons?.length || 0} coupons`} 
                                size="small" 
                                className="coupons-count"
                            />
                        </Box>
                        
                        {company.coupons && company.coupons.length > 0 ? (
                            <>
                                <Paper elevation={0} className="coupons-container">
                                    <List sx={{ padding: 0 }}>
                                        {displayedCoupons.map((coupon, index) => (
                                            <React.Fragment key={coupon.id || index}>
                                                <ListItem className="coupon-list-item">
                                                    <ListItemAvatar>
                                                        <Avatar className="coupon-avatar">
                                                            <ShoppingBag />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText 
                                                        primary={
                                                            <Box display="flex" justifyContent="space-between">
                                                                <Typography className="coupon-title">
                                                                    {coupon.title}
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
                                                                    {coupon.description}
                                                                </Typography>
                                                                <Box display="flex" justifyContent="space-between" mt={1}>
                                                                    <Chip 
                                                                        label={coupon.category} 
                                                                        size="small" 
                                                                        className="coupon-category"
                                                                    />
                                                                    <Typography variant="caption" className="coupon-amount">
                                                                        {coupon.amount} available
                                                                    </Typography>
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
                                    No coupons available for this company.
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