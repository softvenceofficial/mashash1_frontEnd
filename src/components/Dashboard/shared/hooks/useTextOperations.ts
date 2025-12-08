import type { PageData, TextType } from "../types/book.types";

export const useTextOperations = (pages: PageData[], setPages: (pages: PageData[]) => void) => {
  const updateText = (textId: string, attrs: Partial<TextType>) => {
    const newPages = pages.map((page) => {
      const textIndex = page.texts.findIndex((t) => t.id === textId);
      if (textIndex !== -1) {
        const newTexts = [...page.texts];
        newTexts[textIndex] = { ...newTexts[textIndex], ...attrs };
        return { ...page, texts: newTexts };
      }
      return page;
    });
    setPages(newPages);
  };

  const deleteText = (textId: string) => {
    const newPages = pages.map((page) => ({
      ...page,
      texts: page.texts.filter((t) => t.id !== textId),
    }));
    setPages(newPages);
  };

  const duplicateText = (textId: string) => {
    const newPages = pages.map((page) => {
      const textItem = page.texts.find((t) => t.id === textId);
      if (textItem) {
        const newText = {
          ...textItem,
          id: Date.now().toString(),
          x: textItem.x + 20,
          y: textItem.y + 20,
        };
        return { ...page, texts: [...page.texts, newText] };
      }
      return page;
    });
    setPages(newPages);
  };

  const toggleLock = (textId: string) => {
    const newPages = pages.map((page) => {
      const textIndex = page.texts.findIndex((t) => t.id === textId);
      if (textIndex !== -1) {
        const newTexts = [...page.texts];
        newTexts[textIndex].locked = !newTexts[textIndex].locked;
        return { ...page, texts: newTexts };
      }
      return page;
    });
    setPages(newPages);
  };

  const toggleVisibility = (textId: string) => {
    const newPages = pages.map((page) => {
      const textIndex = page.texts.findIndex((t) => t.id === textId);
      if (textIndex !== -1) {
        const newTexts = [...page.texts];
        newTexts[textIndex].visible = newTexts[textIndex].visible === false ? true : false;
        return { ...page, texts: newTexts };
      }
      return page;
    });
    setPages(newPages);
  };

  const moveLayer = (textId: string, direction: "up" | "down") => {
    const newPages = pages.map((page) => {
      const textIndex = page.texts.findIndex((t) => t.id === textId);
      if (textIndex !== -1) {
        const newTexts = [...page.texts];
        if (direction === "up" && textIndex < newTexts.length - 1) {
          [newTexts[textIndex], newTexts[textIndex + 1]] = [
            newTexts[textIndex + 1],
            newTexts[textIndex],
          ];
        } else if (direction === "down" && textIndex > 0) {
          [newTexts[textIndex], newTexts[textIndex - 1]] = [
            newTexts[textIndex - 1],
            newTexts[textIndex],
          ];
        }
        return { ...page, texts: newTexts };
      }
      return page;
    });
    setPages(newPages);
  };

  return {
    updateText,
    deleteText,
    duplicateText,
    toggleLock,
    toggleVisibility,
    moveLayer,
  };
};
