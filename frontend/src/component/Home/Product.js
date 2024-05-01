import React from 'react'
import { Link } from 'react-router-dom'
import ReactStarts from "react-rating-stars-component"
const Product = ({ product }) => {

    const options = {
        edit: false,
        color: "rgba(20,20,20,0.1)",
        activeColor: "tomoto",
        size: window.innerWidth < 600 ? 20 : 25,
        value: 2.5,
        isHalf: true,
    }
    return (
        <Link className="productCart" to={product._id}>
            <img src={product.images[0].url} alt={product.name} className="img-fluid" />
            <p>{product.name}</p>

            <div>
                <ReactStarts {...options} /><span>(123 Reviews)</span>
            </div>
            <span>{product.price}</span>
        </Link>
    )
}

export default Product
