import React from "react";
import axios from "axios";
import cookie from "react-cookies";
import App from "next/app";

class MyApp extends App {
  static async getInitialProps(context) {
    const appProps = await App.getInitialProps(context);

    // const token = context.ctx.req.cookies.token;
    // if (token) {
    //   // axios.defaults.headers.common["x-access-token"] = token;
    // }
    return appProps;
  }
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps}></Component>;
  }
}

export default MyApp;
