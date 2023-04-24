import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MongoClient } from 'mongodb';
import Event from '@ioc:Adonis/Core/Event'

    

export default class SensoresController {
    url = 'mongodb+srv://root:2tCVgy$_DEa!ZYB@5b.y2llyqd.mongodb.net/?retryWrites=true&w=majority';
    client = new MongoClient(this.url);
    dbName = 'VIDA';

    
   public async streamSensorValues({ response }) {
      const stream = response.response
      stream.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      })
    
       
    try {
      const client = await MongoClient.connect(this.url)
      const db = client.db(this.dbName)
      const collection = db.collection('sensoresValue')

      const changeStream = collection.watch()

      
      changeStream.on('change', (change) => {
        console.log('Change:', change)

        Event.on('SensoresActualizados', (stream) => {
          stream.write(`data: ${JSON.stringify(stream)}\n\n`)
        })
      })
   
    } catch (error) {
      console.log('Error:', error)
    }
  }
    
    
    public async obtenerValoresSens({ response }: HttpContextContract) {
      try {
        const client = await MongoClient.connect(this.url);
        const db = client.db(this.dbName);
        const collection = db.collection('sensoresValue');
    
        const aggregationPipeline = [
          { $sort: { fecha: -1 } },
          {
            $group: {
              _id: "$Sensor.Clave",
              sensor: { $first: "$Sensor" },
              value: { $last: "$Value" },
              fecha: { $last: "$Fecha" },
            },
          },
          { $sort: { _id:-1 } }
        ];
    
        const aggregationResult = await collection.aggregate(aggregationPipeline).toArray();
    
        return response.json(aggregationResult);
      } catch (error) {
        console.log(error);
        return response.status(500).json({ msg: 'Error en conexion con MongoDB' });
      }
    }
    
    
    

  public async obtenerValores({ response }: HttpContextContract) {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection('sensoresValue');
  
      const aggregationPipeline = [
        { $sort: { fecha: -1 } },
        {
          $group: {
            _id: "$Sensor.Clave",
            sensor: { $first: "$Sensor" },
            value: { $first: "$Value" },
            fecha: { $first: "$Fecha" },
          },
        },
        { $sort: { fecha: -1 } }
      ];
  
      const aggregationResult = await collection.aggregate(aggregationPipeline).toArray();
  
      this.client.close();
  
      Event.emit('SensoresActualizados', aggregationResult);
  
      return response.json({data: aggregationResult});
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  



}