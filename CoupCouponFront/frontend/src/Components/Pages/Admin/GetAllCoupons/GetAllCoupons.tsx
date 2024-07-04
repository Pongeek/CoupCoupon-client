import { useEffect, useState } from "react";
import "./GetAllCoupons.css";
import { CouponDetails } from "../../../Model/CouponDetails";
import { useNavigate } from "react-router-dom";
import { Table, TableHead, TableRow, TableCell, TableBody, Button, TableContainer, Paper, DialogTitle, Dialog, DialogContent, DialogContentText, Typography, DialogActions } from "@mui/material";
import { SingleCoupon } from "../../SingleCoupon/SingleCoupon";
import { store } from "../../../Redux/store";
import axiosJWT from "../../../Util/AxiosJWT";
import { deleteCouponAction, getCouponsAction } from "../../../Redux/AdminReducer";
import { checkData } from "../../../Util/checkData";
import { getAllCouponsAction } from "../../../Redux/CouponReducer";

export function GetAllCoupons(): JSX.Element {
    const [coupon, setCoupon] = useState<CouponDetails[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<CouponDetails | null>(null);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState<number | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await axiosJWT.get("http://localhost:8080/CoupCouponAPI/Admin/GetAllCoupons");
                const coupons = response.data.map((coupon: any) => ({
                    ...coupon,
                    startDate: coupon.startDate,
                    endDate: coupon.endDate,
                }));
                store.dispatch(getCouponsAction(coupons));
                setCoupon(store.getState().admin.coupons);
                console.log(store.getState().coupons.coupons);
            
            } catch (error) {
                console.log("Error fetching coupons:", error);
                checkData();
                navigate("/login");
            }
        };
        if (store.getState().admin.coupons.length === 0) {
            fetchCoupons();
        } else {
            setCoupon(store.getState().admin.coupons);
        }
    }, [navigate]);

    const confirmDeleteCoupon = async () => {
        if(couponToDelete !== null){
            try{
                const response = await axiosJWT.delete(`http://localhost:8080/CoupCouponAPI/Admin/DeleteCoupon/${couponToDelete}`);
                const updateCoupons = coupon.filter((coupon) => coupon.id !== couponToDelete);
                store.dispatch(getCouponsAction(updateCoupons));
                store.dispatch(deleteCouponAction(couponToDelete));
                setCoupon(store.getState().admin.coupons);
            

                setDeleteDialogOpen(false);
                setCouponToDelete(null);
                
                console.log("Coupon deleted successfully");
            } catch (error) {
                console.log("Error deleting coupon:", error);
            }

            setDeleteDialogOpen(false);
            setCouponToDelete(null);
        }
    }

    const handleDeleteCoupon = (couponId: number) => {
        setCouponToDelete(couponId);
        setDeleteDialogOpen(true);
    }


    const handleRowClick = (coupon: CouponDetails) => {
        setSelectedCoupon(coupon);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCoupon(null);
    };




    return (
        <div className="GetAllCoupons">
            <h1>All Coupons</h1>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {coupon.map((coupon) => (
                            <TableRow key={coupon.id} onClick={() => handleRowClick(coupon)} style={{ cursor: "pointer" }}>
                                <TableCell>{coupon.id}</TableCell>
                                <TableCell>{coupon.title}</TableCell>
                                <TableCell>{coupon.category}</TableCell>
                                <TableCell>{coupon.startDate}</TableCell>
                                <TableCell>{coupon.endDate}</TableCell>
                                <TableCell>{coupon.amount}</TableCell>
                                <TableCell>{coupon.price}$</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteCoupon(coupon.id); }}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {selectedCoupon && (
                <SingleCoupon open={open} onClose={() => { handleClose() }} coupon={selectedCoupon} />
            )}

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Coupon</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this coupon?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => {confirmDeleteCoupon()}} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
