/* eslint-disable @next/next/no-img-element */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { combineDrawing } from "../helpers/functions";

export default function MintModal({
  setShowMintModal,
  setNftMeta,
  nftMeta,
  canvasRef,
  uploadMeta,
  loading,
}) {
  const { dataUri } = combineDrawing(canvasRef);
  function closeModal() {
    setShowMintModal(false);
  }

  return (
    <Transition appear show as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-700 opacity-90" />
          </Transition.Child>
          <span
            className="inline-block h-screen align-middle "
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="mt-2">
                <div className="space-y-4">
                  <div>
                    <label>Name</label>
                    <input
                      value={nftMeta.name}
                      onChange={(e) =>
                        setNftMeta({ ...nftMeta, name: e.target.value })
                      }
                      className="w-full p-2 px-3 mt-2 rounded-md outline-none ring-gray-300 focus:ring-indigo-400 ring"
                    />
                  </div>
                  <div>
                    <label>Description</label>
                    <input
                      value={nftMeta.description}
                      onChange={(e) =>
                        setNftMeta({ ...nftMeta, description: e.target.value })
                      }
                      className="w-full p-2 px-3 mt-2 rounded-md outline-none ring-gray-300 focus:ring-indigo-400 ring"
                    />
                  </div>
                  <div>
                    <label>Preview</label>
                    <img className="mt-2 h-52" alt="" src={dataUri} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className={`${
                    !loading && "hover:bg-blue-200"
                  } inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                  onClick={() => uploadMeta()}
                  disabled={loading}
                >
                  {loading ? "Minting..." : "Mint as NFT"}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
