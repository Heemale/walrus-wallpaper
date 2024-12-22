import { WALRUS_AGGREGATOR } from "@/config";

export interface NewlyCreated {
  newlyCreated: {
    blobObject: {
      id: string;
      storedEpoch: number;
      blobId: string;
      size: number;
      erasureCodeType: string;
      certifiedEpoch: number;
      storage: {
        id: string;
        startEpoch: number;
        endEpoch: number;
        storageSize: number;
      };
    };
    encodedSize: number;
    cost: number;
  };
}

export interface AlreadyCertified {
  alreadyCertified: {
    blobId: string;
    event: {
      txDigest: string;
      eventSeq: string;
    };
    endEpoch: number;
  };
}

export const storeBlob = async (
  inputFile: any,
  numEpochs: number,
  basePublisherUrl: string,
): Promise<{
  info: NewlyCreated | AlreadyCertified;
  media_type: string;
}> => {
  const response = await fetch(
    `${basePublisherUrl}/v1/store?epochs=${numEpochs}`,
    {
      method: "PUT",
      body: inputFile,
    },
  );
  if (response.status === 200) {
    const info = await response.json();
    return { info: info, media_type: inputFile.type };
  } else {
    throw new Error("Something went wrong when storing the blob!");
  }
};

export const downloadFile = async (
  blobId: string,
  title: string,
  type: string,
) => {
  const link = document.createElement("a");
  link.style.display = "none";
  // 创建 Blob 对象
  return fetch(`${WALRUS_AGGREGATOR}/v1/${blobId}`)
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      // 设置下载地址
      link.setAttribute("href", url);
      // 设置文件名
      link.setAttribute("download", `${title}.${type.split("/")[1]}`);
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // 释放 URL 对象
      URL.revokeObjectURL(url);
    })
    .catch((error) => console.error("下载文件失败:", error));
};

export const truncatedStr = (str: string) => {
  return str.slice(0, 5) + "..." + str.slice(-4);
};
