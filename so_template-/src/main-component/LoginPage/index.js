import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import SimpleReactValidator from "simple-react-validator";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.scss";
import Logo from "../../images/logo2.png";

const LoginPage = (props) => {
  const push = useNavigate();

  const [value, setValue] = useState({
    email: "user@gmail.com",
    password: "123456",
    remember: false,
  });

  const changeHandler = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
    validator.showMessages();
  };

  const rememberHandler = () => {
    setValue({ ...value, remember: !value.remember });
  };

  const [validator] = React.useState(
    new SimpleReactValidator({
      className: "errorMessage",
    })
  );

  const submitForm = async (e) => {
    e.preventDefault();

    if (validator.allValid()) {
      validator.hideMessages();

      try {
        const response = await axios.post(
          "https://api.caprover.sokaab.com/api/auth/login",
          {
            email: value.email,
            password: value.password,
          }
        );

        const { access_token, userData } = response.data;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("user", JSON.stringify(userData));

        toast.success(`Welcome ${userData.first_name}!`);
        window.location.href = "https://dashboard.sokaab.com/";

        setValue({
          email: "",
          password: "",
          remember: false,
        });
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          toast.error("Invalid email or password");
        } else {
          toast.error("Login failed. Please try again.");
        }
      }
    } else {
      validator.showMessages();
      toast.error("Empty field is not allowed!");
    }
  };

  return (
    <Grid className="loginWrapper">
      <Grid className="loginForm">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={Logo}
            alt="Login Banner"
            className="loginImage"
            style={{
              width: "160px",
              alignSelf: "center",
              height: "80px",
            }}
          />
        </div>

        <h2>Sign In</h2>
        {/* <p>Sign in to your account</p> */}
        <form onSubmit={submitForm}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                className="inputOutline"
                fullWidth
                placeholder="E-mail"
                value={value.email}
                variant="outlined"
                name="email"
                label="E-mail"
                InputLabelProps={{
                  shrink: true,
                }}
                onBlur={(e) => changeHandler(e)}
                onChange={(e) => changeHandler(e)}
              />
              {validator.message("email", value.email, "required|email")}
            </Grid>
            <Grid item xs={12}>
              <TextField
                className="inputOutline"
                fullWidth
                placeholder="Password"
                value={value.password}
                variant="outlined"
                name="password"
                type="password"
                label="Password"
                InputLabelProps={{
                  shrink: true,
                }}
                onBlur={(e) => changeHandler(e)}
                onChange={(e) => changeHandler(e)}
              />
              {validator.message("password", value.password, "required")}
            </Grid>
            <Grid item xs={12}>
              <Grid className="formAction">
                <Link to="/forgot">Forgot Password?</Link>
              </Grid>
              <Grid className="formFooter">
                <Button fullWidth className="cBtnTheme" type="submit">
                  Login
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
        <div className="shape-img">
          <i className="fa-solid fa-hexagon"></i>
        </div>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
