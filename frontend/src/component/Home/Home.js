import React, { Fragment, useEffect } from "react";
// import { CgMouse } from "react-icons/all";
import "./Home.css";
import Product from "./Product";

// import ProductCard from "./ProductCard.js";
// import MetaData from "../layout/MetaData";
// import { clearErrors, getProduct } from "../../actions/productAction";
// import { useSelector, useDispatch } from "react-redux";
// import Loader from "../layout/Loader/Loader";
// import { useAlert } from "react-alert";

const Home = () => {
  // const alert = useAlert();
  // const dispatch = useDispatch();
  // const { loading, error, products } = useSelector((state) => state.products);

  // useEffect(() => {
  //   if (error) {
  //     alert.error(error);
  //     dispatch(clearErrors());
  //   }
  //   dispatch(getProduct());
  // }, [dispatch, error, alert]);


  const product = {
    name: "Momous",
    price: 3000,
    _id: "dfjkghjdfhgdfg",
    images: [{ url: "https://insaaf99.com/assets/images/blogger.png" }],
  }
  return (
    <>
      <Fragment>
        {/* <MetaData title="ECOMMERCE" /> */}

        <div className="banner">
          <p>Welcome to Ecommerce</p>
          <h1>FIND AMAZING PRODUCTS BELOW</h1>

          <a href="#container">
            <button>
              Scroll
            </button>
          </a>
        </div>

        <h2 className="homeHeading">Featured Products</h2>

        <div className="container" id="container">
          <Product product={product} />
          <Product product={product} />
          <Product product={product} />
          <Product product={product} />
        </div>
      </Fragment>


    </>
  );
};

export default Home;
