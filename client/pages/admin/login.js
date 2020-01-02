import React from "react";
import axios from "axios";
import cookie from "react-cookies";

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  async submitLogin() {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email: "hello09@gmail.com",
        password: "hello123"
      });

      if (response.data.token) {
        cookie.save("token", response.data.token, { path: "/" });
        alert("logged in!");
      }
    } catch (e) {
      console.log(e, "failed");
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.submitLogin}>Log me in </button>
      </div>
    );
  }
}

export default Login;
