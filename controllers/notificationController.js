const notificationService = require('../services/notificationService')

const notificationController = {
  addNotification: async (req, res) => {
    try {
      const { id, content, labelName, receiverId } = req.body
      const data = await notificationService.addNotification(id, content, labelName, receiverId)

      return res.status(200).json(data)
    } catch (error) {
      console.error(error)
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  getNotifications: async (req, res) => {
    try {
      const { id } = req.params

      const data = await notificationService.getNotifications(Number(id))

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  searchUnread: async (req, res) => {
    try {
      const { id } = req.params

      const data = await notificationService.searchUnread(Number(id))

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  clearUnread: async (req, res) => {
    try {
      const { id } = req.params

      const data = await notificationService.clearUnread(Number(id))

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  }
}

module.exports = notificationController
