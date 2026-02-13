/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Tools from "@/components/Dashboard/Tools/Tools";
import Toolbox, { DrawingMode } from "@/components/Dashboard/Toolbox/Toolbox";
import AIImageBox from "@/components/Dashboard/AI-Image-box/AIImageBox";
import Book from "@/components/Dashboard/Book/Book";
import AIImageType from "@/components/Dashboard/AI-Image-TypeBox/AIImageType";
import { SiteHeader } from "@/components/Dashboard/DashboardHeader";
import { useToolState } from "@/hooks/useToolState";
import { keyboardManager } from "@/utils/KeyboardManager";
import { HelpOverlay } from "@/components/Dashboard/HelpOverlay";
import { useCreateBookMutation, useGetBookDetailsQuery, useUpdateBookMutation } from "@/redux/endpoints/bookApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import type { PageData } from "@/components/Dashboard/Book/types";
import { fetchBookContent, processBookData } from "@/utils/bookDataLoader";

export default function Creator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateToolColor, getToolColor } = useToolState();
  const [activeTool, setActiveTool] = useState("Book Size");
  const [activeSubTool, setActiveSubTool] = useState("select");
  const [selectedBookSize, setSelectedBookSize] = useState("6 x 4");
  const [selectedStyleId, setSelectedStyleId] = useState(2);
  const [selectedSizeId, setSelectedSizeId] = useState(6);
  const [strokeColor, setStrokeColor] = useState(getToolColor("Text"));
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Roboto");
  const [drawingMode, setDrawingMode] = useState<DrawingMode>(
    DrawingMode.BRUSH,
  );
  const [zoom, setZoom] = useState(1);
  const [tableProperties, setTableProperties] = useState<any>(null);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState("rectangle");
  const [shapeProperties, setShapeProperties] = useState({
    fillColor: "#1e3a8a",
    strokeColor: "#60a5fa",
    strokeWidth: 2,
    isFillTransparent: false,
  });
  const [loadedPages, setLoadedPages] = useState<PageData[] | null>(null);
  const bookRef = useRef<any>(null);

  const [createBook, { isLoading: isSaving }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const { data: bookDetails, isLoading: isLoadingBook } = useGetBookDetailsQuery(id || "", { skip: !id });

  useEffect(() => {
    const loadBookData = async () => {
      if (bookDetails?.data?.file) {
        try {
          const data = await fetchBookContent(bookDetails.data.file);
          const processedData = processBookData(data);
          setLoadedPages(processedData);
          toast.success("Book data loaded successfully!");
        } catch (err) {
          console.error("Error loading book JSON:", err);
          toast.error(err instanceof Error ? err.message : "Failed to load saved book data");
        }
      }
    };

    loadBookData();
  }, [bookDetails]);

  // Save book function
  const handleSaveBook = async () => {
    if (!bookRef.current) return;

    try {
      const pagesData = bookRef.current.getPageData();
      
      const processedPages = pagesData.map((page: PageData) => ({
        lines: page.lines || [],
        texts: page.texts || [],
        shapes: page.shapes || [],
        images: (page.images || []).map((img: any) => ({
          ...img,
          _type: 'image',
          type: 'image'
        })),
        stickyNotes: page.stickyNotes || [],
        tables: page.tables || [],
        background: page.background || null
      }));

      const jsonString = JSON.stringify(processedPages);
      const jsonFile = new File([jsonString], "book_data.json", { type: "application/json" });

      let coverBlob: Blob | null = null;
      
      try {
        const stageElement = document.querySelector('.konvajs-content canvas');
        if (stageElement) {
          coverBlob = await new Promise<Blob>((resolve, reject) => {
            (stageElement as HTMLCanvasElement).toBlob((blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Could not generate cover'));
            }, 'image/png');
          });
        }
      } catch (err) {
        console.warn("Could not generate cover image:", err);
      }

      const formData = new FormData();
      const bookTitle = bookDetails?.data?.title || `Artbook ${new Date().toLocaleDateString()}`;
      const isUpdate = !!id;
      
      formData.append("title", bookTitle);
      formData.append("file", jsonFile);
      
      if (coverBlob && coverBlob.size > 0) {
        formData.append("cover_image", coverBlob, "cover.png");
      }

      let response;
      if (isUpdate) {
        response = await updateBook({ id: parseInt(id!), data: formData }).unwrap();
        toast.success("Book updated successfully!");
      } else {
        response = await createBook(formData).unwrap();
        toast.success("Book saved successfully!");
      }
      
      if (response?.data?.id) {
        navigate(`/Creator/${response.data.id}`, { replace: true });
      } else {
        navigate("/Dashboard");
      }
    } catch (error) {
      console.error("Failed to save book:", error);
      toast.error("Failed to save book");
    }
  };

  // Restore tool color when switching tools
  useEffect(() => {
    const savedColor = getToolColor(activeTool);
    if (savedColor) {
      setStrokeColor(savedColor);
    }
  }, [activeTool, getToolColor]);

  // Save color when it changes
  const handleStrokeColorChange = (color: string) => {
    setStrokeColor(color);
    updateToolColor(activeTool, color);
  };

  // Setup keyboard shortcuts
  useEffect(() => {
    keyboardManager.register("ctrl+z", (e) => {
      e.preventDefault();
      bookRef.current?.undo();
    });
    keyboardManager.register("ctrl+shift+z", (e) => {
      e.preventDefault();
      bookRef.current?.redo();
    });
    keyboardManager.register("ctrl+y", (e) => {
      e.preventDefault();
      bookRef.current?.redo();
    });
    keyboardManager.register("escape", () => {
      setActiveSubTool("select");
    });
    keyboardManager.register("space", (e) => {
      e.preventDefault();
      setActiveSubTool((prev) => (prev === "hand" ? "select" : "hand"));
    });
    keyboardManager.register("ctrl+=", (e) => {
      e.preventDefault();
      setZoom((prev) => Math.min(3, prev + 0.1));
    });
    keyboardManager.register("ctrl+-", (e) => {
      e.preventDefault();
      setZoom((prev) => Math.max(0.5, prev - 0.1));
    });

    return () => {
      keyboardManager.clear();
    };
  }, []);

  // Update table properties when table selection changes
  const updateTableProperties = () => {
    if (bookRef.current?.getSelectedTableProperties) {
      const props = bookRef.current.getSelectedTableProperties();
      setTableProperties(props);
    }
    if (bookRef.current?.getSelectedTableId) {
      const id = bookRef.current.getSelectedTableId();
      setSelectedTableId(id);
    }
  };

  const handleAdvancedTextChange = (property: string, value: any) => {
    if ((window as any).__handleAdvancedTextChange) {
      (window as any).__handleAdvancedTextChange(property, value);
    }
  };

  const handleImageUpload = (
    file: File,
    targetPage?: "left" | "right" | "current",
  ) => {
    if (bookRef.current?.handleImageUpload) {
      bookRef.current.handleImageUpload(file, targetPage);
    }
  };

  const handlePenOptionChange = (property: string, value: any) => {
    if (bookRef.current?.handlePenOptionChange) {
      bookRef.current.handlePenOptionChange(property, value);
    }
  };

  const handlePenAction = (action: string) => {
    if (bookRef.current?.handlePenAction) {
      bookRef.current.handlePenAction(action);
    }
  };

  const handleTableChange = (property: string, value: any) => {
    if (bookRef.current?.handleTableChange) {
      bookRef.current.handleTableChange(property, value);
      // Update local state after change
      setTimeout(updateTableProperties, 50);
    }
  };

  const handleShapePropertiesChange = (properties: any) => {
    setShapeProperties((prev) => ({ ...prev, ...properties }));
  };

  return (
    <div className="relative">
      <SiteHeader>
        <Button onClick={handleSaveBook} disabled={isSaving || isUpdating || isLoadingBook} className="ml-auto">
          {(isSaving || isUpdating) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {id ? "Updating..." : "Saving..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {id ? "Update Artbook" : "Save Artbook"}
            </>
          )}
        </Button>
      </SiteHeader>
      <div className="flex gap-4 mt-2" style={{ height: "calc(100vh - 80px)" }}>
        <div className="w-[23.3%]">
          <Tools activeTool={activeTool} setActiveTool={setActiveTool} />
          <AIImageBox 
            bookId={id ? parseInt(id) : null}
            selectedStyleId={selectedStyleId}
            selectedSizeId={selectedSizeId}
            existingImages={bookDetails?.data?.images}
          />
        </div>
        <div className="w-[63.8%]">
          <Toolbox
            activeTool={activeTool}
            activeSubTool={activeSubTool}
            onToolChange={setActiveSubTool}
            onBookSizeChange={setSelectedBookSize}
            selectedSizeId={selectedSizeId}
            onSizeSelect={setSelectedSizeId}
            onStrokeColorChange={handleStrokeColorChange}
            onStrokeWidthChange={setStrokeWidth}
            onFontSizeChange={setFontSize}
            onFontFamilyChange={setFontFamily}
            onShapeChange={setSelectedShape}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            undo={bookRef.current?.undo}
            redo={bookRef.current?.redo}
            canUndo={bookRef.current?.canUndo}
            canRedo={bookRef.current?.canRedo}
            updatePageData={bookRef.current?.updatePageData}
            currentPageIndex={bookRef.current?.currentPageIndex}
            onAdvancedTextChange={handleAdvancedTextChange}
            drawingMode={drawingMode}
            onDrawingModeChange={setDrawingMode}
            onZoomChange={setZoom}
            currentZoom={zoom}
            onImageUpload={handleImageUpload}
            onPenOptionChange={handlePenOptionChange}
            onPenAction={handlePenAction}
            onTableChange={handleTableChange}
            tableProperties={tableProperties}
            selectedTableId={selectedTableId}
            onShapePropertiesChange={handleShapePropertiesChange}
          />
          <Book
            onToolChange={(tool, subTool) => {
              setActiveTool(tool);
              setActiveSubTool(subTool);
            }}
            ref={bookRef}
            activeTool={activeTool}
            activeSubTool={activeSubTool}
            selectedBookSize={selectedBookSize}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            fontSize={fontSize}
            fontFamily={fontFamily}
            onAdvancedTextChange={handleAdvancedTextChange}
            drawingMode={drawingMode}
            zoom={zoom}
            selectedShape={selectedShape}
            shapeFillColor={shapeProperties.fillColor}
            shapeStrokeColor={shapeProperties.strokeColor}
            shapeStrokeWidth={shapeProperties.strokeWidth}
            isFillTransparent={shapeProperties.isFillTransparent}
            initialData={loadedPages}
          />
        </div>
        <div
          className="w-[10.2%] bg-secondary px-3 py-4 rounded-lg overflow-hidden"
          style={{ height: "calc(100vh - 100px)" }}
        >
          <AIImageType 
            onStyleSelect={setSelectedStyleId}
            selectedStyleId={selectedStyleId}
          />
        </div>
      </div>

      {/* Global Controls - Always Visible */}

      {/* Help Overlay */}
      <HelpOverlay />
    </div>
  );
}
