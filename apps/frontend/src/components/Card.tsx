"use client";

import Image from "next/image";
import { AddBlob } from "@local/wallpaper-sdk/wallpaper";
import { downloadFile, truncatedStr } from "@/helper";
import { WALRUS_AGGREGATOR } from "@/config";

interface Prop {
  data: AddBlob;
}

const Card = (prop: Prop) => {
  const { data } = prop;
  const { owner, blob } = data;

  const url = `${WALRUS_AGGREGATOR}/v1/${blob}`;

  const handleDownload = async () => {
    await downloadFile(blob || "", blob || "", "application/png");
    // const link = document.createElement("a");
    // link.href = url;
    // link.download = `${blob}.png`;
    // link.click();
  };

  return (
    <div className="relative group w-80">
      <Image
        src={url}
        alt={blob}
        width={400}
        height={400}
        className="rounded-lg transition-all duration-300"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
        <div className="absolute left-4 bottom-4 text-white">
          {truncatedStr(owner)}
        </div>
        <button
          className="absolute right-4 bottom-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleDownload}
        >
          download
        </button>
      </div>
    </div>
  );
};

export default Card;
