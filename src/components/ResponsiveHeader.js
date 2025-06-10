"use client";

import React from "react";
import { useMediaQuery } from "react-responsive";
import Header from "./Header";
import HeaderMobile from "./HeaderMobile";

export default function ResponsiveHeader() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return isMobile ? <HeaderMobile /> : <Header />;
}
