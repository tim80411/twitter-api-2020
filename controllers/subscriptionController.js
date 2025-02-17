const subscriptionService = require('../services/subscriptionService')

const subscriptionController = {
  addSubscription: async (req, res) => {
    try {
      const { recipientId, subscriberId } = req.body

      await subscriptionService.addSubscription(recipientId, subscriberId)

      return res.status(200).json({
        status: 'success',
        message: `User${subscriberId} subscribed  user${recipientId} successfully.`
      })
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  removeSubscription: async (req, res) => {
    try {
      const { recipientId } = req.params
      const { subscriberId } = req.body

      await subscriptionService.removeSubscription(recipientId, subscriberId)

      return res.status(200).json({
        status: 'success',
        message: `User${subscriberId} unsubscribed user${recipientId} successfully.`
      })
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  }
}

module.exports = subscriptionController
