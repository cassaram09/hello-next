import React from "react";
import App from "next/app";
import Layout from "../components/layout";
import { PageTransition } from "next-page-transitions";
import styles from "../styles/styles.scss";
styles;
class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout {...pageProps}>
        <PageTransition timeout={300} classNames="page-transition">
          <Component {...pageProps}></Component>
        </PageTransition>
      </Layout>
    );
  }
}

export default MyApp;
