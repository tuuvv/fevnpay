"use client";
import React, { Suspense } from "react";
import VnpayReturn from "../vnpay/update.vnpay";

export const dynamic = "force-dynamic"; // buộc không prerender

export default function UpdateTestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VnpayReturn />
    </Suspense>
  );
}

