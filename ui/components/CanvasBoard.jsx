import React, { useCallback, useEffect, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { NFTStorage, File } from "nft.storage";

import Toolbar from "./Toolbar";
import { combineDrawing } from "../helpers/functions";
import { ABI } from "../abi/SnapDrawABI";
import MintModal from "./MintModal";
import { useAccount, useContract, useSigner } from "wagmi";
import toast from "react-hot-toast";

const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;

const Canvas = () => {
  const canvasRef = useRef(null);
  const [{ data: signer }] = useSigner();
  const [{ data: accountData }] = useAccount();
  const [loading, setLoading] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [nftMeta, setNftMeta] = useState({
    name: "My Art 1",
    description: "Created via SnapDraw",
  });
  const contract = useContract({
    addressOrName: "0x0C583BAe7E98555c09650e8f2FCD339AE711Bd0F",
    contractInterface: ABI,
    signerOrProvider: signer,
  });
  const [properties, setProperties] = useState({
    brushColor: "#000000",
    backgroundColor: "#ffffff",
    brushRadius: 4,
    lazyRadius: 1,
    imgSrc: "",
  });

  useEffect(() => {
    if (
      localStorage.getItem("savedProperties") &&
      typeof localStorage.getItem("savedProperties") === "string"
    ) {
      setProperties(JSON.parse(localStorage.getItem("savedProperties")));
    }
    if (localStorage.getItem("savedDrawing") && canvasRef.current)
      canvasRef.current.loadSaveData(localStorage.getItem("savedDrawing"));
  }, []);

  useEffect(() => {
    autoSave();
    localStorage.setItem("savedProperties", JSON.stringify(properties));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties]);

  const autoSave = useCallback(() => {
    localStorage.setItem("savedDrawing", canvasRef.current.getSaveData());
    localStorage.setItem("savedProperties", JSON.stringify(properties));
  }, [properties]);

  const uploadMeta = async () => {
    if (nftMeta.name.trim() === "" || nftMeta.description.trim() === "") {
      return toast.error("Name and Description is required");
    }
    setLoading(true);
    const { blob } = combineDrawing(canvasRef);
    const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
    const imageFile = new File([blob], "snapdraw.png", {
      type: "image/png",
    });
    const metadata = await client.store({
      name: nftMeta.name,
      description: nftMeta.description,
      image: imageFile,
      attributes: [{ trait_type: "Drawing", value: "Hand Drawing" }],
    });
    mint(metadata);
  };

  const mint = async (metadata) => {
    try {
      const txn = await contract.safeMint(accountData.address, metadata.url);
      await txn.wait();
      let mints = [];
      if (localStorage.getItem("recentMints"))
        mints = JSON.parse(localStorage.getItem("recentMints"));
      mints.push({
        name: nftMeta.name,
        hash: txn.hash,
        image: metadata.data.image.pathname,
      });
      localStorage.setItem("recentMints", JSON.stringify(mints));
    } catch (error) {
      toast.error(error.message);
      console.log("🚀 ~ file: CanvasBoard.jsx ~ mint ~ error", error);
    }
    setLoading(false);
    setNftMeta({ name: "", description: "" });
    setShowMintModal(false);
  };

  return (
    <div className="w-full">
      <Toolbar
        canvasRef={canvasRef}
        properties={properties}
        setProperties={setProperties}
        autoSave={autoSave}
        readyToMint={() => setShowMintModal(true)}
        loading={loading}
      />
      {showMintModal && (
        <MintModal
          nftMeta={nftMeta}
          setNftMeta={setNftMeta}
          canvasRef={canvasRef}
          setShowMintModal={(bool) => setShowMintModal(bool)}
          uploadMeta={() => uploadMeta()}
          loading={loading}
        />
      )}
      <div className="grid h-screen place-items-center">
        <CanvasDraw
          imgSrc={properties.imgSrc}
          brushRadius={properties.brushRadius}
          brushColor={properties.brushColor}
          backgroundColor={properties.backgroundColor}
          onChange={() => autoSave()}
          hideGrid
          enablePanAndZoom
          ref={canvasRef}
          canvasHeight={612}
          canvasWidth={612}
          lazyRadius={properties.lazyRadius}
          className="!mx-auto !my-auto !border !border-gray-300"
        />
      </div>
    </div>
  );
};

export default Canvas;
