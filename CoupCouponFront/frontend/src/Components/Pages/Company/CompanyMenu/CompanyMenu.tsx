import "./CompanyMenu.css";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Dialog, DialogTitle, DialogContent, Typography, DialogActions, TextField, MenuItem, FormControl, InputLabel, Select, Grid } from "@mui/material";
import { store } from "../../../Redux/store";
import { SingleCoupon } from "../../SingleCoupon/SingleCoupon";
import { useEffect, useState } from "react";
import { CouponDetails } from "../../../Model/CouponDetails";
import { useNavigate } from "react-router-dom";
import axiosJWT from "../../../Util/AxiosJWT";
import { addCouponAction, deleteCouponAction, getCompanyCouponsAction, updateCouponAction } from "../../../Redux/CompanyReducer";
import { checkData } from "../../../Util/checkData";

/**
 * Enum for coupon categories.
 */
enum CouponCategory {
    FOOD = "FOOD",
    ELECTRONICS = "ELECTRICITY",
    SPA = "SPA",
    VACATION = "VACATION",
    CONCERTS = "CONCERTS",
    RESTAURANT = "RESTAURANT"
}

/**
 * CompanyMenu component that displays a list of all company coupons and provides functionality to add, update, and delete coupons.
 * @returns {JSX.Element} The rendered CompanyMenu component.
 */
