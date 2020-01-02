import React from "react";
import PropTypes from "react-proptypes";
import axios from "axios";
import cookie from "react-cookies";

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    pageProps: PropTypes.object
  };

  async submitLogout() {
    try {
      const response = await axios.post("http://localhost:3000/logout");

      if (response.data.success) {
        cookie.remove("token");
      }
    } catch (e) {
      console.log(e, "failed");
    }
  }

  render() {
    return (
      <div className="layout">
        {this.props.loggedIn && (
          <button onClick={this.submitLogout}>Logout</button>
        )}
        {this.props.children}
      </div>
    );
  }
}

export default Layout;
