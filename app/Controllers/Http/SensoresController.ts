import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MongoClient } from 'mongodb';
import Event from '@ioc:Adonis/Core/Event'

    

export default class SensoresController {
    url = 'mongodb://54.174.208.18:27017/?directConnection=true';
    url2 = 'mongodb://54.174.208.18:27018/?directConnection=true';
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
            _id: "$Sensor.Tipo",
            sensor: { $first: "$Sensor" },
            fecha: { $first: "$Fecha" },
            value: { $last: "$Value" },
          },
        },
        { $sort: { fecha: -1 } }
      ];
  
      const aggregationResult = await collection.aggregate(aggregationPipeline).toArray()
  
      client.close();
  
      Event.emit('SensoresActualizados', aggregationResult);
  
      return response.json(aggregationResult);
    } catch (error) {
      console.log(error);
  
      try {
        console.log('Intentando con el segundo servidor');
        const client2 = await MongoClient.connect(this.url2);
        const db = client2.db(this.dbName);
        const collection = db.collection('sensoresValue');
  
        const aggregationPipeline = [
          { $sort: { fecha: -1 } },
          {
            $group: {
              _id: "$Sensor.Tipo",
              sensor: { $first: "$Sensor" },
              fecha: { $first: "$Fecha" },
              value: { $last: "$Value" },
            },
          },
          { $sort: { fecha: -1 } }
        ];
  
        const aggregationResult = await collection.aggregate(aggregationPipeline).toArray()
  
        client2.close();
  
        Event.emit('SensoresActualizados', aggregationResult);
  
        return response.json(aggregationResult);
      } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Error interno del servidor' });
      }
    }
  }
  
    
  public async obtenerValores({ response }: HttpContextContract) {
    try {
      const client = await MongoClient.connect(this.url);
      const db = client.db(this.dbName);
      const collection = db.collection('sensoresValue');
  
      const aggregationPipeline = [
        { $sort: { fecha: -1 } },
        {
          $group: {
            _id: "$Sensor.Tipo",
            sensor: { $first: "$Sensor" },
            fecha: { $first: "$Fecha" },
            value: { $last: "$Value" },
          },
        },
        { $sort: { fecha: -1 } }
      ];
  
      const aggregationResult = await collection.aggregate(aggregationPipeline).toArray()
  
      client.close();
  
      Event.emit('SensoresActualizados', aggregationResult);
  
      return response.json({data:aggregationResult});
    } catch (error) {
      try {
        const client2 = await MongoClient.connect(this.url2);
        const db = client2.db(this.dbName);
        const collection = db.collection('sensoresValue');
  
        const aggregationPipeline = [
          { $sort: { fecha: -1 } },
          {
            $group: {
              _id: "$Sensor.Tipo",
              sensor: { $first: "$Sensor" },
              fecha: { $first: "$Fecha" },
              value: { $last: "$Value" },
            },
          },
          { $sort: { fecha: -1 } }
        ];
  
        const aggregationResult = await collection.aggregate(aggregationPipeline).toArray()
  
        client2.close();
  
        Event.emit('SensoresActualizados', aggregationResult);
  
        return response.json({data:aggregationResult});
      } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Error interno del servidor' });
      }
    }
  }
  



}