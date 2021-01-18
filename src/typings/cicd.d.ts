interface CICD {
  author: string;
  CI_DEV_BRANCH: string;
  ENV: 'DEV' | 'TEST' | 'STAGE' | 'PROD' | 'LOCAL';
}
