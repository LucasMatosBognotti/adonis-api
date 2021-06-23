import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'

import User from '../../Models/User'

export default class UsersController {
  public async create({ request, response }: HttpContextContract) {
    const { name, email, password } = request.body()

    const user = await User.create({
      name,
      email,
      password,
    })

    return response.json(user)
  }

  public async findAll({ response }: HttpContextContract) {
    const users = await User.all()

    return response.json(users)
  }

  public async findOne({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const user = await User.findBy('id', id)

    if (!user) {
      return response.json({ error: 'User does not exist' })
    }

    return response.json(user)
  }

  public async update({ request, response }: HttpContextContract) {
    const { id, name, email, password, oldPassword } = request.body()

    const user = await User.findBy('id', id)

    if (!user) {
      return response.json({ error: 'User does not exist' })
    }

    const userWithEmail = await User.findBy('email', email)

    if (userWithEmail && userWithEmail.id !== user.id) {
      return response.json({ error: 'Email already in use' })
    }

    user.name = name
    user.email = email

    if (password && !oldPassword) {
      return response.json({ error: 'You nedd to inform the old password to set a new password' })
    }

    if (password && oldPassword) {
      const checkOldPassword = await Hash.verify(user.password, oldPassword)

      if (!checkOldPassword) {
        return response.json({ error: 'Old password does not match' })
      }

      user.password = password
    }

    const updateUser = await user.save();

    return response.json(updateUser)
  }

  public async delete({ request, response }: HttpContextContract) {
    const {  id} = request.params();

    const user = await User.find(id)

    if (!user) {
      return response.json({ error: 'User does not exist' })
    }

    await user.delete();

    return response.json({ message: 'User deleted succeessfully' })

  }
}
