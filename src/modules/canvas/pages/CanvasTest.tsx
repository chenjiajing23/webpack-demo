import React, { useRef, useState } from 'react';

import '../style/canvas-test.less';
import imgSrc from '../assets/test.png';
import { Button } from 'antd';

interface IPoint {
  x: number;
  y: number;
}

const CanvasTest = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startPoint = useRef<IPoint>({ x: 0, y: 0 });
  const [isMoving, setMoving] = useState(false); // 是否在移动

  // 画图
  const printImg = (canvas: HTMLCanvasElement, img: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
    const xRate = canvas.width / img.width;
    const yRate = canvas.height / img.height;
    ctx.drawImage(img, 0, 0, img.width * xRate, img.height * yRate);
  };

  // 图片加载成功
  const onLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const node = canvasRef.current;
    const ctx = node?.getContext('2d');
    if (node && ctx) {
      const img = e.target as HTMLImageElement;
      printImg(node, img, ctx);
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

  const drawRect = (ctx: CanvasRenderingContext2D, curPoint: { x: number; y: number }) => {
    const newRect = getRectParam(curPoint, startPoint.current);
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(200, 0, 0, 0.5)';
    ctx.rect(newRect.startPoint.x, newRect.startPoint.y, Math.abs(newRect.w), Math.abs(newRect.h));
    ctx.stroke();
  };

  // 导出图片
  const exportImage = () => {
    const node = canvasRef.current as HTMLCanvasElement;
    const dataURL = node.toDataURL('image/png', 1);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.download = 'canvas-test';
    a.href = dataURL;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
  };

  // 按下鼠标
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setMoving(true);
    const node = canvasRef.current as HTMLCanvasElement;
    const ctx = node.getContext('2d') as CanvasRenderingContext2D;

    const x = e.pageX;
    const y = e.pageY;
    startPoint.current = getPointOnCanvas(node, x, y); // 获取起点
    ctx.beginPath();
    ctx.moveTo(startPoint.current.x, startPoint.current.y);
  };

  // 移动鼠标
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isMoving) {
      return;
    }
    const node = canvasRef.current as HTMLCanvasElement;
    const ctx = node.getContext('2d') as CanvasRenderingContext2D;

    // 清除画布
    ctx.clearRect(0, 0, node.width, node.height);
    printImg(node, imgRef.current as HTMLImageElement, ctx);

    const x = e.pageX;
    const y = e.pageY;
    const curPoint = getPointOnCanvas(node, x, y);
    drawRect(ctx, curPoint);
  };

  // 松开鼠标
  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setMoving(false);
    console.log(e.pageX, e.pageY);
  };

  return (
    <section styleName="canvas-test">
      <div className="content">
        <img ref={imgRef} className="image" src={imgSrc} alt="" onLoad={onLoad} />
        <canvas
          width={800}
          height={500}
          className="canvas"
          ref={canvasRef}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <Button type="primary" onClick={exportImage}>
          导出图片
        </Button>
      </div>
    </section>
  );
};

export default CanvasTest;
