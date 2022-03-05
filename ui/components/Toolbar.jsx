import React, { useState } from "react";
import { MdUndo } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";
import { CgSoftwareDownload } from "react-icons/cg";
import { RiImageAddLine } from "react-icons/ri";
import { BiReset } from "react-icons/bi";
import { SiOpenmined } from "react-icons/si";
import { MdOutlineExplore } from "react-icons/md";
import { useRouter } from "next/router";

import Tooltip from "./Tooltip";
import shortenAddress, {
  combineDrawing,
  saveImage,
} from "../helpers/functions";
import ImageModal from "./ImageModal";
import { useAccount, useConnect, useNetwork } from "wagmi";
import Link from "next/link";

const Toolbar = ({
  canvasRef,
  setProperties,
  properties,
  readyToMint,
  loading,
}) => {
  let [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [
    {
      data: { connectors },
    },
    connect,
  ] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount();
  const [{ data: networkData }, switchNetwork] = useNetwork();

  const router = useRouter();

  return (
    <div className="fixed flex items-center justify-between w-full p-3">
      <div className="z-10 flex items-center gap-2">
        {isImageModalOpen && (
          <ImageModal
            setProperties={setProperties}
            properties={properties}
            setIsOpen={setIsImageModalOpen}
          />
        )}
        <Tooltip content="Undo">
          <button
            className="p-2 bg-gray-200 rounded-md focus:outline-none"
            onClick={() => canvasRef.current?.undo()}
          >
            <MdUndo />
          </button>
        </Tooltip>
        <Tooltip content="Add image">
          <button
            type="button"
            className="p-2 bg-gray-200 rounded-md focus:outline-none"
            onClick={() => setIsImageModalOpen(true)}
          >
            <RiImageAddLine />
          </button>
        </Tooltip>
        <Tooltip content="Clear All">
          <button
            className="p-2 bg-gray-200 rounded-md focus:outline-none"
            onClick={() => {
              if (window.confirm("This will clear all your current work."))
                canvasRef.current.eraseAll();
            }}
          >
            <AiOutlineClear />
          </button>
        </Tooltip>
        <Tooltip content="Reset to defaults">
          <button
            className="p-2 bg-gray-200 rounded-md focus:outline-none"
            onClick={() => {
              if (window.confirm("Are you sure want to reset the canvas?")) {
                localStorage.removeItem("savedDrawing");
                localStorage.removeItem("savedProperties");
                router.reload(window.location.pathname);
              }
            }}
          >
            <BiReset />
          </button>
        </Tooltip>
        <Tooltip content="Download">
          <button
            className="p-2 bg-gray-200 rounded-md cursor-pointer focus:outline-none"
            onClick={() => {
              const { blob } = combineDrawing(canvasRef);
              saveImage(blob, "drawing.png");
            }}
          >
            <CgSoftwareDownload />
          </button>
        </Tooltip>
        <Tooltip content="Backgroud Color">
          <input
            type="color"
            className="h-8 rounded-md"
            value={properties.backgroundColor}
            onChange={(e) =>
              setProperties({ ...properties, backgroundColor: e.target.value })
            }
          />
        </Tooltip>
        <Tooltip content="Brush Color">
          <input
            type="color"
            className="h-8 rounded-md"
            value={properties.brushColor}
            onChange={(e) =>
              setProperties({ ...properties, brushColor: e.target.value })
            }
          />
        </Tooltip>
        <Tooltip content="Brush Radius">
          <input
            type="range"
            min="1"
            step="1"
            max="20"
            value={properties.brushRadius}
            onChange={(e) =>
              setProperties({ ...properties, brushRadius: e.target.value })
            }
            className="h-1 bg-blue-100 rounded-md appearance-none"
          />
        </Tooltip>
      </div>
      <div className="items-center hidden gap-2 md:flex">
        {accountData?.address && !networkData?.chain?.unsupported && (
          <Link href="/explore">
            <a className="flex items-center px-4 py-2 text-xs rounded-md bg-orange-50">
              <MdOutlineExplore className="mr-1 text-sm" />
              Explore
            </a>
          </Link>
        )}
        {accountData?.address && !networkData?.chain?.unsupported && (
          <button
            className="flex items-center px-4 py-2 text-xs rounded-md focus:outline-none bg-green-50"
            onClick={() => readyToMint()}
            disabled={loading}
          >
            <SiOpenmined className="mr-1" />
            Mint
          </button>
        )}
        <button
          className={`px-4 py-2 text-xs bg-gray-200 rounded-md ${
            networkData?.chain?.unsupported && "bg-red-400"
          }`}
          onClick={() =>
            accountData?.address
              ? networkData.chain?.unsupported && switchNetwork
                ? switchNetwork(80001)
                : disconnect()
              : connect(connectors[0])
          }
        >
          {accountData?.address && !networkData.chain?.unsupported ? (
            <span>
              {accountData?.ens?.name || shortenAddress(accountData?.address)}
            </span>
          ) : networkData.chain?.unsupported && switchNetwork ? (
            "Switch Network"
          ) : (
            "Connect Wallet"
          )}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
