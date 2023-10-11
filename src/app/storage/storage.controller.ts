import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('storage') // adiciona a tag storage para o swagger
@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Post('upload')
  @ApiBearerAuth() // autenticação por token no swagger
  @UseGuards(JwtAuthGuard) // validador de token
  @ApiOperation({ summary: 'Fazer upload de um arquivo' }) // descrição da rota
  @ApiConsumes('multipart/form-data') // tipo de conteúdo da requisição
  // tipo do corpo da requisição
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Envie uma imagem usando a chave "file".',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 201,
    description: 'arquivo enviado',
  })
  @ApiResponse({ status: 403, description: 'Usuário não autenticado' })
  @ApiResponse({ status: 400, description: 'Nenhum arquivo enviado' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Nenhum arquivo enviado', HttpStatus.BAD_REQUEST);
    }

    // verifica se o arquivo é uma imagem
    const isValidImage = await this.storageService.isImageValid(file);

    if (!isValidImage) {
      throw new HttpException(
        'Tipo de arquivo inválido',
        HttpStatus.BAD_REQUEST,
      );
    }

    // faz o upload do arquivo
    const publicUrl = await this.storageService.uploadFile(file);
    return { message: 'Imagem armazenada com sucesso!', url: publicUrl };
  }
}
