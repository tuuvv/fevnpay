"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axios from "axios";

const API_URL = "https://api.tuudeptrai.site/api/v1/categories";

interface Category {
  _id: string;
  name: string;
  description: string;
}

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Category[]>(API_URL);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category?: Category) => {
    setEditingCategory(category || null);
    form.setFieldsValue(category || { name: "", description: "" });
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingCategory) {
        await axios.put(`${API_URL}/${editingCategory._id}`, values);
        message.success("Category updated successfully");
      } else {
        const response = await axios.post(API_URL, values);
        setCategories((prev) => [...prev, response.data]);
        message.success("Category added successfully");
      }
      closeModal();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      message.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`);
      setCategories((prev) => prev.filter((category) => category._id !== id));
      message.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Category", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Actions",
      render: (_: string, record: Category) => (
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
      <h1>Categories</h1>
      <Button
        type="primary"
        onClick={() => openModal()}
        style={{ marginBottom: 16 }}
      >
        Add New Category
      </Button>
      <Table
        dataSource={categories}
        columns={columns}
        loading={loading}
        rowKey="_id"
      />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={closeModal}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter category description" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
