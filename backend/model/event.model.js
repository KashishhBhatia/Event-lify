import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum : ['Music','Sports', 'Travel', 'Health','Food','Art', 'Fashion', 'Beauty', 'Technology', 'Film', 'Other']
     },
    coverimage: { type: String, required: true },
    registered_users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    liveCount: { type: Number, default: 0 } 
})
const Event = mongoose.model('Event', eventSchema);
export default Event;