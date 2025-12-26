import { useRef, useEffect } from 'react';
import { Group, Rect, Text, Transformer } from 'react-konva';
import Konva from 'konva';
import type{ StickyNoteType } from './types';

interface StickyNoteProps {
  note: StickyNoteType;
  isSelected: boolean;
  isSelectMode: boolean;
  onSelect: (id: string) => void;
  onDoubleClick: (note: StickyNoteType) => void;
  onUpdate: (updatedNote: StickyNoteType) => void;
  onDelete?: (id: string) => void;
}

const StickyNote = ({ note, isSelected, isSelectMode, onSelect, onDoubleClick, onUpdate, onDelete }: StickyNoteProps) => {
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current && isSelectMode && note.isExpanded) {
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, isSelectMode, note.isExpanded]);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    onUpdate({ ...note, x: node.x(), y: node.y() });
  };

  const handleTransformEnd = () => {
    const node = groupRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    
    onUpdate({
      ...note,
      x: node.x(),
      y: node.y(),
      width: note.width * scaleX,
      height: note.height * scaleY,
      rotation: node.rotation(),
    });
  };

  const handleClick = () => {
    clickCountRef.current++;
    
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current === 1) {
      onSelect(note.id);
      
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 300);
    } else if (clickCountRef.current === 2) {
      if (!note.isExpanded) {
        onUpdate({ ...note, isExpanded: true });
      } else {
        onDoubleClick(note);
      }
      clickCountRef.current = 0;
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    }
  };

  const handleDeleteClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    e.cancelBubble = true;
    if (onDelete) {
      onDelete(note.id);
    }
  };

  const size = note.isExpanded 
    ? { width: note.width, height: note.height }
    : { width: note.collapsedWidth || 30, height: note.collapsedHeight || 30 };

  const content = note.isExpanded 
    ? (note.text?.trim() ? note.text.substring(0, 200) + (note.text.length > 200 ? '...' : '') : 'Double click to edit')
    : (note.text?.trim() ? '📌' : 'X');

  return (
    <>
      <Group
        ref={groupRef}
        x={note.x}
        y={note.y}
        rotation={note.rotation || 0}
        draggable={isSelectMode && note.isExpanded}
        onClick={handleClick}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      >
        <Rect
          width={size.width}
          height={size.height}
          fill={note.color}
          stroke={isSelected ? '#3b82f6' : '#000000'}
          strokeWidth={isSelected ? 2 : 1}
          shadowBlur={5}
          shadowColor="black"
          shadowOpacity={0.2}
          cornerRadius={note.isExpanded ? 5 : size.width / 2}
        />
        
        <Text
          x={10}
          y={10}
          width={Math.max(20, size.width - 20)}
          height={Math.max(20, size.height - 20)}
          text={content}
          fontFamily={note.fontFamily || 'Roboto'}
          fontSize={note.isExpanded ? (note.fontSize || 14) : Math.max(8, size.width * 0.3)}
          fill={note.textColor || '#000'}
          align={note.isExpanded ? 'left' : 'center'}
          verticalAlign={note.isExpanded ? 'top' : 'middle'}
          wrap={note.isExpanded ? 'word' : 'none'}
          listening={false}
        />
        
        {isSelected && note.isExpanded && onDelete && (
          <Group x={size.width - 20} y={5} onClick={handleDeleteClick} onTap={handleDeleteClick}>
            <Rect width={15} height={15} fill="#ef4444" cornerRadius={3} />
            <Text x={2} y={2} text="×" fontSize={12} fill="white" listening={false} />
          </Group>
        )}
      </Group>
      
      {isSelected && note.isExpanded && isSelectMode && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 50 || newBox.height < 50) return oldBox;
            return newBox;
          }}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        />
      )}
    </>
  );
};

export default StickyNote;
