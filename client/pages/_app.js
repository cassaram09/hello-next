import React from "react";
import App from "next/app";
import Layout from "../components/layout";
class MyApp extends App {
  static async getInitialProps(context) {
    const appProps = await App.getInitialProps(context);

    const tokenHttpOnly = context.ctx.req.cookies.tokenHttpOnly;
    const token = context.ctx.req.cookies.token;

    if (token && tokenHttpOnly) {
      appProps.loggedIn = true;
    }

    return appProps;
  }

  render() {
    const { Component, pageProps, loggedIn } = this.props;
    const _props = { ...pageProps, loggedIn };
    return (
      <Layout {..._props}>
        <Component {..._props}></Component>
      </Layout>
    );
  }
}

export default MyApp;
