import { useGetStylesQuery } from '@/redux/endpoints/bookApi';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface AIImageTypeProps {
  onStyleSelect: (styleId: number) => void;
  selectedStyleId: number | null;
}

const AIImageType = ({ onStyleSelect, selectedStyleId }: AIImageTypeProps) => {
  const { data: styleData, isLoading } = useGetStylesQuery();

  // Ensure a default style is ALWAYS selected when data loads
  useEffect(() => {
    if (styleData?.data && styleData.data.length > 0) {
      
      // 1. Check if the currently selected ID actually exists in our fetched list
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isValidSelection = styleData.data.some((style: any) => style.id === selectedStyleId);
      
      // 2. If nothing is selected, OR the selected ID is invalid (e.g., initial state is 0)
      if (!selectedStyleId || !isValidSelection) {
        
        // 3. Set the FIRST style as the default selection (you can also use Math.random() here if you prefer random)
        const defaultStyleId = styleData.data[0].id;
        
        // 4. Update the parent state only if it's different (prevents infinite re-renders)
        if (selectedStyleId !== defaultStyleId) {
          onStyleSelect(defaultStyleId);
        }
      }
    }
  }, [styleData, selectedStyleId, onStyleSelect]);

  return (
    <div className="w-full rounded-xl flex flex-col items-center py-4 px-3 select-none" style={{height: "calc(100vh - 100px)"}}>
      <h4 className="text-white text-[20px] font-semibold font-Inter text-center mb-4 leading-tight">
        Select your style
      </h4>

      {isLoading ? (
        <div className="w-full flex-1 flex flex-col items-center justify-center gap-2 text-zinc-400">
          <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
          <span className="text-sm">Loading styles...</span>
        </div>
      ) : (
        <div className="w-full flex-1 overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
          <div className="flex flex-col gap-3">
            {styleData?.data?.map((style: any) => (
              <button
                key={style.id}
                onClick={() => onStyleSelect(style.id)}
                className={`group relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedStyleId === style.id ? 'border-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.3)]' : 'border-transparent hover:border-zinc-600'
                }`}
              >
                <img 
                  src={style.image || ''} 
                  alt={style.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />

                <div className={`absolute left-0 right-0 bg-lime-400 py-1 px-1 transition-all duration-300 ${
                  selectedStyleId === style.id ? 'bottom-[0px]' : 'bottom-[-50px]'
                }`}>
                  <p className="text-[10px] font-bold text-zinc-900 truncate text-center uppercase tracking-tighter">
                    {style.name}
                  </p>
                </div>

                {selectedStyleId === style.id && (
                  <div className="absolute inset-0 bg-lime-400/20 pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #818CF8;
        }
      `}</style>
    </div>
  );
};

export default AIImageType;