
import Database from '@ioc:Adonis/Lucid/Database'
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'leds'

  public async up () {
    const roleData = [
      {name: 'Rueda', status: false},
    ]
    
    await Database.table('leds').insert(roleData)
}
}
