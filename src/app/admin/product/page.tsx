"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import axios from "axios";

const API_URL = "https://api.staging.tuudeptrai.site/api/v1/products";
const CATEGORY_API_URL = "https://api.staging.tuudeptrai.site/api/v1/categories";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await axios.get<{ id: string; name: string }[]>(
        CATEGORY_API_URL
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories");
    }
  };

  const openModal = (product?: Product) => {
    setEditingProduct(product || null);
    form.setFieldsValue(
      product || { name: "", price: 0, description: "", category: "" }
    );
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingProduct) {
        await axios.put(`${API_URL}/${editingProduct._id}`, values);
        message.success("Product updated successfully");
      } else {
        const response = await axios.post(API_URL, values);
        setProducts((prev) => [...prev, response.data]);
        message.success("Product added successfully");
      }
      closeModal();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      message.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));
      message.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Product", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Actions",
      render: (_: string, record: Product) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={() => openModal(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record._id)} danger>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Products</h1>
      <Button
        type="primary"
        onClick={() => openModal()}
        style={{ marginBottom: 16 }}
      >
        Add New Product
      </Button>
      <Table
        dataSource={products}
        columns={columns}
        loading={loading}
        rowKey="_id"
      />

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={closeModal}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter product price" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter product description" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select>
              {categories.map((cat:any) => (
                <Select.Option key={cat._id} value={cat.name}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductPage;
