/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { BsArrowLeftShort } from "react-icons/bs";
import { BiLinkExternal } from "react-icons/bi";
import client from "../helpers/apollo-client";
import { gql } from "@apollo/client";
import { NFT_CONTRACT_ADDRESS } from "../helpers/constants";

const Recents = ({ mints }) => {
  return (
    <div className="h-screen bg-fixed bg-image">
      <div className="container max-w-2xl px-3 py-10 mx-auto">
        <Link href="/">
          <a className="inline-flex items-center text-xs hover:underline hover:text-indigo-400">
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
              <div className="flex flex-wrap items-center justify-between w-full gap-2">
                <div className="flex flex-col truncate">
                  <span className="text-xs font-semibold opacity-75">
                    Owner
                  </span>
                  <a
                    rel="noreferrer"
                    className="text-sm text-indigo-800 truncate"
                    href={`https://mumbai.polygonscan.com/address/${mint.to}`}
                  >
                    {mint.to}
                  </a>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold opacity-75">
                    Token
                  </span>
                  <span className="text-sm text-indigo-800">
                    {mint.tokenId}
                  </span>
                </div>
                <a
                  title="View on Opensea"
                  href={`https://testnets.opensea.io/assets/mumbai/${NFT_CONTRACT_ADDRESS}/${mint.tokenId}`}
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

const listQuery = gql`
  query ($owner: String) {
    transfers(first: 20, orderBy: tokenId, orderDirection: desc) {
      id
      from
      to
      tokenId
    }
  }
`;

export async function getStaticProps() {
  const { data } = await client.query({
    query: listQuery,
  });

  return {
    props: {
      mints: data.transfers,
    },
    revalidate: 86400 * 1, //  daily
  };
}
