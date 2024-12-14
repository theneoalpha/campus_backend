
import mongoose, {Schema} from 'mongoose';

const postSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    content: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now }, 
  },
  { timestamps: true }
);



export default mongoose.model('Post', postSchema);
