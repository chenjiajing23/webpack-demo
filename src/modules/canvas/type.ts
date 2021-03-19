export type IDrawType = 'drag' | 'rect' | 'circle' | 'polygon';

export interface IOptList {
  type: IDrawType;
  name: string;
  icon: JSX.Element;
}

// 所有点的坐标信息
export interface IPointInfo {
  type: Exclude<IDrawType, 'drag'>;
  point: IReactPointInfo | IArcPointInfo;
}

// 矩形坐标信息
export interface IReactPointInfo {
  x: number; // 起点x坐标
  y: number; // 起点y坐标
  xMax: number; // 终点x坐标
  yMax: number; // 终点y坐标
}

// 圆形坐标信息
export interface IArcPointInfo {
  x: number; // x 圆点坐标
  y: number; // y 圆点坐标
  r: number; // 半径
}

// 拖曳坐标
export interface IDragPointInfo {
  index?: number; // 拖动的下标
  x: number;
  y: number;
}

// 矩形的
export interface IRectOption {
  lineWidth?: number;
  color?: string;
}

export interface IBasePoint {
  x: number;
  y: number;
}
