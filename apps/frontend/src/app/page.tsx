"use client";

import NavBarWrapper from "@/components/NavBarWrapper";
import Card from "@/components/Card";
import { useEffect, useState } from "react";
import { AddBlob } from "@local/wallpaper-sdk/wallpaper";
import { wallpaperClient } from "@/sdk";

const Home = () => {
  const [blobs, setBlobs] = useState<Array<AddBlob>>([]);

  const getAllAddBlob = async () => {
    const res = await wallpaperClient.getAllAddBlob({});
    setBlobs(res.data);
  };

  useEffect(() => {
    getAllAddBlob();
  }, []);

  return (
    <div className="mb-4">
      <NavBarWrapper />
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blobs.map((item, index) => (
            <Card key={index.toString()} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
