import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription(
      'All dates in ISO format and with letter `Z` on end, like `2021-02-23T14:04:58.504Z`<br><br>\
      Firebase login client sandbox - `https://74214.csb.app` <br><br>\
      Logger page - `/logs` <br><br>\
      Chat page - `/chat`',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
