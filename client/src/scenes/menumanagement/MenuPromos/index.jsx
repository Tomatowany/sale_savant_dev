import React, { useEffect, useState } from "react";
import { FlexBetween, Header } from "components";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { Search } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

const MenuPromos = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [menuPromo, setMenuPromo] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const fetchMenuPromos = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/menumanagement/menuPromo"
      );
      if (response.ok) {
        const data = await response.json();
        const menuPromoWithId = data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setMenuPromo(menuPromoWithId);
      } else {
        console.error("Failed to fetch menu promo:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  useEffect(() => {
    fetchMenuPromos();
  }, []);

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/menumanagement/menuPromo/${selectedItemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log(`Promo with ID ${selectedItemId} deleted successfully`);
        fetchMenuPromos();
      } else {
        console.error("Failed to delete promo:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the delete:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItemId(null);
    }
  };

  const handleDelete = (_id) => {
    setDeleteDialogOpen(true);
    setSelectedItemId(_id);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  };

  const handleEdit = (_id) => {
    setSelectedItemId(_id);
    navigate(`/edit promo/${_id}`);
  };

  const columns = [
    { field: "menuId", headerName: "Menu ID", width: 80 },
    { field: "promo", headerName: "Promo Name", width: 160 },
    { field: "menuItem", headerName: "Menu Item", width: 150 },
    { field: "category", headerName: "Category", width: 150 },
    { field: "promoDescription", headerName: "Promo Description", width: 250 },
    { field: "price", headerName: "Prices (Php)", type: "number", width: 100 },
    {
      field: "promoQuantity",
      headerName: "Promo Quantity",
      type: "number",
      width: 150,
    },
    {
      field: "validDate",
      headerName: "Valid Until",
      type: "number",
      width: 150,
    },
    {
      field: "divider",
      headerName: "",
      width: 20,
      sortable: false,
      renderCell: () => (
        <Divider orientation="vertical" sx={{ marginLeft: "2em" }} />
      ),
    },
    { field: "noSold", headerName: "No. of Sold", type: "number", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <div
          style={{
            backgroundColor:
              params.row.noSold >= params.row.salesTarget
                ? "#B03021" // Sold Out
                : "#26B02B", // Available
            color: "#FFF",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
        >
          {params.row.noSold >= params.row.salesTarget
            ? "Sold Out"
            : "Available"}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "1em" }}>
          <EditIcon
            onClick={() => handleEdit(params.row._id)}
            sx={{
              color: theme.palette.primary[300],
              cursor: "pointer",
              fontSize: "2.5em",
            }}
          />
          <DeleteForeverIcon
            onClick={() => handleDelete(params.row._id)}
            sx={{
              color: theme.palette.secondary[400],
              cursor: "pointer",
              fontSize: "2.5em",
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Box>
        <Header title={"Menu Promos"} link={"/menu management"} />
      </Box>

      <Box>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <FlexBetween>
            <Link
              style={{
                textDecoration: "none",
                color: theme.palette.primary[100],
                marginBottom: "1em",
              }}
              to="/add promo"
            >
              <Container
                sx={{
                  display: "flex",
                  gap: "0.5em",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AddCircleIcon sx={{ color: "#35D03B", fontSize: "3em" }} />
                <Typography sx={{ fontSize: "1.5em" }}>
                  Add Menu Promo
                </Typography>
              </Container>
            </Link>
          </FlexBetween>

          <FlexBetween>
            <Container>
              <FlexBetween
                backgroundColor={theme.palette.secondary[700]}
                borderRadius="9px"
                gap="3rem"
                minWidth="300px"
                width="100%"
                p="0.1rem 1.5rem"
              >
                <InputBase placeholder="Search..." />
                <IconButton>
                  <Search />
                </IconButton>
              </FlexBetween>
            </Container>

            <Container></Container>
          </FlexBetween>
        </Toolbar>
      </Box>

      <Box
        m="1.5rem 2.5rem"
        height="67vh"
        width="90vw"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.secondary[700],
            color: theme.palette.secondary[100],
            borderColor: theme.palette.secondary[100],
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.secondary[700],
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.secondary[700],
            color: theme.palette.secondary[100],
            borderColor: theme.palette.secondary[100],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={menuPromo}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
        />
      </Box>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this promo?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} sx={{ color: "#000" }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} sx={{ color: "#26B02B" }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MenuPromos;
