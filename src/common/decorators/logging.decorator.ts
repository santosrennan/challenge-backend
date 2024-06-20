import { trace } from '@opentelemetry/api';
import logger from '@common/logger/logger';

export function TraceAndLog(operationName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const tracer = trace.getTracer(target.constructor.name);
      const span = tracer.startSpan(operationName);

      try {
        const result = await originalMethod.apply(this, args);
        span.addEvent(`Operation ${operationName} completed successfully`);
        logger.info(`Operation ${operationName} completed successfully`);
        return result;
      } catch (error) {
        span.recordException(error);
        logger.error(`Error in operation ${operationName}`, { error });
        throw error;
      } finally {
        span.end();
      }
    };

    return descriptor;
  };
}
