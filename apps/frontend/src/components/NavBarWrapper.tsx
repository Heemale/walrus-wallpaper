"use client";

import * as React from "react";
import NavBar from "./NavBar";
import ConnectButton from "@/components/ConnectButton";

const NavBarWrapper = () => {
  return (
    <NavBar>
      <ConnectButton />
    </NavBar>
  );
};

export default NavBarWrapper;
