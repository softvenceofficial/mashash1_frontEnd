// src/utils/snappingLogic.ts
import Konva from 'konva';

const GUIDELINE_OFFSET = 5;

type SnapOrientation = 'V' | 'H';

export interface SnapGuide {
  lineGuide: number;
  offset: number;
  orientation: SnapOrientation;
  snap: string;
}

export const getLineGuideStops = (skipShape: Konva.Node, layer: Konva.Layer) => {
  const stage = layer.getStage();
  if (!stage) return { vertical: [], horizontal: [] };

  const vertical = [0, stage.width() / 2, stage.width()];
  const horizontal = [0, stage.height() / 2, stage.height()];

  layer.find('.object').forEach((guideItem) => {
    if (guideItem === skipShape) {
      return;
    }
    const box = guideItem.getClientRect();
    vertical.push(box.x, box.x + box.width, box.x + box.width / 2);
    horizontal.push(box.y, box.y + box.height, box.y + box.height / 2);
  });

  return {
    vertical,
    horizontal,
  };
};

export const getObjectSnappingEdges = (node: Konva.Node) => {
  const box = node.getClientRect();
  const absPos = node.absolutePosition();

  return {
    vertical: [
      {
        guide: Math.round(box.x),
        offset: Math.round(absPos.x - box.x),
        snap: 'start',
      },
      {
        guide: Math.round(box.x + box.width / 2),
        offset: Math.round(absPos.x - box.x - box.width / 2),
        snap: 'center',
      },
      {
        guide: Math.round(box.x + box.width),
        offset: Math.round(absPos.x - box.x - box.width),
        snap: 'end',
      },
    ],
    horizontal: [
      {
        guide: Math.round(box.y),
        offset: Math.round(absPos.y - box.y),
        snap: 'start',
      },
      {
        guide: Math.round(box.y + box.height / 2),
        offset: Math.round(absPos.y - box.y - box.height / 2),
        snap: 'center',
      },
      {
        guide: Math.round(box.y + box.height),
        offset: Math.round(absPos.y - box.y - box.height),
        snap: 'end',
      },
    ],
  };
};

export const getGuides = (lineGuideStops: any, itemBounds: any): SnapGuide[] => {
  const resultV: any[] = [];
  const resultH: any[] = [];

  lineGuideStops.vertical.forEach((lineGuide: number) => {
    itemBounds.vertical.forEach((itemBound: any) => {
      const diff = Math.abs(lineGuide - itemBound.guide);
      if (diff < GUIDELINE_OFFSET) {
        resultV.push({
          lineGuide,
          diff,
          snap: itemBound.snap,
          offset: itemBound.offset,
        });
      }
    });
  });

  lineGuideStops.horizontal.forEach((lineGuide: number) => {
    itemBounds.horizontal.forEach((itemBound: any) => {
      const diff = Math.abs(lineGuide - itemBound.guide);
      if (diff < GUIDELINE_OFFSET) {
        resultH.push({
          lineGuide,
          diff,
          snap: itemBound.snap,
          offset: itemBound.offset,
        });
      }
    });
  });

  const guides: SnapGuide[] = [];

  const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
  const minH = resultH.sort((a, b) => a.diff - b.diff)[0];

  if (minV) {
    guides.push({
      lineGuide: minV.lineGuide,
      offset: minV.offset,
      orientation: 'V',
      snap: minV.snap,
    });
  }
  if (minH) {
    guides.push({
      lineGuide: minH.lineGuide,
      offset: minH.offset,
      orientation: 'H',
      snap: minH.snap,
    });
  }

  return guides;
};

export const drawGuides = (guides: SnapGuide[], layer: Konva.Layer) => {
  guides.forEach((lg) => {
    if (lg.orientation === 'H') {
      const line = new Konva.Line({
        points: [-6000, 0, 6000, 0],
        stroke: 'rgb(0, 161, 255)',
        strokeWidth: 1,
        name: 'guid-line',
        dash: [4, 6],
      });
      layer.add(line);
      line.absolutePosition({
        x: 0,
        y: lg.lineGuide,
      });
    } else if (lg.orientation === 'V') {
      const line = new Konva.Line({
        points: [0, -6000, 0, 6000],
        stroke: 'rgb(0, 161, 255)',
        strokeWidth: 1,
        name: 'guid-line',
        dash: [4, 6],
      });
      layer.add(line);
      line.absolutePosition({
        x: lg.lineGuide,
        y: 0,
      });
    }
  });
};
