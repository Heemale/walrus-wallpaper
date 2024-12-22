"use client";

import { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  TextField,
} from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import { AlreadyCertified, NewlyCreated, storeBlob } from "@/helper";
import { Transaction } from "@mysten/sui/transactions";
import { suiClient, wallpaperClient } from "@/sdk";
import { PACKAGE_ID, STATE } from "@local/wallpaper-sdk/utils";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { SuiObjectResponse } from "@mysten/sui/client";
import { message } from "antd";
import { WALRUS_PUBLISHER } from "@/config";

interface BlobLibrary {
  id: string;
  name: string;
}

const ImageUploadDialog = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const [imageName, setImageName] = useState("");
  const [epochs, setEpochs] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [blobLibraries, setBlobLibraries] = useState<Array<BlobLibrary> | null>(
    null,
  );
  const [blobLibrary, setBlobLibrary] = useState<BlobLibrary | null>(null);
  const [libraryName, setLibraryName] = useState<string>("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLibraryName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLibraryName(event.target.value);
  };

  const handleImageNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setImageName(event.target.value);
  };

  const handleEpochs = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEpochs(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleCreate = () => {
    const tx = new Transaction();
    wallpaperClient.create(tx, STATE, libraryName);
    signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: async (result) => {
          messageApi.success(`Success: ${result.digest}`);
          setOpen(false);
        },
        onError: ({ message }) => {
          messageApi.error(message);
        },
      },
    );
  };

  const handleUpload = async () => {
    if (!blobLibraries || blobLibraries.length == 0) return;
    if (!image) {
      messageApi.warning("Please select a picture.");
      return;
    }
    if (!imageName) {
      messageApi.warning("Please enter a file name.");
      return;
    }
    try {
      const res = await storeBlob(image, Number(epochs), WALRUS_PUBLISHER);
      const tx = new Transaction();
      if (res.info.hasOwnProperty("newlyCreated")) {
        const data = res.info as NewlyCreated;
        const blobId = data?.newlyCreated?.blobObject?.blobId;
        if (blobLibrary) {
          wallpaperClient.addBlob(tx, blobLibrary?.id, blobId);
        } else {
          messageApi.warning("Please select library.");
        }
      } else {
        const data = res.info as AlreadyCertified;
        const blobId = data?.alreadyCertified?.blobId;
        if (blobLibrary) {
          wallpaperClient.addBlob(tx, blobLibrary?.id, blobId);
        } else {
          messageApi.warning("Please select library.");
        }
      }
      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: async (result) => {
            messageApi.success(`Success: ${result.digest}`);
            cleanData();
          },
          onError: ({ message }) => {
            messageApi.error(message);
          },
        },
      );
    } catch (e: any) {
      messageApi.error(e.message);
    }
  };

  const cleanData = () => {
    setImage(null);
    setImageName("");
    setOpen(false);
  };

  const getBlobLibrary = async () => {
    if (account) {
      const res = await suiClient.getOwnedObjects({
        owner: account.address,
        options: {
          showContent: true,
        },
        filter: {
          StructType: `${PACKAGE_ID}::wallpaper::BlobLibrary`,
        },
      });
      const allObjects: Array<SuiObjectResponse> = res.data;
      const blobLibraries = await formatBlobLibrary(allObjects);
      setBlobLibraries(blobLibraries);
    }
  };

  const formatBlobLibrary = async (
    allObjects: Array<SuiObjectResponse>,
  ): Promise<Array<BlobLibrary>> => {
    return allObjects.map((object) => {
      const content = object.data?.content;
      // @ts-ignore
      const fields = content?.fields as unknown as {
        id: { id: string };
        name: any;
        owner: string;
        blobs: Array<any>;
        b36addr: string;
      };
      const decoder = new TextDecoder("utf-8");
      return {
        id: fields.id.id,
        name: decoder.decode(new Uint8Array(fields.name)),
      };
    });
  };

  const defaultProps = {
    options: blobLibraries,
    getOptionLabel: (option: BlobLibrary) => option.name,
  };

  useEffect(() => {
    getBlobLibrary();
  }, [account]);

  const render = () => {
    if (blobLibraries && blobLibraries.length > 0) {
      return (
        <>
          <DialogTitle>Upload a picture</DialogTitle>
          <DialogContent
            sx={{
              "@media (min-width: 640px)": {
                width: "500px",
              },
            }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-12">
              <div>Library</div>
              <div>
                {/* @ts-ignore */}
                <Autocomplete
                  {...defaultProps}
                  id="controlled-demo"
                  value={blobLibrary}
                  onChange={(event: any, newValue: BlobLibrary | null) => {
                    setBlobLibrary(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        backgroundColor: "transparent", // 设置输入框背景为透明
                        // height: '35px', // 保持输入框高度
                        "& .MuiInputBase-root": {
                          backgroundColor: "transparent", // 内部元素也透明
                          height: "100%", // 确保填充整个高度
                          color: "black", // 设置输入框内文字颜色
                        },
                        // '& .MuiOutlinedInput-notchedOutline': {
                        //   borderColor: 'black', // 去掉边框颜色
                        // },
                        // '&:hover .MuiOutlinedInput-notchedOutline': {
                        //   borderColor: '#40cafd', // 鼠标悬浮时边框颜色
                        // },
                        // '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        //   borderColor: '#40cafd', // 聚焦时边框颜色
                        // },
                      }}
                    />
                  )}
                  sx={{
                    width: "300px", // 设置宽度为 300px
                    // height: '35px', // 设置高度为 35px
                    "& .MuiAutocomplete-listbox": {
                      backgroundColor: "white", // 设置下拉框的背景色
                      color: "black", // 设置下拉项的文字颜色
                    },
                    "& .MuiAutocomplete-option": {
                      "&:hover": {
                        backgroundColor: "lightgray", // 设置悬浮时的背景色
                      },
                    },
                    "@media (max-width: 640px)": {
                      width: "200px", // 屏幕宽度小于 640px 时，宽度改为 200px
                    },
                    "& .MuiAutocomplete-endAdornment": {
                      "& .MuiSvgIcon-root": {
                        color: "black", // 设置下拉三角形颜色
                      },
                    },
                  }}
                  fullWidth={false} // 禁用默认的 fullWidth 以应用自定义宽度
                />
              </div>
            </div>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={imageName}
              onChange={handleImageNameChange}
              margin="normal"
            />
            <TextField
              label="Epochs"
              variant="outlined"
              fullWidth
              value={epochs}
              onChange={handleEpochs}
              margin="normal"
            />
            <Input
              type="file"
              fullWidth
              onChange={handleImageChange}
              inputProps={{ accept: "image/*" }}
              margin="none"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              cancel
            </Button>
            <Button onClick={handleUpload} color="primary">
              upload
            </Button>
          </DialogActions>
        </>
      );
    } else {
      return (
        <>
          <DialogTitle>Upload a picture</DialogTitle>
          <DialogContent
            sx={{
              "@media (min-width: 640px)": {
                width: "500px",
              },
            }}
          >
            <div>You need to create a library before uploading images.</div>
            <TextField
              label="Library Name"
              variant="outlined"
              fullWidth
              value={libraryName}
              onChange={handleLibraryName}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              cancel
            </Button>
            <Button onClick={handleCreate} color="primary">
              create
            </Button>
          </DialogActions>
        </>
      );
    }
  };

  return (
    <div>
      {contextHolder}
      <Button
        variant="contained"
        color="primary"
        startIcon={<UploadIcon />}
        onClick={handleClickOpen}
      >
        Upload
      </Button>
      <Dialog open={open} onClose={handleClose}>
        {render()}
      </Dialog>
    </div>
  );
};

export default ImageUploadDialog;
