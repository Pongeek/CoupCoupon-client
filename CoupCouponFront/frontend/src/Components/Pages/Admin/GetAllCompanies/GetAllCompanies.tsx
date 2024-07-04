import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import "./GetAllCompanies.css";
import { useEffect, useState } from "react";
import { CompanyDetails } from "../../../Model/CompanyDetails";
import { SingleCompany } from "../../SingleCompany/SingleCompany";
import { addCompanyAction, getCompaniesAction } from "../../../Redux/AdminReducer";
import { store } from "../../../Redux/store";
import axiosJWT from "../../../Util/AxiosJWT";
import { useNavigate } from "react-router-dom";
import { checkData } from "../../../Util/checkData";

export function GetAllCompanies(): JSX.Element {
    const [companies, setCompanies] = useState<CompanyDetails[]>([]);
    const [addCompanyDialogOpen, setAddCompanyDialogOpen] = useState(false);
    const [deleteCompanyDialogOpen, setDeleteCompanyDialogOpen] = useState(false);
    const [updateCompanyDialogOpen, setUpdateCompanyDialogOpen] = useState(false);
    const [companyToUpdate, setCompanyToUpdate] = useState<CompanyDetails | null>(null);
    const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<CompanyDetails | null>(null);
    const [emailExistsError, setEmailExistsError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [companyToAdd, setCompanyToAdd] = useState<CompanyDetails>({
        id: 0,
        name: "",
        email: "",
        password: "",
        coupons: []
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanies = async () => {
            checkData();
            try {
                const response = await axiosJWT.get("http://localhost:8080/CoupCouponAPI/Admin/GetAllCompanies");
                console.log("Companies", response);
                store.dispatch(getCompaniesAction(response.data));
                setCompanies(response.data);
            } catch (error) {
                console.error("Error fetching companies:", error);
                checkData();
                navigate("/login");
            }
        };
        if (store.getState().admin.companies.length === 0) {
            fetchCompanies();
        } else {
            setCompanies(store.getState().admin.companies);
        }

    }, [navigate]);

    const handleDeleteCompany = (companyId: number) => {
        setCompanyToDelete(companyId);
        setDeleteCompanyDialogOpen(true);
    };


    const confirmDeleteCompany = async () => {
        if (companyToDelete !== null) {
            try {
                const response = await axiosJWT.delete(`http://localhost:8080/CoupCouponAPI/Admin/DeleteCompany/${companyToDelete}`);
                const updateCompanies = companies.filter((company) => company.id !== companyToDelete);
                setCompanies(updateCompanies);
                store.dispatch(getCompaniesAction(updateCompanies));

                console.log("Company deleted successfully");
            } catch (error) {
                console.error("Error deleting company:", error);
            }

            setDeleteCompanyDialogOpen(false);
            setCompanyToDelete(null);
        }
    };

    const handleUpdateCompany = (company: CompanyDetails) => {
        setCompanyToUpdate(company);
        setUpdateCompanyDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (companyToUpdate !== null) {
            try {
                const checkEmailExists = await axiosJWT.get(`http://localhost:8080/CoupCouponAPI/Login/IsEmailExist/${companyToUpdate.email}`);
                if (checkEmailExists.data === true && companyToUpdate.email !== companies.find(c => c.id === companyToUpdate.id)?.email) {
                    setEmailExistsError("Email already exists");
                    return;
                } else {
                    setEmailExistsError(null);
                }

            } catch (error) {
                console.error("Error checking email exists:", error);
            }

            try {
                const response = await axiosJWT.put(`http://localhost:8080/CoupCouponAPI/Admin/UpdateCompany/${companyToUpdate.id}`, companyToUpdate);
                store.dispatch(getCompaniesAction(response.data));
                const updatedCompanies = companies.map(company => company.id === companyToUpdate.id ? companyToUpdate : company);
                setCompanies(updatedCompanies);
                console.log("Company updated successfully", companyToUpdate);
                setUpdateCompanyDialogOpen(false);
                setCompanyToUpdate(null);

            } catch (error) {
                console.error("Error updating company:", error);
            }
        }
    }

    const handleAddCompany = async () => {
        try {
            const checkEmailExists = await axiosJWT.get(`http://localhost:8080/CoupCouponAPI/Login/IsEmailExist/${companyToAdd.email}`);
            if (checkEmailExists.data === true && companyToAdd.email !== companies.find(c => c.id === companyToAdd.id)?.email) {
                setEmailExistsError("Email already exists");
                return;
            } else {
                setEmailExistsError(null);
            }

            if(companyToAdd.password.length < 5){
                setPasswordError("Password must be at least 5 characters");
                return;
            } else {
                setPasswordError(null);
            }
        } catch (error) {
            console.error("Error checking email exists:", error);
        }

        try {
            const response = await axiosJWT.post("http://localhost:8080/CoupCouponAPI/Admin/AddCompany", companyToAdd);
            store.dispatch(addCompanyAction(companyToAdd));
            setCompanies([...companies, companyToAdd]);
            console.log("Company added successfully", companyToAdd);
            setAddCompanyDialogOpen(false);
            setCompanyToAdd({ id: 0, name: "", email: "", password: "", coupons: [] });
        } catch (error) {
            console.error("Error adding company:", error);
        }
        setPasswordError(null);
        setEmailExistsError(null);
        window.location.reload();
    }



    const handleRowClick = (company: CompanyDetails) => {
        setSelectedCompany(company);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCompany(null);
    };

    return (
        <div className="GetAllCompanies">
            <h1>All Companies</h1>
            <Button variant="contained" color="primary" onClick={() => setAddCompanyDialogOpen(true)}>
                Add Company
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell> <h3>ID</h3></TableCell>
                            <TableCell> <h3>Company Name</h3></TableCell>
                            <TableCell> <h3>Email</h3></TableCell>
                            <TableCell> <h3>Actions</h3></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {companies.map((company) => (
                            <TableRow key={company.id} onClick={() => handleRowClick(company)} style={{ cursor: 'pointer' }}>
                                <TableCell>{company.id}</TableCell>
                                <TableCell>{company.name}</TableCell>
                                <TableCell>{company.email}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteCompany(company.id) }}>
                                        Delete
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); handleUpdateCompany(company) }}>
                                        Update
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {selectedCompany && (
                <SingleCompany open={open} onClose={handleClose} company={selectedCompany} />
            )}

            <Dialog open={deleteCompanyDialogOpen} onClose={() => setDeleteCompanyDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this company?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteCompanyDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteCompany} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={updateCompanyDialogOpen} onClose={() => setUpdateCompanyDialogOpen(false)}>
                <DialogTitle>Update Company</DialogTitle>
                <DialogContent>
                    {companyToUpdate && (
                        <>
                            <TextField
                                label="Company Name"
                                value={companyToUpdate.name}
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />

                            <TextField
                                label="Company Email"
                                value={companyToUpdate.email}
                                onChange={(e) => setCompanyToUpdate({ ...companyToUpdate, email: e.target.value })}
                                fullWidth
                                margin = "normal"
                                error={!!emailExistsError}
                                helperText={emailExistsError}
                            />
                            <TextField
                                label="Password"
                                value={companyToUpdate.password}
                                onChange={(e) => setCompanyToUpdate({ ...companyToUpdate, password: e.target.value })}
                                fullWidth
                                margin="normal"
                                type="password"
                                error={!!passwordError}
                                helperText={passwordError}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateCompanyDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={addCompanyDialogOpen} onClose={() => setAddCompanyDialogOpen(false)}>
                <DialogTitle>Add Company</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Company Name"
                        value={companyToAdd.name}
                        onChange={(e) => setCompanyToAdd({ ...companyToAdd, name: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Company Email"
                        value={companyToAdd.email}
                        onChange={(e) => setCompanyToAdd({ ...companyToAdd, email: e.target.value })}
                        fullWidth
                        margin="normal"
                        error={!!emailExistsError}
                        helperText={emailExistsError}
                    />
                    <TextField
                        label="Company Password"
                        value={companyToAdd.password}
                        onChange={(e) => setCompanyToAdd({ ...companyToAdd, password: e.target.value })}
                        fullWidth
                        margin="normal"
                        type="password"
                        error={!!passwordError}
                        helperText={passwordError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddCompanyDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddCompany} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>


        </div>
    );
}
