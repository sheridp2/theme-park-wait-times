const mongoose = require("mongoose");
const { Schema } = mongoose;

const waitTimeSchema = new Schema(
  {
    dateTime: { type: Date, default: Date.now },
    todaysDate: { type: String },
    currentWaitTimes: {
      type: mongoose.SchemaTypes.Mixed,
      required: true,
    },
  },

  { timestamp: true }
);

mongoose.model("waitTimes", waitTimeSchema);
