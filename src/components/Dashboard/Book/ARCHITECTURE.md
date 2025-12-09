# Enhanced Text Editing Architecture

## Component Hierarchy

```
Book (Main Component)
├── BookPage (Forwardref Component)
│   ├── Stage (Konva)
│   │   └── Layer
│   │       ├── Shapes (Rect, Circle)
│   │       ├── Lines (Drawing)
│   │       ├── Texts (KonvaText)
│   │       └── Transformer
│   └── Page Number
├── InPlaceTextEditor (Conditional)
├── FloatingTextToolbar (Conditional)
├── TextContextMenu (Conditional)
├── Undo/Redo Buttons
├── Zoom Controls
├── Navigation Buttons
└── Add Pages Modal
```

## Data Flow

```
User Action
    ↓
Event Handler (Book.tsx)
    ↓
State Update (useState)
    ↓
Page Data Update (updatePageData)
    ↓
History Save (useTextHistory)
    ↓
Re-render (React)
    ↓
Konva Canvas Update
```

## State Management

### Main Component State (Book.tsx)
```typescript
pages: PageData[]              // All page data
zoom: number                   // Zoom level
selectedTextId: string | null  // Currently selected text
currentPageIndex: number       // Active page
editingTextItem: TextType | null  // Text being edited
showToolbar: boolean           // Toolbar visibility
toolbarPos: { x, y }          // Toolbar position
contextMenu: { x, y } | null  // Context menu position
clipboard: TextType | null     // Copied text
```

### History State (useTextHistory)
```typescript
history: TextType[][]          // Text history stack
currentIndex: number           // Current position in history
```

## Event Flow

### Text Creation
```
1. User clicks "Text" tool
2. User clicks on canvas
3. handleMouseDown triggered
4. New TextType object created
5. Added to page.texts array
6. State updated → Re-render
7. Text appears on canvas
```

### Text Editing
```
1. User double-clicks text
2. handleTextDblClick triggered
3. editingTextItem state set
4. InPlaceTextEditor rendered
5. User types changes
6. onUpdate called on blur/Enter
7. handleTextUpdate triggered
8. Page data updated
9. History saved
10. Editor closed
```

### Text Formatting
```
1. User selects text (single click)
2. handleTextSelect triggered
3. Toolbar shown at text position
4. User clicks format button
5. onUpdate called with new properties
6. handleTextUpdate triggered
7. Text properties updated
8. Konva re-renders with new style
```

### Keyboard Shortcuts
```
1. User presses Ctrl+B (example)
2. Global keydown listener triggered
3. handleFormat('bold') called
4. Text properties toggled
5. handleTextUpdate triggered
6. Visual feedback immediate
```

### Copy/Paste
```
Copy:
1. User presses Ctrl+C
2. handleCopy triggered
3. Text copied to clipboard state

Paste:
1. User presses Ctrl+V
2. handlePaste triggered
3. New text created from clipboard
4. Positioned offset from original
5. Added to page
```

### Undo/Redo
```
Undo:
1. User presses Ctrl+Z or clicks button
2. undo() called from useTextHistory
3. Previous text state returned
4. Page data updated
5. Canvas re-renders

Redo:
1. User presses Ctrl+Y or clicks button
2. redo() called from useTextHistory
3. Next text state returned
4. Page data updated
5. Canvas re-renders
```

## Component Responsibilities

### Book.tsx (Main Component)
- **Manages**: All state, page data, user interactions
- **Handles**: Mouse events, keyboard events, page flipping
- **Coordinates**: All child components
- **Provides**: Context for text operations

### BookPage.tsx (Page Component)
- **Renders**: Single page with Konva canvas
- **Manages**: Transformer for selected text
- **Handles**: Canvas-level mouse events
- **Displays**: Shapes, lines, texts, page number

### InPlaceTextEditor.tsx
- **Purpose**: Direct text editing on canvas
- **Features**: Auto-resize, keyboard shortcuts
- **Triggers**: Double-click on text
- **Updates**: Text content only

### FloatingTextToolbar.tsx
- **Purpose**: Text formatting controls
- **Features**: Font, size, style, color, alignment
- **Triggers**: Single-click on text
- **Updates**: All text properties

### TextContextMenu.tsx
- **Purpose**: Quick actions menu
- **Features**: Copy, cut, paste, format, delete
- **Triggers**: Right-click on selected text
- **Updates**: Calls parent handlers

