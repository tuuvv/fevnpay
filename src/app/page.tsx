"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Spin, message } from "antd";
import { useDispatch } from "react-redux";
import { addToCart } from "../app/slices/userSlice";
import axios from "axios";

const API_URL = "http://api.tuudeptrai.site/api/v1/products";

interface Product {
  _id: string;
  name: string;
  price: number;
}

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Product[]>(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Trang web thương mại điên tử/h1>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {products.map((product) => (
            <Card key={product._id} title={product.name} style={{ width: 300 }}>
              <p>Price: ${product.price}</p>
              <Button
                type="primary"
                onClick={() =>
                  dispatch(
                    addToCart({
                      _id: product._id,
                      name: product.name,
                      price: product.price,
                      quantity: 1,
                    })
                  )
                }
              >
                Buy Now
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
