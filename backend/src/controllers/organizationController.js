const Organization = require('../models/Organization');
const User = require('../models/User');

// Get all organizations (admin only)
exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find()
      .populate('owner')
      .populate('subscription')
      .populate('users');
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organizations', error: error.message });
  }
};

// Create organization
exports.createOrganization = async (req, res) => {
  try {
    const { name, email, description } = req.body;
    const ownerId = req.userId;

    // Check if org email exists
    const existingOrg = await Organization.findOne({ email });
    if (existingOrg) {
      return res.status(400).json({ message: 'Organization email already exists' });
    }

    const organization = new Organization({
      name,
      email,
      owner: ownerId,
      description,
      users: [ownerId],
    });

    await organization.save();

    // Update user to org_owner role
    await User.findByIdAndUpdate(ownerId, { role: 'org_owner', organization: organization._id });

    res.status(201).json({
      message: 'Organization created successfully',
      organization,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating organization', error: error.message });
  }
};

// Update organization (admin or org owner)
exports.updateOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { name, email, description, isActive } = req.body;

    const organization = await Organization.findByIdAndUpdate(
      organizationId,
      { name, email, description, isActive },
      { new: true }
    )
      .populate('owner')
      .populate('subscription');

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json({
      message: 'Organization updated successfully',
      organization,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating organization', error: error.message });
  }
};

// Add user to organization (org owner)
exports.addUserToOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { userId } = req.body;

    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already in organization
    if (organization.users.includes(userId)) {
      return res.status(400).json({ message: 'User already in organization' });
    }

    organization.users.push(userId);
    user.organization = organizationId;

    await organization.save();
    await user.save();

    res.json({
      message: 'User added to organization',
      organization,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding user', error: error.message });
  }
};

// Remove user from organization (org owner)
exports.removeUserFromOrganization = async (req, res) => {
  try {
    const { organizationId, userId } = req.params;

    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    organization.users = organization.users.filter((id) => id.toString() !== userId);

    const user = await User.findByIdAndUpdate(userId, { organization: null });

    await organization.save();

    res.json({
      message: 'User removed from organization',
      organization,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error removing user', error: error.message });
  }
};

// Get organization details
exports.getOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const organization = await Organization.findById(organizationId)
      .populate('owner')
      .populate('subscription')
      .populate('users');

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization', error: error.message });
  }
};
