import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';

async function bootstrap() {

  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  // Criar aplicação HTTP híbrida
  const app = await NestFactory.create(AppModule);

  // Configurar CORS se necessário
  app.enableCors();

  // Adicionar microservice Redis
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    },
  });

  // Iniciar microservice e aplicação HTTP
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);

  const port = process.env.PORT ?? 3000;
  console.log(`Microservice de Relatórios iniciado na porta ${port}`);
  console.log(`Rota de download disponível: http://localhost:${port}/download/{filename}`);
}
bootstrap();
