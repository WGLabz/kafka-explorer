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

export { initAdmin, getClusterInfo, closeAdmin };
