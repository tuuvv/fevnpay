"use client";
import { Button, Form, Input, InputNumber } from "antd";
import axios from "axios";
const API_URL = "http://localhost:8081/api/v1";
const PaymentPage = (s: any) => {
  const { session } = s;
  const [form] = Form.useForm();

  const handlePayment = async (values: any) => {
    const { amount, address, phone, email_receiver, receiver_name } = values;

    // Thông tin đơn hàng
    const orderInfo = {
      address,
      phone,
      email_receiver,
      receiver_name,
      cart_id: Math.random().toString(36).substr(2, 10),
    };

    try {
      const response = await axios.post(
        `${API_URL}/cart/create-payment-url`,
        {
          amount,
          orderInfo,
        },
      );
      console.log(response);
      if (response?.data?.data.url) {
        window.location.href = formatURL(response.data.data.url);
      } else {
        console.error("Không có URL thanh toán trả về");
      }
    } catch (error) {
      console.error("Lỗi khi tạo URL thanh toán:", error);
    }
  };
function formatURL(input:string) {
    let url = input.replace(/"/g, "");
    url = url.replace(/,\?/, "?");
    return url;
}

  return (
    <Form
      form={form}
      name="paymentForm"
      initialValues={{ remember: true }}
      onFinish={handlePayment}
    >
      <Form.Item
        label="Số tiền"
        name="amount"
        rules={[{ required: true, message: "Vui lòng nhập số tiền!" }]}
      >
        <InputNumber min={0} placeholder="Nhập số tiền" />
      </Form.Item>

      <Form.Item
        label="Địa chỉ"
        name="address"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
      >
        <Input placeholder="Nhập địa chỉ giao hàng" />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
      >
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>

      <Form.Item
        label="Email người nhận"
        name="email_receiver"
        rules={[{ required: true, message: "Vui lòng nhập email người nhận!" }]}
      >
        <Input placeholder="Nhập email người nhận" />
      </Form.Item>

      <Form.Item
        label="Tên người nhận"
        name="receiver_name"
        rules={[{ required: true, message: "Vui lòng nhập tên người nhận!" }]}
      >
        <Input placeholder="Nhập tên người nhận" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Thanh toán
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PaymentPage;
