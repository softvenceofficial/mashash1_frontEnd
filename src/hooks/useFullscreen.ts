import { useState, useEffect, type RefObject } from "react";

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

export function useFullscreen(elementRef?: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const el = elementRef?.current || document.documentElement;
    if (!el) return;
    const element = el as TFullscreenElement;
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
      const isFull = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isFull);
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
