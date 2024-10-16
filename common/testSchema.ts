const testSchema = {
  schema: {
    title: "test",
    version: 1,
    type: "object",
    primaryKey: "id",
    properties: {
      id: {
        type: "string",
        maxLength: 100,
      },
      test: {
        type: "string",
        maxLength: 100,
      },
    },
  },
    migrationStrategies: {
        1: (oldDoc) => {
            oldDoc.test = "test";
            return oldDoc;
        },
    },
};

export default testSchema;
