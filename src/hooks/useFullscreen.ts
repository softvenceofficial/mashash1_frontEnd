import { useState, useEffect } from "react";

type TFullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
};

type TFullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
};

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const element = document.documentElement as TFullscreenElement;
    const doc = document as TFullscreenDocument;

    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const doc = document as TFullscreenDocument;

    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(
          doc.fullscreenElement ||
          doc.webkitFullscreenElement ||
          doc.mozFullScreenElement ||
          doc.msFullscreenElement
        )
      );
    };

    doc.addEventListener("fullscreenchange", handleFullscreenChange);
    doc.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    doc.addEventListener("mozfullscreenchange", handleFullscreenChange);
    doc.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      doc.removeEventListener("fullscreenchange", handleFullscreenChange);
      doc.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      doc.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      doc.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  return { isFullscreen, toggleFullscreen };
}
