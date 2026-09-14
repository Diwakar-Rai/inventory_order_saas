const getOrganizationFilter = (organizationId) => {
  return {
    organization: organizationId,
  };
};

module.exports = {
  getOrganizationFilter,
};
