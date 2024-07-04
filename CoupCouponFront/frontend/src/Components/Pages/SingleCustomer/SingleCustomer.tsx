import { Dialog, DialogTitle, DialogContent, Typography, List, ListItem, ListItemText, Button, TextField } from "@mui/material";
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
                            {/* NEED TO FIX THIS BY MAKING SINGLECOUPON */}
                            {customer.coupons.map((coupon, index) => (
                                <ListItem key={coupon.id || index}>
                                    <ListItemText primary={coupon.title || "No Title"} secondary={coupon.description || "No Description"} />
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



{/* <Card variant="outlined" sx={{ width: 300, margin: 2 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {customer.firstName} {customer.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Email: {customer.email}
                </Typography>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="customer details tabs">
                    <Tab label="Coupons"/>
                </Tabs>
                <Box sx={{ padding: 2 }}>
                    {tabIndex === 0 && (
                        customer.coupons && customer.coupons.length > 0 ? (
                            <List>
                                {customer.coupons.map(coupon => (
                                    <ListItem key={coupon.id}>
                                        <ListItemText primary={coupon.title} secondary={coupon.description} />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No coupons available.
                            </Typography>
                        )
                    )}
                </Box>
            </CardContent>
        </Card> */}


//         <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
//     <AppBar
//         position="static"
//         color="default"
//         elevation={0}
//         sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
//     >
//         <Toolbar>
//             <Grid container spacing={2} alignItems="center">
//                 <Grid item>
//                     <Search color="inherit" sx={{ display: 'block' }} />
//                 </Grid>
//                 <Grid item xs>
//                     <TextField
//                         fullWidth
//                         placeholder="Search by email address, phone number, or user UID"
//                         InputProps={{
//                             disableUnderline: true,
//                             sx: { fontSize: 'default' },
//                         }}
//                         variant="standard"
//                     />
//                 </Grid>
//                 <Grid item>
//                     <Button variant="contained" sx={{ mr: 1 }}>
//                         Add user
//                     </Button>
//                     <Tooltip title="Reload">
//                         <IconButton>
//                             <Refresh color="inherit" sx={{ display: 'block' }} />
//                         </IconButton>
//                     </Tooltip>
//                 </Grid>
//             </Grid>
//         </Toolbar>
//     </AppBar>
//     <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
//         No users for this project yet
//     </Typography>
// </Paper>



{/* <Card variant="outlined" sx={{ width: 300, margin: 2 }}>
<CardContent>
    <Typography variant="h5" component="div">
        {customer.firstName} {customer.lastName}
    </Typography>
    <Typography variant="body2" color="text.secondary">
        Email: {customer.email}
    </Typography>
    <Tabs value={tabIndex} onChange={handleTabChange} aria-label="customer details tabs">
        <Tab label="Coupons" />
    </Tabs>
    <Box sx={{ padding: 2 }}>
        {tabIndex === 0 && (
            customer.coupons && customer.coupons.length > 0 ? (
                <List>
                    {customer.coupons.map(coupon => (
                        <ListItem key={coupon.id}>
                            <ListItemText primary={coupon.title} secondary={coupon.description} />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2" color="text.secondary">
                    No coupons available.
                </Typography>
            )
        )}
    </Box>
</CardContent>
</Card> */}


{/* <DialogTitle>Customer Details</DialogTitle>
<DialogContent>
    <Typography variant="h6">Name: {customer.firstName} {customer.lastName}</Typography>
    <Typography variant="body1">Email: {customer.email}</Typography>
    <Typography variant="h6" sx={{ marginTop: 2 }}>Coupons:</Typography>
    {customer.coupons && customer.coupons.length > 0 ? (
        <List>
            {customer.coupons.map(coupon => (
                <ListItem key={coupon.id}>
                    <ListItemText primary={coupon.title} secondary={coupon.description} />
                </ListItem>
            ))}
        </List>
    ) : (
        <Typography variant="body2" color="text.secondary">
            No coupons available.
        </Typography>
    )}
</DialogContent> */}