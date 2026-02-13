import { useGetStylesQuery } from '@/redux/endpoints/bookApi';
import { Loader2 } from 'lucide-react';

interface AIImageTypeProps {
  onStyleSelect: (styleId: number) => void;
  selectedStyleId: number;
}

const AIImageType = ({ onStyleSelect, selectedStyleId }: AIImageTypeProps) => {
  const { data: styleData, isLoading } = useGetStylesQuery();

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
            {styleData?.data?.map((style) => (
              <button
                key={style.id}
                onClick={() => onStyleSelect(style.id)}
                className={`group relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedStyleId === style.id ? 'border-text' : 'border-transparent hover:border-zinc-600'
                }`}
              >
                <img 
                  src={style.image || ''} 
                  alt={style.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />

                <div className={`absolute  left-0 right-0 bg-lime-400 py-1 px-1 transition-all duration-300 ${
                  selectedStyleId === style.id ? 'bottom-[0px]' : 'bottom-[-50px]'
                }`}>
                  <p className="text-[9px] font-bold text-zinc-900 truncate text-center uppercase tracking-tighter">
                    {style.name}
                  </p>
                </div>

                {selectedStyleId === style.id && (
                  <div className="absolute inset-0 bg-lime-400/10 pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000000;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #818cf8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6366F1;
        }
      `}</style>
    </div>
  );
};

export default AIImageType;