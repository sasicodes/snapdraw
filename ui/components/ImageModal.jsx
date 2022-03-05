import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { FiCamera, FiUpload } from "react-icons/fi";
import { AiOutlineCheck } from "react-icons/ai";
import Webcam from "react-webcam";

export default function ImageModal({ setIsOpen, setProperties, properties }) {
  const webcamRef = useRef(null);

  const [image, setImage] = useState("");
  const [cropper, setCropper] = useState();
  const [showCamera, setShowCamera] = useState(false);

  const addImage = () => {
    setProperties({
      ...properties,
      imgSrc: cropper.getCroppedCanvas().toDataURL(),
    });
    setIsOpen(false);
  };

  const handleUpload = async (evt) => {
    evt.preventDefault();
    let files = evt.target.files;
    if (files && files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (e) => {
        setImage(e.target.result);
      };
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef, setImage]);

  return (
    <Transition appear show as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => setIsOpen(false)}
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
            <Dialog.Overlay className="fixed inset-0 bg-gray-700 opacity-80" />
          </Transition.Child>
          <span
            className="inline-block h-screen align-middle"
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
            <div className="inline-block w-full max-w-4xl p-5 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow ring-1 ring-gray-200 rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Add Image
              </Dialog.Title>
              <div className="my-4">
                <div className="flex space-x-2">
                  {showCamera ? (
                    <div className="relative flex w-1/2 mx-auto">
                      <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="flex-1 rounded-lg outline-none h-44"
                      />
                      <button
                        onClick={() => capture()}
                        className="bottom-2 left-[50%] absolute p-1.5 bg-green-300 rounded-lg"
                      >
                        <AiOutlineCheck />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCamera(true)}
                      className="grid w-1/2 rounded-lg outline-none place-items-center bg-gray-50 h-44"
                    >
                      <span className="flex items-center">
                        <FiCamera className="mr-1.5" />
                        Capture
                      </span>
                    </button>
                  )}
                  <label className="flex items-center justify-center w-1/2 rounded-lg cursor-pointer bg-gray-50 h-44">
                    <FiUpload className="mr-1.5" />
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      className="hidden"
                      onChange={handleUpload}
                    />
                    Upload
                  </label>
                </div>
                {image && (
                  <div className="mt-4">
                    <Cropper
                      style={{ height: 400, width: "100%", borderRadius: 10 }}
                      zoomTo={0.5}
                      initialAspectRatio={1}
                      cropBoxResizable={false}
                      dragMode={false}
                      cropBoxMovable
                      src={image}
                      viewMode={1}
                      minCropBoxHeight={10}
                      minCropBoxWidth={10}
                      background={false}
                      responsive={true}
                      autoCropArea={1}
                      checkOrientation={false}
                      onInitialized={(instance) => {
                        setCropper(instance);
                      }}
                      guides={true}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                  onClick={() => addImage()}
                >
                  Add Image
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
