/* Replace all undo/redo button onClick handlers with direct function calls */

// TEXT PANEL - Line 656-677
<div className="flex items-center gap-4 ml-4 px-4 border-l border-zinc-700">
  <div className="flex flex-col items-center group cursor-pointer">
    <Button 
      size="icon" 
      variant="secondary" 
      className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
      onClick={undo}
      disabled={!canUndo}
    >
      <Undo2 className="w-5 h-5" />
    </Button>
    <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Undo</span>
  </div>
  <div className="flex flex-col items-center group cursor-pointer">
    <Button 
      size="icon" 
      variant="secondary" 
      className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
      onClick={redo}
      disabled={!canRedo}
    >
      <Redo2 className="w-5 h-5" />
    </Button>
    <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Redo</span>
  </div>
</div>

// COLOR PANEL - Line 779-800
<div className="flex items-center gap-4 ml-4 px-4">
  <div className="flex flex-col items-center group cursor-pointer">
    <Button 
      size="icon" 
      variant="secondary" 
      className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
      onClick={undo}
      disabled={!canUndo}
    >
      <Undo2 className="w-5 h-5" />
    </Button>
    <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Undo</span>
  </div>
  <div className="flex flex-col items-center group cursor-pointer">
    <Button 
      size="icon" 
      variant="secondary" 
      className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
      onClick={redo}
      disabled={!canRedo}
    >
      <Redo2 className="w-5 h-5" />
    </Button>
    <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Redo</span>
  </div>
</div>

// BRUSH PANEL - Line 1027-1038
<div className="flex gap-1">
  <ToolbarButton 
    onClick={undo}
    disabled={!canUndo}
    className={`h-8 w-8 p-0 ${!canUndo ? 'opacity-50' : ''}`}
  >
    <Undo2 className="w-4 h-4" />
  </ToolbarButton>
  <ToolbarButton 
    onClick={redo}
    disabled={!canRedo}
    className={`h-8 w-8 p-0 ${!canRedo ? 'opacity-50' : ''}`}
  >
    <Redo2 className="w-4 h-4" />
  </ToolbarButton>
</div>

// TOOL PANEL - Line 1165-1186
<div className="flex items-center gap-4 ml-4 px-4 border-l border-zinc-700">
  <div className="flex flex-col items-center group cursor-pointer">
    <Button 
      size="icon" 
      variant="secondary" 
      className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
      onClick={undo}
      disabled={!canUndo}
    >
      <Undo2 className="w-5 h-5" />
    </Button>
    <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Undo</span>
  </div>
  <div className="flex flex-col items-center group cursor-pointer">
    <Button 
      size="icon" 
      variant="secondary" 
      className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
      onClick={redo}
      disabled={!canRedo}
    >
      <Redo2 className="w-5 h-5" />
    </Button>
    <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Redo</span>
  </div>
</div>

// TABLE PANEL - Line 1283-1304
<div className="flex items-center gap-4 ml-4 px-4 border-l border-zinc-700">
  <div className="flex flex-col items-center group cursor-pointer">
    <Button 
      size="icon" 
      variant="secondary" 
      className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
      onClick={undo}
      disabled={!canUndo}
    >
      <Undo2 className="w-5 h-5" />
    </Button>
    <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Undo</span>
  </div>
  <div className="flex flex-col items-center group cursor-pointer">
    <Button 
      size="icon" 
      variant="secondary" 
      className="h-10 w-10 rounded-lg bg-[#2B2B2B] text-white hover:bg-[#333] border-none"
      onClick={redo}
      disabled={!canRedo}
    >
      <Redo2 className="w-5 h-5" />
    </Button>
    <span className="text-[10px] text-zinc-500 mt-1 font-medium group-hover:text-zinc-300">Redo</span>
  </div>
</div>

// SHAPES PANEL - Line 1445-1466
<div className="flex items-center gap-1 p-1 rounded-lg border border-zinc-800/50">
  <div className="flex flex-col items-center gap-1 group cursor-pointer w-10">
    <Button 
      size="icon" 
      variant="ghost"
      className="h-8 w-8 p-0 bg-transparent hover:bg-transparent"
      onClick={undo}
      disabled={!canUndo}
    >
      <Undo2 className="w-4 h-4 text-zinc-400 group-hover:text-white" />
    </Button>
    <span className="text-[10px] text-zinc-500 font-medium group-hover:text-zinc-300">Undo</span>
  </div>
  
  <div className="flex flex-col items-center gap-1 group cursor-pointer w-10">
    <Button 
      size="icon" 
      variant="ghost"
      className="h-8 w-8 p-0 bg-transparent hover:bg-transparent"
      onClick={redo}
      disabled={!canRedo}
    >
      <Redo2 className="w-4 h-4 text-zinc-400 group-hover:text-white" />
    </Button>
    <span className="text-[10px] text-zinc-500 font-medium group-hover:text-zinc-300">Redo</span>
  </div>
</div>
