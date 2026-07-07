const Subscription = require('../models/Subscription');
const Organization = require('../models/Organization');
const User = require('../models/User');

// Get all subscriptions (admin only)
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate('organization');
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
  }
};

// Create subscription for organization (admin)
exports.createSubscription = async (req, res) => {
  try {
    const { organizationId, plan, maxUsers, endDate, features } = req.body;

    // Check if organization exists
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Plan pricing
    const planPricing = {
      free: 0,
      starter: 99,
      pro: 299,
      enterprise: 999,
    };

    const subscription = new Subscription({
      organization: organizationId,
      plan,
      maxUsers,
      price: planPricing[plan] || 0,
      endDate,
      features: features || [],
    });

    await subscription.save();

    // Update organization with subscription
    organization.subscription = subscription._id;
    await organization.save();

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating subscription', error: error.message });
  }
};

// Update subscription (admin)
exports.updateSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { plan, status, maxUsers, endDate, autoRenew } = req.body;

    const subscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      { plan, status, maxUsers, endDate, autoRenew },
      { new: true }
    ).populate('organization');

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json({
      message: 'Subscription updated successfully',
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating subscription', error: error.message });
  }
};

// Delete/Cancel subscription (admin)
exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      { status: 'cancelled' },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json({
      message: 'Subscription cancelled successfully',
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling subscription', error: error.message });
  }
};

// Get organization subscriptions (admin or org owner)
exports.getOrgSubscriptions = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const subscriptions = await Subscription.find({ organization: organizationId });

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
  }
};
