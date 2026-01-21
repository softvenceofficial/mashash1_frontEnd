import style1 from '@/assets/Imagestyles/3D Pixar.jpg'
import style2 from '@/assets/Imagestyles/Kawaii.jpg'
import style3 from '@/assets/Imagestyles/Animated.jpg'
import style4 from '@/assets/Imagestyles/Lofi.jpg'
import style5 from '@/assets/Imagestyles/Gradient.jpg'
import style6 from '@/assets/Imagestyles/Watercolor.jpg'
import style7 from '@/assets/Imagestyles/Storybook.jpg'
import style8 from '@/assets/Imagestyles/Sketch.jpg'
import style9 from '@/assets/Imagestyles/Line Art.jpg'
import style10 from '@/assets/Imagestyles/Pixel Art.jpg'


const styleData = [
  { id: 1, name: "3D Pixar", type: "3D Render", img: style1 },
  { id: 2, name: "Kawaii", type: "Vector Art", img: style2 },
  { id: 3, name: "Animated", type: "3D Style", img: style3 },
  { id: 4, name: "Lofi", type: "Flat Illustration", img: style4 },
  { id: 5, name: "Gradient", type: "Abstract", img: style5 },
  { id: 6, name: "Watercolor", type: "Digital", img: style6 },
  { id: 7, name: "Storybook", type: "Whimsical", img: style7 },
  { id: 8, name: "Sketch", type: "Realism", img: style8 },
  { id: 9, name: "Line Art", type: "Coloring Book", img: style9 },
  { id: 10, name: "Pixel Art", type: "Retro Game", img: style10 },
];

interface AIImageTypeProps {
  onStyleSelect: (styleId: number) => void;
  selectedStyleId: number;
}

const AIImageType = ({ onStyleSelect, selectedStyleId }: AIImageTypeProps) => {
  return (
    <div className="w-full rounded-xl flex flex-col items-center py-4 px-3 select-none" style={{height: "calc(100vh - 100px)"}}>
      <h4 className="text-white text-[20px] font-semibold font-Inter text-center mb-4 leading-tight">
        Select your style
      </h4>

      <div className="w-full flex-1 overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
        <div className="flex flex-col gap-3">
          {styleData.map((style) => (
            <button
              key={style.id}
              onClick={() => onStyleSelect(style.id)}
              className={`group relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedStyleId === style.id ? 'border-text' : 'border-transparent hover:border-zinc-600'
              }`}
            >
              <img 
                src={style.img} 
                alt={style.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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