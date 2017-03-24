import conf from '../../public.conf';
window.isHttp = conf.DOMAIN_NAME.indexOf('https') !== 0;
