import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
