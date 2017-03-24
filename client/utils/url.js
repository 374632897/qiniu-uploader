import conf from '../../qiniu.conf';

export const domain = conf.DOMAIN_NAME;

export const nameSpace = 'testUpload';

const random = () => Math.random() * 1e5 | 0;

export const getName  = () => {
  return nameSpace + '/' + (new Date().toLocaleDateString()) + '/' + random() + '/';
};
