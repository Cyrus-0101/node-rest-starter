import mongoose from "mongoose";
import AutoInc from "mongoose-sequence";

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AutoIncFactory = AutoInc(mongoose);

noteSchema.plugin(AutoIncFactory, {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 500,
});

export default mongoose.model("Note", noteSchema);
