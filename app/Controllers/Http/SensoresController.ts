import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MongoClient } from 'mongodb';

    

export default class SensoresController {
    url = 'mongodb+srv://Daru:kobeni@cluster0.d5vgzin.mongodb.net/?retryWrites=true&w=majority';
    client = new MongoClient(this.url);
    dbName = 'iot';

public async getLastSensorValues({ response }: HttpContextContract) {
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection('sensors');
  
      const aggregationPipeline = [
        { $sort: { timestamp: -1 } },
        { $group: { _id: '$sensor.type',  value: { $first: '$sensor.value' }, ubicacion: { $first: '$sensor.location' }, } },
        { $limit: 3 },
      ];
  
      const aggregationResult = await collection.aggregate(aggregationPipeline).toArray();
  
      this.client.close();
  
      return response.json(aggregationResult);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: 'Error interno del servidor' });
    }
  }  
  
}