import Event from "../model/event.model.js";
import User from "../model/user.model.js";
import cloudinary from "../cloudconfig.js";
import fs from 'fs';
import { promisify } from 'util';
const unlinkAsync = promisify(fs.unlink);


export const createEvent = async (req, res) => {
  try {
    // Log to verify file upload
    console.log("Temporary file path:", req.file.path);

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'events'
    });
    const coverimage = result.secure_url;
    console.log("Cloudinary upload result:", result);

    // Delete the temporary file
    await unlinkAsync(req.file.path);

    // Get form fields from req.body
    const { title, description, date, time, location, category } = req.body;
    const eventDate = new Date(date);
    const creator = res.locals.jwtData.id;

    // Create the new event document
    const event = new Event({ 
      title, 
      description, 
      date: eventDate, 
      time, 
      location, 
      category, 
      coverimage, 
      creator 
    });

    // Save event and update user
    await event.save();
    const user = await User.findById(creator);
    user.events_created.push(event._id);
    await user.save();

    return res.status(201).json({ message: "OK", event });
  } catch (error) {
    console.error("Error in createEvent:", error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const getAllEvents = async (req, res) => {
    try {          
        const events = await Event.find();
        if (!events) {
            return res.status(404).json({ message: "No events found" });
        }
        return res.status(200).json({ message: "OK", events });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
}

export const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
        return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json({ message: "OK", event });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
}

export const addUserToEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if(event.registered_users.includes(user._id)){
            return res.status(200).json({ message: "User already registered for this event" });
        }
        if(event.creator.toString() === user._id.toString()){
            return res.status(200).json({ message: "Creator cannot register for their own event" });
        }
        event.registered_users.push(user._id);
        await event.save();
        user.events_registered.push(event._id);
        await user.save();
        return res.status(200).json({ message: "OK", event });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
}


export const editEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        if (event.creator.toString() !== res.locals.jwtData.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { title, description, date, time, location, category } = req.body;
        event.title = title;
        event.description = description;
        event.date = date;
        event.time = time;
        event.location = location;
        event.category = category;
        await event.save();
        return res.status(200).json({ message: "OK", event });
    } catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
}
export const deleteEvent = async (req, res) => {
    try {
      // Find the event by id
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      // Check if the current user is the creator of the event
      if (event.creator.toString() !== res.locals.jwtData.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Delete the event
      await Event.findByIdAndDelete(req.params.id);
  
      // Remove the event from the creator's events_created array
      await User.findByIdAndUpdate(
        event.creator,
        { $pull: { events_created: mongoose.Types.ObjectId(req.params.id) } }
      );
  
      // Remove the event from all users' events_registered arrays using $in to ensure the array contains the id
      await User.updateMany(
        { events_registered: { $in: [mongoose.Types.ObjectId(req.params.id)] } },
        { $pull: { events_registered: mongoose.Types.ObjectId(req.params.id) } }
      );
  
      return res.status(200).json({ message: "OK", event });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
    }
  };

  export const unregisterUser = async (req, res) => {
    try {
      // Find the event by id.
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      // Find the user from token data.
      const user = await User.findById(res.locals.jwtData.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Remove the user from event's registered_users array.
      event.registered_users.pull(user._id);
      await event.save();
      // Remove the event from user's events_registered array.
      user.events_registered.pull(event._id);
      await user.save();
      return res.status(200).json({ message: "OK", event });
    } catch (error) {
      console.error("Error during deregistration:", error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
    }
  };