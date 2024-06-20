import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const serviceName = 'otel-content-service';

const sdk = new NodeSDK({
  resource: new Resource({
    service: serviceName, // Use 'service' ao invés de SemanticResourceAttributes.SERVICE_NAME
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
console.log('Tracing initialized');

process.on('SIGTERM', async () => {
  try {
    await sdk.shutdown();
    console.log('Tracing terminated');
  } catch (error) {
    console.log('Error terminating tracing', error);
  } finally {
    process.exit(0);
  }
});

export { sdk as tracingSdk }; // Exporta o SDK para uso em outros módulos