export function CompanyMenu(): JSX.Element {
    const [coupon, setCoupon] = useState<CouponDetails[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<CouponDetails | null>(null);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState<number | null>(null);
    const navigate = useNavigate();
    const [couponToUpdate, setCouponToUpdate] = useState<CouponDetails | null>(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [titleExistsError, setTitleExistsError] = useState<string | null>(null);
    const [addCouponDialogOpen, setAddCouponDialogOpen] = useState(false);
    const [priceError, setPriceError] = useState<string | null>(null);
    const [amountError, setAmountError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<number>(0);
    const [today, setToday] = useState<string>(new Date().toISOString().split('T')[0]);
    const [newCoupon, setNewCoupon] = useState<CouponDetails>({
        id: 0,
        companyID: store.getState().auth.id,
        category: "",
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        amount: 0,
        price: 0,
        image: ":)",
    });

    // useEffect hook to fetch coupons when the component mounts
    useEffect(() => {
        checkData();
        const fetchCoupons = async () => {
            try {
                const response = await axiosJWT.get("http://localhost:8080/CoupCouponAPI/Company/GetAllCompanyCoupons");
                const coupons = response.data.map((coupon: CouponDetails) => ({
                    ...coupon,
                    startDate: coupon.startDate,
                    endDate: coupon.endDate,
                }));
                store.dispatch(getCompanyCouponsAction(coupons));
                setCoupon(store.getState().company.coupons);
            }
            catch (error) {
                console.log("Error fetching coupons:", error);
                checkData();
                navigate("/login");
            }
        };
        if (store.getState().company.coupons.length === 0 ||
            store.getState().company.coupons === undefined) {
            fetchCoupons();
        } else {
            setCoupon(store.getState().company.coupons);
        }
    }, [navigate]);

    // Confirm delete coupon action
    const confirmDeleteCoupon = async () => {
        if (couponToDelete !== null) {
            try {
                const response = await axiosJWT.delete(`http://localhost:8080/CoupCouponAPI/Admin/DeleteCoupon/${couponToDelete}`);
                const updateCoupons = coupon.filter((coupon) => coupon.id !== couponToDelete);
                store.dispatch(getCompanyCouponsAction(updateCoupons));
                store.dispatch(deleteCouponAction(couponToDelete));
                setCoupon(updateCoupons);

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

    // Handle update coupon action
    const handleUpdate = async () => {
        console.log("couponToUpdate", couponToUpdate);

        if (couponToUpdate !== null) {
            const companyCouponList: CouponDetails[] = store.getState().company.coupons;
            for (let i = 0; i < companyCouponList.length; i++) {
                if (companyCouponList[i].title === couponToUpdate.title && companyCouponList[i].id !== couponToUpdate.id) {
                    setTitleExistsError("Title already exists");
                    return;
                } else {
                    setTitleExistsError(null);
                }
            }

            // Validate dates
            const today = new Date().toISOString().split('T')[0];
            if (couponToUpdate.startDate < today) {
                console.error("Start date cannot be before today");
                return;
            }
            if (couponToUpdate.endDate < couponToUpdate.startDate) {
                console.error("End date cannot be before start date");
                return;
            }
            try {
                // Check if startDate and endDate are valid
                if (!couponToUpdate.startDate || !couponToUpdate.endDate) {
                    console.error("Invalid date properties in couponToUpdate");
                    return;
                }

                const response = await axiosJWT.put(`http://localhost:8080/CoupCouponAPI/Company/UpdateCoupon/${couponToUpdate.id}`, couponToUpdate);

                store.dispatch(updateCouponAction(couponToUpdate, couponToUpdate.id));
                const updatedCoupon = coupon.map((coupon) => coupon.id === couponToUpdate.id ? couponToUpdate : coupon);
                setCoupon(updatedCoupon);
                console.log("Coupon updated successfully", couponToUpdate.title);
                setUpdateDialogOpen(false);
                setCouponToUpdate(null);
            } catch (error) {
                console.log("Error updating coupon:", error);
            }
        }
    };

    // Handle add coupon submit
    const handleAddCouponSubmit = async () => {
        const companyCouponList: CouponDetails[] = store.getState().company.coupons;
        // Validate dates
        const today = new Date().toISOString().split('T')[0];
        if (newCoupon.startDate < today) {
            return;
        }
        if (newCoupon.endDate < newCoupon.startDate) {
            return;
        }
        for (let i = 0; i < companyCouponList.length; i++) {
            if (companyCouponList[i].title === newCoupon.title) {
                setTitleExistsError("Title already exists");
                return;
            } else {
                setTitleExistsError(null);
            }

            if (newCoupon.price < 1 || newCoupon.price === null) {
                setPriceError("Price must be at least 1");
                return;
            } else {
                setPriceError(null);
            }
            if (newCoupon.amount < 10) {
                setAmountError("Amount must be at least 10");
                return;
            } else {
                setAmountError(null);
            }

            if (!newCoupon.startDate || !newCoupon.endDate) {
                console.error("Invalid date properties in couponToUpdate");
                return;
            }

            try {
                const response = await axiosJWT.post("http://localhost:8080/CoupCouponAPI/Company/AddCoupon", newCoupon);
                store.dispatch(addCouponAction(newCoupon));
                const updatedCoupons = [...coupon, newCoupon];
                setCoupon(updatedCoupons);
                console.log("Coupon added successfully", newCoupon.title);
                setAddCouponDialogOpen(false);
                setNewCoupon({
                    id: 0,
                    companyID: store.getState().auth.id,
                    category: "",
                    title: "",
                    description: "",
                    startDate: "",
                    endDate: "",
                    amount: 0,
                    price: 0,
                    image: "",
                });
                setAddCouponDialogOpen(false);
            } catch (error) {
                console.log("Error adding coupon:", error);
            }
            window.location.reload();
        }
    }

    // Fetch coupons by category
    const fetchCouponsByCategory = async (category: string) => {
        if (category === "ALL") {
            setCoupon(store.getState().company.coupons);
        } else {
            const response = await axiosJWT.get(`http://localhost:8080/CoupCouponAPI/Company/GetCouponsByCategory/${category}`);
            setCoupon(response.data);
        }
    }

    // Fetch coupons by max price
    const fetchCouponsByMaxPrice = async (price: number) => {
        const response = await axiosJWT.get(`http://localhost:8080/CoupCouponAPI/Company/GetCouponsByMaxPrice/${price}`);
        setCoupon(response.data);
    }

    // Handle category change
    const handleCategoryChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const category = e.target.value as string;
        setSelectedCategory(category);
        fetchCouponsByCategory(category);
        setMaxPrice(0);
    };

    // Handle max price change
    const handleMaxPriceChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const price = e.target.value as number;
        setMaxPrice(price);
        if (price === null || price === undefined) {
            setMaxPrice(0); // Set to 0 if the input is empty
        }
        fetchCouponsByMaxPrice(price);
        setSelectedCategory("ALL");
    };

    // Handle update coupon action
    const handleUpdateCoupon = (coupon: CouponDetails) => {
        setCouponToUpdate(coupon);
        setUpdateDialogOpen(true);
    }

    // Handle delete coupon action
    const handleDeleteCoupon = (couponId: number) => {
        setCouponToDelete(couponId);
        setDeleteDialogOpen(true);
    }

    // Handle row click to view coupon details
    const handleRowClick = (coupon: CouponDetails) => {
        setSelectedCoupon(coupon);
        setOpen(true);
    };

    // Handle close dialog
    const handleClose = () => {
        setOpen(false);
        setSelectedCoupon(null);
    };

    return (
        <div className="CompanyCoupons">
            <h1>{store.getState().auth.name} Coupons</h1>
            <Button variant="contained" color="primary" onClick={() => setAddCouponDialogOpen(true)}>
                Add Coupon
            </Button>
            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Grid container spacing={2} style={{ marginTop: 10 }}>
                    <Grid item xs={3}>
                        <TextField
                            select
                            label="Filter by Category"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            style={{ width: '70%' }}
                            margin="normal"
                            variant="outlined"
                        >
                            <MenuItem value="ALL">All</MenuItem>
                            {Object.values(CouponCategory).map((category) => (
                                <MenuItem key={category} value={category}>{category}</MenuItem>
                            ))}

                        </TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            type="number"
                            label="Filter by Max Price"
                            value={maxPrice || ''}
                            onChange={handleMaxPriceChange}
                            style={{ width: '70%' }}
                            margin="normal"
                            variant="outlined"
                            inputProps={{ min: 1 }}
                        />
                    </Grid>
                </Grid>
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
                                    <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); handleUpdateCoupon(coupon); }}>
                                        Update
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
                    <Button onClick={() => { confirmDeleteCoupon() }} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
                <DialogTitle>Update Coupon</DialogTitle>
                <DialogContent>
                    {couponToUpdate && (
                        <>
                            <TextField
                                label="Title"
                                value={couponToUpdate.title}
                                onChange={(e) => setCouponToUpdate({ ...couponToUpdate, title: e.target.value })}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                error={!!titleExistsError}
                                helperText={titleExistsError}
                            />
                            <TextField
                                select
                                label="Category"
                                value={couponToUpdate.category}
                                onChange={(e) => setCouponToUpdate({ ...couponToUpdate, category: e.target.value })}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            >
                                {Object.values(CouponCategory).map((category) => (
                                    <MenuItem key={category} value={category}>{category}</MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Description"
                                value={couponToUpdate.description}
                                onChange={(e) => setCouponToUpdate({ ...couponToUpdate, description: e.target.value })}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                type="date"
                                label="Start Date"
                                value={couponToUpdate.startDate}
                                onChange={(e) => setCouponToUpdate({ ...couponToUpdate, startDate: e.target.value.split('T')[0] })}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                            />
                            <TextField
                                type="date"
                                label="End Date"
                                value={couponToUpdate.endDate}
                                onChange={(e) => setCouponToUpdate({ ...couponToUpdate, endDate: e.target.value.split('T')[0] })}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: couponToUpdate.startDate }}
                            />
                            <TextField
                                type="number"
                                label="Price"
                                value={couponToUpdate.price}
                                onChange={(e) => setCouponToUpdate({ ...couponToUpdate, price: parseFloat(e.target.value) })}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                type="number"
                                label="Amount"
                                value={couponToUpdate.amount}
                                onChange={(e) => setCouponToUpdate({ ...couponToUpdate, amount: parseInt(e.target.value) })}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} color="primary">Update</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={addCouponDialogOpen} onClose={() => setAddCouponDialogOpen(false)}>
                <DialogTitle>Add Coupon</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        label="Category"
                        value={newCoupon.category}
                        onChange={(e) => setNewCoupon({ ...newCoupon, category: e.target.value })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    >
                        {Object.values(CouponCategory).map((category) => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Title"
                        value={newCoupon.title}
                        onChange={(e) => setNewCoupon({ ...newCoupon, title: e.target.value })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        label="Description"
                        value={newCoupon.description}
                        onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        type="date"
                        label="Start Date"
                        value={newCoupon.startDate}
                        onChange={(e) => setNewCoupon({ ...newCoupon, startDate: e.target.value.split('T')[0] })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: new Date().toISOString().split('T')[0] }}
                    />
                    <TextField
                        type="date"
                        label="End Date"
                        value={newCoupon.endDate}
                        onChange={(e) => setNewCoupon({ ...newCoupon, endDate: e.target.value.split('T')[0] })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: newCoupon.startDate }}
                    />
                    <TextField
                        type="number"
                        label="Amount"
                        value={newCoupon.amount}
                        onChange={(e) => setNewCoupon({ ...newCoupon, amount: parseInt(e.target.value) })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        error={!!amountError}
                        helperText={amountError}
                    />
                    <TextField
                        type="number"
                        label="Price"
                        value={newCoupon.price}
                        onChange={(e) => setNewCoupon({ ...newCoupon, price: parseFloat(e.target.value) })}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        error={!!priceError}
                        helperText={priceError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddCouponDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddCouponSubmit} color="primary">Add</Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}



