import React, { useRef } from 'react';

import '../style/canvas-test.less';
import imgSrc from '../assets/test.png';

interface IPoint {
  x: number;
  y: number;
}

const CanvasTest = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startPoint = useRef<IPoint>({ x: 0, y: 0 });

  const onLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const node = canvasRef.current;
    const ctx = node?.getContext('2d');
    if (node && ctx) {
      const img = e.target as HTMLImageElement;
      node.width = img.width;
      node.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
    }
  };

  // 获取相对于画布的坐标
  const getPointOnCanvas = (canvas: HTMLCanvasElement, x: number, y: number) => {
    const rect = canvas.getBoundingClientRect();

    return {
      x: x - rect.left * (canvas.width / rect.width),
      y: y - rect.top * (canvas.height / rect.height)
    };
  };

  /**
   * @param curPoint 当前坐标
   * @param startPoint 开始坐标
   */
  const getRectParam = (curPoint: { x: number; y: number }, startPoint: { x: number; y: number }) => {
    const w = curPoint.x - startPoint.x;
    const h = curPoint.y - startPoint.y;

    const newStartPoint = w < 0 || h < 0 ? curPoint : startPoint;

    return {
      startPoint: newStartPoint,
      w,
      h
    };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const node = canvasRef.current as HTMLCanvasElement;
    const ctx = node.getContext('2d') as CanvasRenderingContext2D;
    const x = e.pageX;
    const y = e.pageY;
    startPoint.current = getPointOnCanvas(node, x, y); // 获取起点
    ctx.beginPath();
    ctx.moveTo(startPoint.current.x, startPoint.current.y);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const node = canvasRef.current as HTMLCanvasElement;
    const ctx = node.getContext('2d') as CanvasRenderingContext2D;
    const x = e.pageX;
    const y = e.pageY;
    const curPoint = getPointOnCanvas(node, x, y);
    drawRect(ctx, curPoint);
  };

  const drawRect = (ctx: CanvasRenderingContext2D, curPoint: { x: number; y: number }) => {
    const newRect = getRectParam(curPoint, startPoint.current);
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(200, 0, 0, 0.5)';
    ctx.rect(newRect.startPoint.x, newRect.startPoint.y, Math.abs(newRect.w), Math.abs(newRect.h));
    ctx.stroke();
  };

  return (
    <section styleName="canvas-test">
      <div className="content">
        <img className="image" src={imgSrc} width="800px" alt="" onLoad={onLoad} />
        <canvas className="canvas" ref={canvasRef} onMouseMove={onMouseMove} onMouseDown={onMouseDown} />
      </div>
    </section>
  );
};

export default CanvasTest;
