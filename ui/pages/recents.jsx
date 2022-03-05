/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { BiLinkExternal } from "react-icons/bi";

const Recents = () => {
  const [mints, setMints] = useState([]);
  useEffect(() => {
    if (localStorage.getItem("recentMints")) {
      setMints(JSON.parse(localStorage.getItem("recentMints")));
    }
  }, []);

  return (
    <div className="container h-screen max-w-2xl p-3 mx-auto md:py-10">
      <div>
        <Link href="/">
          <a className="flex items-center text-xs hover:underline hover:text-indigo-400">
            <BsArrowLeftShort className="mr-1" />
            Back
          </a>
        </Link>
        <h1 className="text-2xl font-semibold">Recent Mints</h1>
        <div className="mt-10 space-y-2">
          {mints.map((mint, idx) => (
            <div
              key={idx}
              className="flex p-4 space-x-4 bg-gray-100 rounded-lg"
            >
              <img
                src={`https://cloudflare-ipfs.com/ipfs${mint.image}`}
                alt=""
                className="w-10 h-10"
              />
              <div className="flex items-center justify-between w-full">
                <h6>{mint.name}</h6>
                <a
                  href={`https://mumbai.polygonscan.com/tx/${mint.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-sm bg-white rounded-md"
                >
                  <BiLinkExternal />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recents;
