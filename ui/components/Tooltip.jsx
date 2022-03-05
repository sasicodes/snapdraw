import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

import Tippy from "@tippyjs/react";
import React from "react";

const Tooltip = ({ children, content, placement = "top", ...props }) => {
  return (
    <Tippy
      {...props}
      placement={placement}
      content={content}
      arrow={false}
      className="font-semibold"
      theme={"light"}
    >
      {children}
    </Tippy>
  );
};

export default Tooltip;
