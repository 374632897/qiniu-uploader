import conf from '../../qiniu.conf';
window.isHttp = conf.DOMAIN_NAME.indexOf('https') !== 0;
