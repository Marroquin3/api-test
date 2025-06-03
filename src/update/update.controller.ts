// src/update/update.controller.ts
import { Controller, Post, Res } from '@nestjs/common';
import { UpdateService } from './update.service';
import { Response } from 'express';

@Controller('update')
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}

  @Post()
  async update(@Res() res: Response) {
    try {
      const result = await this.updateService.updateAndRestart();
      res.status(200).send(`Actualización completada:\n\n${result}`);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}
