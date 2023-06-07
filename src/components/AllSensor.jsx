import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  TextField,
  Grid,
  Box,
  tableCellClasses,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import Modal from "@mui/material/Modal";
import CreateSensor from "./CreateSensor";
import BasicModal from "./Test";
import EditSensor from "./EditSensor";
import UploadRules from "./UploadRules";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const urlGateway = import.meta.env.VITE_URL_API_GATEWAY;
const urlSensor = import.meta.env.VITE_URL_API_SENSOR;

export default function AllSensor() {
  const [sensorData, setSensorData] = useState([]);
  const accessToken = Cookies.get("access_token");
  const userId = Cookies.get("user_id");
  const [organizationData, setOrganizationData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(true);
  const navigate = useNavigate();
  // const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  // const [openUpload, setOpenUpload] = useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  // const handleOpenUpload = () => setOpenUpload(true);
  // const handleCloseUpload = () => setOpenUpload(false);
  const [deletionFlag, setDeletionFlag] = useState(false);
  const [myKey, setMyKey] = useState(0);

  const [open, setOpen] = useState({});
  const [openUpload, setOpenUpload] = useState({});

  const handleOpen = (sensorId) => {
    setOpen((prevState) => ({
      ...prevState,
      [sensorId]: true,
    }));
  };

  const handleClose = (sensorId) => {
    setOpen((prevState) => ({
      ...prevState,
      [sensorId]: false,
    }));
  };

  const handleOpenUpload = (sensorId) => {
    setOpenUpload((prevState) => ({
      ...prevState,
      [sensorId]: true,
    }));
  };

  const handleCloseUpload = (sensorId) => {
    setOpenUpload((prevState) => ({
      ...prevState,
      [sensorId]: false,
    }));
  };

  const handleDeleteSensor = (sensorId) => {
    axios
      .delete(`${urlGateway}/sensors/delete/${sensorId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        // navigate("/dashboard/all-sensor");
        setDeletionFlag(!deletionFlag);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const selectOrganization = (event) => {
    const selectedValue = event.target.value;
    setMyKey(event.target.value);
    if (!selectedValue) {
      setSensorData([]);
      setSelectedOption("");
      return;
    }
    if (selectedValue === selectedOption) {
      return;
    }
    setSelectedOption(selectedValue);
    // console.log("Selected Value:", selectedValue);
    // axios
    //   .get(`${urlGateway}/organizations/${selectedValue}/sensors/all`, {
    //     headers: {
    //       Authorization: "Bearer " + accessToken,
    //     },
    //   })
    //   .then(function (response) {
    //     console.log(response.data.data);
    //     if (!accessToken) {
    //       navigate("/login");
    //     }
    //     setSensorData(response.data.data);
    //     // setDeletionFlag(!deletionFlag);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };

  useEffect(() => {
    axios
      .get(`${urlGateway}/users/${userId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        const organizationDatas = response.data.data.organization.map(
          (org) => ({
            id: org.id,
            name: org.name,
          })
        );

        if (!accessToken) {
          navigate("/login");
        }

        setOrganizationData(organizationDatas);
        setIsLoadingOrganization(false);
        console.log(organizationDatas);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${urlGateway}/organizations/${myKey}/sensors/all`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        if (!accessToken) {
          navigate("/login");
        }
        setSensorData(response.data.data);
        // setDeletionFlag(!deletionFlag);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [myKey, deletionFlag]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            bgcolor: "background.paper",
            border: 1,
            borderColor: "grey.500",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            borderRadius: "16px",
            boxShadow: 3,
          }}
        >
          <Box
            sx={{
              p: 3,
            }}
          >
            <Box display="flex" justifyContent="space-between">
              {!isLoadingOrganization && (
                <TextField
                  id="list-organization-user"
                  select
                  label="Select Organization"
                  defaultValue={selectedOption}
                  value={selectedOption}
                  onChange={selectOrganization}
                  SelectProps={{
                    native: true,
                  }}
                  helperText="Please select your organization"
                >
                  <option value=""></option>
                  {organizationData.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </TextField>
              )}
              <Button onClick={handleOpenAdd}>Add Sensor</Button>
              <Modal
                open={openAdd}
                onClose={handleCloseAdd}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <CreateSensor handleCloseAdd={handleCloseAdd} />
              </Modal>
            </Box>
          </Box>
          <Box
            sx={{
              p: 2,
            }}
          >
            <TableContainer
              component={Paper}
              sx={{
                p: 2,
                maxWidth: 900,
                alignContent: "center",
              }}
            >
              <Table sx={{ maxWidth: 950 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell align="right">Name</StyledTableCell>
                    <StyledTableCell align="right">UUID</StyledTableCell>
                    <StyledTableCell align="right">MQTT IP</StyledTableCell>
                    <StyledTableCell align="right">MQTT Topic</StyledTableCell>
                    <StyledTableCell align="right">MQTT Port</StyledTableCell>
                    <StyledTableCell align="right">
                      Network Interface
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Protected Subnet
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      External Subnet
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Organization Name
                    </StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sensorData.map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell component="th" scope="row">
                        {row.id}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.uuid}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.mqtt_ip}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.mqtt_topic}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.mqtt_port}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.network_interface}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.protected_subnet}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.external_subnet}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.organization_name}
                      </StyledTableCell>
                      <Stack direction="row" spacing={2} p={2} m={2}>
                        <Button
                          variant="outlined"
                          color="error"
                          sensorData
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteSensor(row.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="contained"
                          endIcon={<EditIcon />}
                          onClick={() => handleOpen(row.id)}
                        >
                          Edit
                        </Button>
                        <Modal
                          open={open[row.id] || false}
                          onClose={() => handleClose(row.id)}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <EditSensor
                            sensorData={sensorData}
                            sensorId={row.id}
                            handleClose={handleClose}
                          />
                        </Modal>
                        <Button
                          variant="outlined"
                          endIcon={<UploadFileIcon />}
                          onClick={() => handleOpenUpload(row.id)}
                        >
                          Rules
                        </Button>
                        <Modal
                          open={openUpload[row.id] || false}
                          onClose={() => handleCloseUpload(row.id)}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <UploadRules
                            sensorId={row.id}
                            handleCloseUpload={handleCloseUpload}
                          />
                        </Modal>
                      </Stack>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            bgcolor: "background.paper",
            border: 1,
            borderColor: "grey.500",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            borderRadius: "16px",
            boxShadow: 3,
            mt: 5,
          }}
        >
          <Box
            sx={{
              pt: 3,
            }}
          >
            <Typography variant="h5">Sensor Installation</Typography>;
          </Box>
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <CheckCircleOutlineIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Install Docker Engine: Install Docker Engine by following the instructions provided on the official Docker website: https://docs.docker.com/get-docker/" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <CheckCircleOutlineIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Install Docker Compose: After installing Docker Engine, proceed to install Docker Compose. You can find installation instructions for Docker Compose on the official Docker website: https://docs.docker.com/compose/install/" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <CheckCircleOutlineIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Clone Sensor Repository: Clone the repository by running the following command in your terminal: git clone https://github.com/kurous2/sensor-TA.git" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <CheckCircleOutlineIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Run Script: Navigate to the cloned repository directory and execute the run.sh script. If needed, use sudo to run it with superuser privileges. The command will be: ./run.sh" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <CheckCircleOutlineIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Test Sensor: Once the installation is complete, you can test the sensor by simulating attacks." />
            </ListItem>
          </List>
        </Box>
      </Box>
      {/* <Grid container spacing={2} direction="column">
        <Grid item>
         
        </Grid>
        <Grid item>
          
        </Grid>
      </Grid> */}
    </>
  );
}
