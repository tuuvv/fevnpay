"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import queryString from "query-string";
import LoadingGif from "@/assets/images/loading.gif";
import Image from "next/image";
import { message } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  RestOutlined,
} from "@ant-design/icons";
import axios from "axios";

export default function VnpayReturn(s:any) {
  const {session} = s;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>();
  const [loading, setLoading] = useState(true);
  const API_URL = "https://api.tuudeptrai.site/api/v1";
  const verifyOrder = async () => {
    try {
      if (searchParams) {
        const res: any = await axios.post(
          `${API_URL}/cart/verify-checkout`,
          queryString.parse(searchParams.toString())
        );
        console.log("test", res?.data);
        setOrderDetails(res?.data);
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      message.error(error.response?.message);
    }
  };

  useEffect(() => {
    verifyOrder();
  }, []);
  return (
    <div className="relative h-full">
      {loading && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gray-500 top-14 opacity-10">
          <div className="flex justify-center h-full text-black">
            <div className="flex flex-col justify-center">
              <Image width={100} height={100} src={LoadingGif} alt="loading" />
            </div>
          </div>
        </div>
      )}
      <div className="container p-5 mx-auto">
        {orderDetails ? (
          <>
            <div className="flex justify-center">
              {orderDetails?.checked ? (
                <CheckCircleOutlined />
              ) : (
                <CloseCircleOutlined />
              )}
            </div>
            {orderDetails?.checked ? (
              <p className="mb-5 text-xl text-center text-green-500">
                Giao dịch thành công !
              </p>
            ) : (
              <p className="mb-5 text-xl text-center text-red-500">
                Giao dịch thất bại !
              </p>
            )}

            {orderDetails?.checked ? (
              <>
                <p className="text-center">
                  Mã đơn hàng: {orderDetails?.orderInfo?.orderRef}
                </p>
                <p className="text-center">
                  Người nhận hàng: {orderDetails?.orderInfo?.receiver_name}
                </p>
                <p className="text-center">
                  Số điện thoại người nhận:{" "}
                  {orderDetails?.orderInfo?.phone}
                </p>
                <p className="text-center">
                  Email người nhận:{" "}
                  {orderDetails?.orderInfo?.email_receiver}
                </p>
                <p className="text-center">
                  Địa chỉ nhận hàng: {orderDetails?.orderInfo?.address}
                </p>
              </>
            ) : (
              <></>
            )}
            <div className="flex justify-center">
              <div
                className="my-6 text-center text-xl max-lg:text-sm uppercase border-b-[5px] border-[#808080] border-solid cursor-pointer max-lg:w-1/2  w-1/5 hover:w-1/3 duration-300 ease-in-out"
                onClick={() => router.push("/")}
              >
                Quay lại cửa hàng
              </div>
            </div>
          </>
        ) : (
          <div className="h-60">
            {!loading && (
              <>
                <div className="w-full my-4">
                  <div className="flex justify-center">
                    <RestOutlined />
                  </div>
                  <p className="text-center">No items found</p>
                </div>
                <div className="flex justify-center">
                  <div
                    className="my-6 text-center text-xl max-lg:text-sm uppercase border-b-[5px] border-[#808080] border-solid cursor-pointer w-1/5 hover:w-1/3 duration-300 ease-in-out"
                    onClick={() => router.push("/")}
                  >
                    Quay lại cửa hàng
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
