import { Card, CardContent, TextField, Button, Divider } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

const EditAsset = () => {
  let { assetId } = useParams();
  console.log(assetId);

  const [dataAsset, setDataAsset] = useState({
    name: "",
    organization_id: "",
    sensor_id: "",
    pic: "",
    description: "",
  });

  const accessToken = Cookies.get("access_token");
  const navigate = useNavigate();

  if (!accessToken) {
    navigate("/login");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataAssetSubmit = {
      name: dataAsset.name,
      organization_id: dataAsset.organization_id,
      sensor_id: dataAsset.sensor_id,
      pic: dataAsset.pic,
      description: dataAsset.description,
    };

    axios
      .patch(
        `http://127.0.0.1:8001/api/assets/update/${assetId}`,
        dataAssetSubmit,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      )
      .then(function (response) {
        navigate("/all-asset");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8001/api/assets/${assetId}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(function (response) {
        if (!accessToken) {
          navigate("/login");
        }
        setDataAsset(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {}, [dataAsset]);

  return (
    <Card>
      <h1>Edit Asset</h1>
      <Divider variant="middle" />
      <br />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="name"
            fullWidth
            margin="normal"
            value={dataAsset.name}
            onChange={(event) => {
              setDataAsset({
                ...dataAsset,
                name: event.target.value,
              });
            }}
          />
          <TextField
            required
            label="organization_id"
            fullWidth
            margin="normal"
            value={dataAsset.organization_id}
            onChange={(event) => {
              setDataAsset({
                ...dataAsset,
                organization_id: event.target.value,
              });
            }}
          />
          <TextField
            label="address"
            fullWidth
            margin="normal"
            value={dataAsset.sensor_id}
            onChange={(event) => {
              setDataAsset({
                ...dataAsset,
                sensor_id: event.target.value,
              });
            }}
          />
          <TextField
            label="pic"
            fullWidth
            margin="normal"
            value={dataAsset.pic_id}
            onChange={(event) => {
              setDataAsset({
                ...dataAsset,
                pic_id: event.target.value,
              });
            }}
          />
          <TextField
            label="description"
            fullWidth
            margin="normal"
            value={dataAsset.description}
            onChange={(event) => {
              setDataAsset({
                ...dataAsset,
                description: event.target.value,
              });
            }}
          />
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditAsset;