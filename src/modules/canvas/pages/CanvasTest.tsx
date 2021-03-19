import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { BorderOutlined, DragOutlined, Loading3QuartersOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import '../style/canvas-test.less';
import imgSrc from '../assets/test.png';
import {
  IArcPointInfo,
  IBasePoint,
  IDragPointInfo,
  IDrawType,
  IOptList,
  IPointInfo,
  IReactPointInfo,
  IRectOption
} from '../type';

// 操作列表
const operateList: IOptList[] = [
  {
    type: 'drag',
    name: '拖动',
    icon: <DragOutlined />
  },
  {
    type: 'rect',
    name: '矩形',
    icon: <BorderOutlined />
  },
  {
    type: 'circle',
    name: '全圆形',
    icon: <Loading3QuartersOutlined />
  },
  {
    type: 'polygon',
    name: '多边形',
    icon: <AppstoreAddOutlined />
  }
];

const CanvasTest = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMouseDown, setMouseDown] = useState(false); // 是否按下键盘
  const [optType, setOptType] = useState<IDrawType | null>(null); // 操作类型
  const aLLPointList = useRef<IPointInfo[]>([]); // 坐标列表
  const curStartPoint = useRef<null | IBasePoint>(null); // 开始坐标
  const dragPoint = useRef<IDragPointInfo | null>(null);
  const [isDragging, setDragging] = useState(false);

  useEffect(() => {
    if (dragPoint.current && optType === 'drag') {
      setDragging(true);
    } else {
      setDragging(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optType, dragPoint.current]);

  // 画图
  const toBeCanvas = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, pointList: IPointInfo[]) => {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      printImg(canvas, imgRef.current as HTMLImageElement, ctx);

      pointList.forEach(item => {
        const point = item.point;

        if (item.type === 'rect') {
          drawRect(ctx, point as IReactPointInfo);
        } else if (item.type === 'circle') {
          drawArc(ctx, (point as unknown) as IArcPointInfo);
        }
      });
    },
    []
  );

  // 画图
  const printImg = (canvas: HTMLCanvasElement, img: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
    const xRate = canvas.width / img.width;
    const yRate = canvas.height / img.height;
    ctx.drawImage(img, 0, 0, img.width * xRate, img.height * yRate);
  };

  // 图片加载成功
  const onLoad = () => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    toBeCanvas(canvas, ctx, aLLPointList.current);
  };

  // 获取相对于画布的坐标
  const getCanvasPoint = (canvas: HTMLCanvasElement, x: number, y: number) => {
    const rect = canvas.getBoundingClientRect();

    return {
      x: x - rect.left * (canvas.width / rect.width),
      y: y - rect.top * (canvas.height / rect.height)
    };
  };

  /**
   * @param curPoint 当前坐标
   * @param startPoint 开始坐标
   * @return {IReactPointInfo} 返回正确的坐标信息
   */
  const getRectParam = (curPoint: { x: number; y: number }, startPoint: { x: number; y: number }): IReactPointInfo => {
    const w = curPoint.x - startPoint.x;
    const h = curPoint.y - startPoint.y;

    if (w < 0 || h < 0) {
      return {
        ...curPoint,
        xMax: startPoint.x,
        yMax: startPoint.y
      };
    } else {
      return {
        ...startPoint,
        xMax: curPoint.x,
        yMax: curPoint.y
      };
    }
  };

  // 画矩形
  const drawRect = (ctx: CanvasRenderingContext2D, point: IReactPointInfo, rectOption?: IRectOption) => {
    ctx.beginPath();
    ctx.lineWidth = rectOption?.lineWidth || 3;
    ctx.strokeStyle = rectOption?.color || '#000';
    ctx.rect(point.x, point.y, point.xMax - point.x, point.yMax - point.y);
    ctx.stroke();
  };

  // 画圆形
  const drawArc = (ctx: CanvasRenderingContext2D, point: IArcPointInfo, rectOption?: IRectOption) => {
    ctx.beginPath();
    ctx.lineWidth = rectOption?.lineWidth || 3;
    ctx.strokeStyle = rectOption?.color || '#000';
    ctx.arc(point.x, point.y, point.r, 0, 2 * Math.PI, false);
    ctx.stroke();
  };

  // 按下鼠标
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!optType) {
      return;
    }

    setMouseDown(true);

    const node = canvasRef.current as HTMLCanvasElement;
    const ctx = node.getContext('2d') as CanvasRenderingContext2D;

    const startPoint = getCanvasPoint(node, e.pageX, e.pageY);

    curStartPoint.current = startPoint;

    // 高亮选中的图形
    aLLPointList.current.forEach((item, index) => {
      if (item.type === 'rect') {
        drawRect(ctx, item.point as IReactPointInfo);
      } else if (item.type === 'circle') {
        drawArc(ctx, item.point as IArcPointInfo);
      }

      // 选中高亮
      if (ctx.isPointInPath(startPoint.x, startPoint.y)) {
        dragPoint.current = { index, x: startPoint.x, y: startPoint.y };
        ctx.strokeStyle = '#ff4444';
      } else {
        ctx.strokeStyle = '#000';
      }
      ctx.stroke();
    });
  };

  // 移动鼠标
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isMouseDown) {
      return;
    }

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const endPoint = getCanvasPoint(canvas, e.pageX, e.pageY);

    if (curStartPoint.current) {
      const handlePoint = {
        ...getRectParam(endPoint, { x: curStartPoint.current.x, y: curStartPoint.current.y })
      };

      // 直线
      if (optType === 'rect') {
        toBeCanvas(canvas, ctx, aLLPointList.current.concat({ type: optType, point: handlePoint }));
      } else if (optType === 'circle') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        printImg(canvas, imgRef.current as HTMLImageElement, ctx);

        // 取半径
        const r =
          Math.sqrt(Math.pow(handlePoint.yMax - handlePoint.y, 2) + Math.pow(handlePoint.xMax - handlePoint.x, 2)) / 2;
        const arcPoint: IArcPointInfo = {
          x: handlePoint.x + r,
          y: handlePoint.y + r,
          r: Math.abs(r)
        };

        toBeCanvas(canvas, ctx, aLLPointList.current.concat({ type: optType, point: arcPoint }));
      }
    }
    // 拖曳
    if (optType === 'drag') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      printImg(canvas, imgRef.current as HTMLImageElement, ctx);

      // 画图
      aLLPointList.current.forEach((item, index) => {
        let moveX = 0;
        let moveY = 0;
        let color;
        if (index === dragPoint.current?.index) {
          moveX = endPoint.x - dragPoint.current.x;
          moveY = endPoint.y - dragPoint.current.y;
          color = '#ff4444';
        } else {
          color = '#000';
        }

        if (item.type === 'rect') {
          const point = item.point as IReactPointInfo;
          const newPoint: IReactPointInfo = {
            x: point.x + moveX,
            y: point.y + moveY,
            xMax: point.xMax + moveX,
            yMax: point.yMax + moveY
          };
          drawRect(ctx, newPoint, { color });
        } else if (item.type === 'circle') {
          const point = item.point as IArcPointInfo;
          const newPoint: IArcPointInfo = { ...point, x: point.x + moveX, y: point.y + moveY };
          drawArc(ctx, newPoint, { color });
        }
      });
    }
  };

  // 松开鼠标(保存数据)
  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setMouseDown(false);

    const canvas = canvasRef.current as HTMLCanvasElement;
    const endPoint = getCanvasPoint(canvas, e.pageX, e.pageY);

    // 增加画图
    if (curStartPoint.current) {
      const handlePoint = {
        ...getRectParam(endPoint, { x: curStartPoint.current.x, y: curStartPoint.current.y })
      };

      if (optType === 'rect') {
        aLLPointList.current.push({ type: optType, point: handlePoint });
      } else if (optType === 'circle') {
        // 取半径
        const r =
          Math.sqrt(Math.pow(handlePoint.yMax - handlePoint.y, 2) + Math.pow(handlePoint.xMax - handlePoint.x, 2)) / 2;
        const arcPoint: IArcPointInfo = {
          x: handlePoint.x + r,
          y: handlePoint.y + r,
          r: Math.abs(r)
        };

        aLLPointList.current.push({ type: optType, point: arcPoint });
      }
    }
    // 拖曳
    if (optType === 'drag') {
      aLLPointList.current = aLLPointList.current.map((item, index) => {
        let moveX = 0;
        let moveY = 0;

        if (dragPoint.current && index === dragPoint.current.index) {
          moveX = endPoint.x - dragPoint.current.x;
          moveY = endPoint.y - dragPoint.current.y;

          if (item.type === 'circle') {
            return { ...item, point: { ...item.point, x: item.point.x + moveX, y: item.point.y + moveY } };
          } else if (item.type === 'rect') {
            return {
              ...item,
              point: {
                ...item.point,
                x: item.point.x + moveX,
                y: item.point.y + moveY,
                xMax: (item.point as IReactPointInfo).xMax + moveX,
                yMax: (item.point as IReactPointInfo).yMax + moveY
              }
            };
          }
        }
        return item;
      });
    }
    // 重置数据
    dragPoint.current = null;
    curStartPoint.current = null;
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

  return (
    <section styleName="canvas-test">
      <ul className="opt">
        {operateList.map(item => (
          <li
            key={item.type}
            className={classNames('opt-item', { 'opt-item-active': item.type === optType })}
            onClick={() => setOptType(item.type)}
          >
            <Tooltip title={item.name} placement="top" arrowPointAtCenter>
              {item.icon}
            </Tooltip>
          </li>
        ))}
      </ul>
      {/* canvas */}
      <div className={classNames('content', { 'content-drag': isDragging })}>
        <img ref={imgRef} className="image" src={imgSrc} alt="" onLoad={onLoad} />
        <canvas
          width={1200}
          height={700}
          className={classNames('canvas')}
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
