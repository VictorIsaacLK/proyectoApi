import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MongoClient } from 'mongodb';
import Event from '@ioc:Adonis/Core/Event'

    

export default class SensoresController {
    url = 'mongodb+srv://root:2tCVgy$_DEa!ZYB@5b.y2llyqd.mongodb.net/?retryWrites=true&w=majority';
    client = new MongoClient(this.url);
    dbName = 'VIDA';


  public async obtenerValores({ response }: HttpContextContract) {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection('sensoresValue');
  
      const aggregationPipeline = [
        { $sort: { fecha: -1 } },
        {
          $group: {
            _id: "$_id",
            sensor: { $first: "$Sensor" },
            value: { $first: "$Value" },
            fecha: { $first: "$Fecha" },
          },
        },
        { $sort: { fecha: -1 } },
        { $limit: 5 },
      ];
  
      const aggregationResult = await collection.aggregate(aggregationPipeline).toArray();
  
      this.client.close();
  
      Event.emit('SensoresActualizados', aggregationResult);
  
      return response.json(aggregationResult);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
  public async streamSensorValues({ response}) {
    const stream = response.response
    stream.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    })
  
    Event.on('SensoresActualizados', (sensores) => {
      stream.write(`data: ${JSON.stringify(sensores)}\n\n`)
      console.log('Datos de sensores actualizados')
    })
  }
  
}