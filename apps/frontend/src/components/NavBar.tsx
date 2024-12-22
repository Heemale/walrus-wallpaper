"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import ImageUploadDialog from "@/components/ImageUploadDialog";
import { Drawer, IconButton, List, ListItem } from "@mui/material";
import { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

interface Props {
  children: React.ReactNode;
}

const NavBar = (props: Props) => {
  const { children } = props;

  // 状态：抽屉是否打开
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  // 切换抽屉的状态
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      // 避免按 Tab 或 Shift 键时关闭抽屉
      if (event instanceof KeyboardEvent) {
        // 仅在是 KeyboardEvent 时检查 `key`
        if (event.key === "Tab" || event.key === "Shift") {
          return;
        }
      }
      setDrawerOpen(open);
    };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-screen-xl flex justify-between items-center py-5 px-4">
        <div className="w-[115px] sm:w-[320px] items-center">
          <Link href={"/"}>
            <Image src="/logo.png" width={50} height={50} alt="logo" />
          </Link>
        </div>
        <div className="hidden md:flex gap-10 items-center">
          <ImageUploadDialog />
          {children}
        </div>

        <div className="flex md:hidden items-center gap-4">
          {children}
          <IconButton color="inherit" onClick={toggleDrawer(true)}>
            <MoreHorizIcon width={20} height={20} />
          </IconButton>
        </div>
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <div
            className="w-64 p-4 text-white bg-black h-full"
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              <ListItem>
                <ImageUploadDialog />
              </ListItem>
            </List>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default NavBar;
