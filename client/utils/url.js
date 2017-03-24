// import conf from '../../qiniu.conf';
import publicConf from '../../public.conf';

export const domain = publicConf.DOMAIN_NAME;

export const nameSpace = 'testUpload';

const random = () => Math.random() * 1e5 | 0;

export const getName  = () => {
  return nameSpace + '/' + (new Date().toLocaleDateString()) + '/' + random() + '/';
};
