const initAdmin = async () => {
  global.admin = global.kafka.admin();
  return await global.admin.connect();
};
const getClusterInfo = async () => {
  return await global.admin.describeCluster();
};

const closeAdmin = async () => {
  return await global.admin.disconnect();
};

const getTopicsMeta = async () => {
  return await global.admin.fetchTopicMetadata();
};

const deleteTopicFromCluster = async (topic) => {
  return await global.admin.deleteTopics({ topics: [topic] });
};

export {
  initAdmin,
  getClusterInfo,
  closeAdmin,
  getTopicsMeta,
  deleteTopicFromCluster,
};
