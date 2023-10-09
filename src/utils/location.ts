import { Injectable } from '@nestjs/common';

@Injectable()
export class Location {
  private readonly API_KEY = process.env.GEOCODE_API_KEY;

  async addressCoord(cep: string): Promise<any> {
    // limpa a string do cep
    cep = cep.replace(/\D/g, '');

    // consulta a api e retorna as coordenadas
    const cepResponse = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${cep}&limit=4&apiKey=${this.API_KEY}`,
    );
    const cepData = await cepResponse.json();

    return cepData;
  }
}