### useTextHistory.ts
- **Purpose**: Undo/redo functionality
- **Features**: History stack, state management
- **Provides**: saveState, undo, redo, canUndo, canRedo
- **Scope**: Per-page text history

### types.ts
- **Purpose**: TypeScript definitions
- **Exports**: TextType, PageData, ShapeType, LineType
- **Includes**: Text presets constants

## Integration Points

### With Konva
```typescript
// Text rendering with all properties
<KonvaText
  {...textItem}
  fontStyle={getKonvaFontStyle(textItem.fontStyle)}
  wrap="word"
  draggable={activeTool === 'Tool'}
  onTransform={handleTransform}
/>
```

### With react-color
```typescript
// Color picker in toolbar
<SketchPicker 
  color={textItem.fill} 
  onChangeComplete={(color) => onUpdate({ ...textItem, fill: color.hex })}
/>
```

### With react-pageflip
```typescript
// Book flipping with pages
<HTMLFlipBook {...config}>
  {pages.map((pageData, index) => (
    <BookPage key={index} {...props} />
  ))}
</HTMLFlipBook>
```

## Performance Considerations

### Optimizations
1. **Ref-based node management**: Direct DOM access for transformers
2. **Conditional rendering**: Only render active components
3. **Event delegation**: Single listener for keyboard shortcuts
4. **Memoization**: Could add React.memo for BookPage
5. **Debouncing**: Could add for auto-save

### Potential Bottlenecks
1. **Large text count**: Many texts on single page
2. **History size**: Unlimited history growth
3. **Re-renders**: Entire page re-renders on text update
4. **Canvas operations**: Complex transformations

### Solutions
1. **Virtualization**: For text list (if needed)
2. **History limit**: Cap at 50 states
3. **Selective updates**: Update only changed text
4. **Canvas caching**: Konva layer caching

## Error Handling

### Current Approach
- Null checks for optional properties
- Safe array operations
- Fallback values for missing data

### Edge Cases Handled
- No text selected (shortcuts disabled)
- Empty clipboard (paste disabled)
- No history (undo/redo disabled)
- Missing text properties (defaults applied)

## Testing Strategy

### Unit Tests (Recommended)
- useTextHistory hook
- Text formatting functions
- Event handlers

### Integration Tests (Recommended)
- Text creation flow
- Edit and format flow
- Copy/paste flow
- Undo/redo flow

### E2E Tests (Recommended)
- Complete user workflows
- Keyboard shortcuts
- Multi-page operations

## Future Architecture Improvements

### Potential Enhancements
1. **Context API**: For global text state
2. **Redux Integration**: For complex state management
3. **Web Workers**: For heavy text operations
4. **Service Layer**: Separate business logic
5. **Command Pattern**: For undo/redo
6. **Observer Pattern**: For text updates
7. **Factory Pattern**: For text creation

### Scalability
- Modular component structure allows easy extension
- Type-safe interfaces enable confident refactoring
- Separation of concerns supports maintainability
- Hook-based logic enables reusability

## Dependencies Graph

```
Book.tsx
├── types.ts
├── FloatingTextToolbar.tsx
│   └── types.ts
├── TextContextMenu.tsx
├── InPlaceTextEditor.tsx
│   └── types.ts
└── useTextHistory.ts
    └── types.ts

External Dependencies:
├── react-konva (Canvas)
├── react-color (Color picker)
├── lucide-react (Icons)
└── react-pageflip (Book flipping)
```

## Code Organization

### Separation of Concerns
- **Presentation**: React components
- **Logic**: Event handlers, state management
- **Data**: TypeScript interfaces
- **Utilities**: Custom hooks
- **Styling**: Tailwind CSS classes

### Design Patterns Used
1. **Component Composition**: Building complex UI from simple parts
2. **Custom Hooks**: Reusable stateful logic
3. **Render Props**: Conditional rendering patterns
4. **Controlled Components**: Form inputs
5. **Ref Forwarding**: Direct DOM access

## Summary

The architecture is:
- ✅ **Modular**: Easy to extend and maintain
- ✅ **Type-safe**: Full TypeScript coverage
- ✅ **Performant**: Optimized rendering
- ✅ **Testable**: Clear separation of concerns
- ✅ **Scalable**: Can handle growth
- ✅ **Maintainable**: Clean code structure

The implementation follows React best practices and provides a solid foundation for future enhancements.
