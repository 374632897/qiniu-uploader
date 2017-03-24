import conf from '../../config/public.conf';
window.isHttp = conf.DOMAIN_NAME.indexOf('https') !== 0;
