const db = require('../models')
const { NotifyLabel, Subscription, Notification, User } = db
const RequestError = require('../libs/RequestError')

const notificationService = {
  addNotification: async (senderId, content, notifyLabelName) => {
    const [NotifyLabelId, subscribers] = await Promise.all([
      NotifyLabel.findOne({
        where: {
          labelName: notifyLabelName
        },
        attributes: ['id'],
        raw: true
      }),
      Subscription.findAll({
        where: {
          recipientId: senderId
        },
        attributes: ['subscriberId'],
        raw: true
      })
    ])

    if (!NotifyLabelId) {
      throw new RequestError(`notifyLabelName: ${notifyLabelName} isn't exist in DB`)
    }

    if (subscribers.length === 0) {
      throw new RequestError('This sender does not have any subscriber.')
    }

    const data = await Notification.bulkCreate(Array.from(subscribers, (subscriber, index) => ({
      receiverId: subscriber.subscriberId,
      senderId: senderId,
      content: content,
      NotifyLabelId: NotifyLabelId.id
    })))

    return data
  },
  getNotifications: async (id) => {
    const user = await User.findByPk(id)
    if (!user) {
      throw new RequestError('This user does not exist.')
    }

    const notifications = await Notification.findAll({
      where: { receiverId: id },
      include: [
        { model: NotifyLabel, attributes: ['title'] },
        {
          model: User,
          attributes: ['id', 'name', 'avatar'],
          as: 'sender'
        }
      ],
      attributes: ['content', 'createdAt', 'isRead'],
      raw: true,
      nest: true
    })

    const data = notifications.map((item, i) => {
      const mapItem = {
        ...item,
        title: item.NotifyLabel.title,
        id: item.sender.id,
        avatar: item.sender.avatar,
        name: item.sender.name,
        isRead: Boolean(item.isRead)
      }
      delete mapItem.NotifyLabel
      delete mapItem.sender

      return mapItem
    })
    return data
  }
}

module.exports = notificationService
