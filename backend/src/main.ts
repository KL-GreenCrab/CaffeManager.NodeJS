import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS to allow frontend (port 5173) to call backend (port 3000)
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://localhost:5174'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const config = app.get(ConfigService);

  // ensure default roles and admin user exist
  try {
    const usersService = app.get(UsersService);
    const adminUser = await usersService.findByUsername('admin');
    if (!adminUser) {
      const adminPassword = config.get<string>('ADMIN_PASSWORD') || 'admin123';
      console.log('Creating default admin user with username "admin"');
      await usersService.create('admin', adminPassword, 'Administrator', 'admin');
    }
  } catch (err) {
    // ignore if UsersService not ready or TypeORM not initialized yet
    console.warn('Could not ensure admin user at startup:', err.message || err);
  }

  const port = config.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
