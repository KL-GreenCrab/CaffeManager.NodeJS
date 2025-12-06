"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const users_service_1 = require("./users/users.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    const config = app.get(config_1.ConfigService);
    try {
        const usersService = app.get(users_service_1.UsersService);
        const adminUser = await usersService.findByUsername('admin');
        if (!adminUser) {
            const adminPassword = config.get('ADMIN_PASSWORD') || 'admin123';
            console.log('Creating default admin user with username "admin"');
            await usersService.create('admin', adminPassword, 'Administrator', 'admin');
        }
    }
    catch (err) {
        console.warn('Could not ensure admin user at startup:', err.message || err);
    }
    const port = config.get('PORT') || 3000;
    await app.listen(port);
    console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map