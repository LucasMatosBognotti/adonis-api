import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class UploadFileController {
  public async create({ request }: HttpContextContract) {
    const fileSchema = schema.create({
      avatar: schema.file({
        size: '2mb',
        extnames: ['jpg', 'gif', 'png'],
      }),
    })

    const payload = await request.validate({ schema: fileSchema })

    if (Application.tmpPath('uploads')) {
    }
    const fileName = `${cuid()}.${payload.avatar.extname}`

    await payload.avatar.move(Application.tmpPath('uploads'), {
      name: fileName,
    })
  }
}
