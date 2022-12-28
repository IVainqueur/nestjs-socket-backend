import { HttpException, HttpStatus, ConsoleLogger } from '@nestjs/common';

export const ErrorChecker = () => {
  return function (
    target,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const fn = descriptor.value;
    const logger = new ConsoleLogger();
    descriptor.value = async function (...args) {
      logger.log('[ ErrorChecker ] Checking...');
      let _exec: any = (function () {
        return { sucess: false, message: 'something went wrong' };
      })();

      try {
        _exec = fn.call(this, ...args);
        if ((await _exec) instanceof Error) {
          throw await _exec;
        }
        logger.log('[ ErrorChecker ] No Errors');
        return _exec;
      } catch (e) {
        logger.error(`[ ErrorChecker ] ${e.message}`, e.message ? '' : e);
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
    };
  };
};
