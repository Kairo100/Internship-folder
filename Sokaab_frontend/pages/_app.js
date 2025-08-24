
import Head from "next/head";
import { Fragment } from "react";
import "/styles/globals.css";
import Header from '../components/Header'
import Footer from '../components/Footer'
const App = ({ Component, pageProps }) => {
  return (
    <Fragment>
      <Head>
      <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="description" content="The Online Market for Farmers" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/*====== Title ======*/}
        <title>Sokaab</title>
        {/*Google Fonts:Poppin */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" 
          rel="stylesheet" 
        />
        {/* Bootstrap :cdn css */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
        {/* Custom Icons:Falticons */}
        <link
          rel="stylesheet"
          href="/assets/fonts/flaticon/flaticon_gadden.css"
        />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-VoPFzft9QQgb0eQmeb+Ovnqg7tfpzZgq2yD/PnF1MDDUHRU0wHgFh9GV6wnFk4bl" crossOrigin="anonymous"></script>
        <link
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
  rel="stylesheet"
/>


      </Head>
     
       <Header />
       <Component {...pageProps} />
       <Footer />
</Fragment>
  );
};
export default App;
