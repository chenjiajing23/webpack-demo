import path from 'path';

import env from '../env';

// 静态资源子目录
const assetsPath = (pathname: string) => {
  const subDir = path.posix.join(env.base.assetsSubDirectory, pathname);
  return subDir;
};

export { assetsPath }