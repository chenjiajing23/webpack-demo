import path from 'path';

import env from '../variables';

// 静态资源子目录
const assetsPath = (pathname: string) => {
  const subDir = path.posix.join(env.base.assetsSubDirectory, pathname);
  return subDir;
};

export { assetsPath }