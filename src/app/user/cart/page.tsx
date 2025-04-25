"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { removeFromCart, clearCart } from "../../slices/userSlice";
import { Button, Table, message, Form, Input } from "antd";
import axios from "axios";

const API_URL = "http://api.staging.tuudeptrai.site/api/v1";

const CartPage: React.FC = () => {
  const cart = useSelector((state: RootState) => state.user.cart);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleCheckout = async (values: any) => {
    if (cart.length === 0) {
      message.warning("Your cart is empty!");
      return;
    }

    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    if (isNaN(totalAmount) || totalAmount <= 0) {
      message.error("Invalid amount. Please check your cart items.");
      return;
    }

    const orderInfo = {
      address: values.address,
      phone: values.phone,
      email_receiver: values.email_receiver,
      receiver_name: values.receiver_name,
      cart_id: Math.random().toString(36).substr(2, 10),
    };

    const payload = {
      amount: Number(totalAmount) *25000, // Ensure amount is a number
      orderInfo,
    };

    console.log(
      "Sending payment request payload:",
      JSON.stringify(payload, null, 2)
    ); // Debugging log

    try {
      const response = await axios.post(
        `${API_URL}/cart/create-payment-url`,
        payload
      );
      console.log("Payment response:", response.data); // Debugging log

      if (response?.data?.url) {
        window.location.href = formatURL(response.data.url);
      } else {
        console.error("No payment URL returned");
        message.error("No payment URL received from the server.");
      }
    } catch (error:any) {
      console.error("Error creating payment URL:", error);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error(
          "Response data:",
          JSON.stringify(error.response.data, null, 2)
        );
        console.error("Response headers:", error.response.headers);
        message.error(
          `Server error: ${error.response.data.message || "Unknown error"}`
        );
      } else if (error.request) {
        console.error("Request data:", error.request);
        message.error("No response received from server.");
      } else {
        console.error("Error message:", error.message);
        message.error("An unexpected error occurred.");
      }
    }
  };

  function formatURL(input: string) {
    let url = input.replace(/"/g, "");
    url = url.replace(/,\?/, "?");
    return url;
  }

  const handleRemoveFromCart = (_id: string) => {
    dispatch(removeFromCart(_id));
  };

  const columns = [
    { title: "Product", dataIndex: "name", key: "name" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Button danger onClick={() => handleRemoveFromCart(record._id)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1>Cart</h1>
      <Table dataSource={cart} columns={columns} rowKey="_id" />
      <Form form={form} onFinish={handleCheckout} style={{ marginTop: 16 }}>
        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: "Please enter your address!" }]}
        >
          <Input placeholder="Enter your address" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            { required: true, message: "Please enter your phone number!" },
          ]}
        >
          <Input placeholder="Enter your phone number" />
        </Form.Item>
        <Form.Item
          name="email_receiver"
          label="Email Receiver"
          rules={[
            { required: true, message: "Please enter the receiver's email!" },
          ]}
        >
          <Input placeholder="Enter receiver's email" />
        </Form.Item>
        <Form.Item
          name="receiver_name"
          label="Receiver Name"
          rules={[
            { required: true, message: "Please enter the receiver's name!" },
          ]}
        >
          <Input placeholder="Enter receiver's name" />
        </Form.Item>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button danger onClick={() => dispatch(clearCart())}>
            Clear Cart
          </Button>
          <Button type="primary" htmlType="submit">
            Checkout
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CartPage;
