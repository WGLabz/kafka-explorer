module.exports = {
  model: {
    messages: {},
    logs: {
      title: "Logs Schema",
      version: 0,
      description: "Schema for Logs",
      primaryKey: "id",
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        type: {
          type: "string",
        },
        message: {
          type: "string",
        },
      },
    },
  },
};
