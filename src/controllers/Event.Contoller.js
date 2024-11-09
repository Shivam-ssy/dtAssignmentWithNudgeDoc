import { eventCollection } from "../db/collection.js";
import { deleteFileByUrl } from "../utilities/Cloudinary.js";
import { ObjectId } from "mongodb";
const createEvent = async (req, res) => {
  try {
    const file = req.files;
    if (!file) {
      return res.status(404).json({
        status: 404,
        message: "File not found Please upload a valid file",
        data: null,
      });
    }
    const {
      name,
      tagline,
      schedule,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank,
    } = req.body;

    // if(!name || !tagline || !schedule || !description || !moderator || !category || !sub_category || !rigor_rank){
    //     return res.status(404)
    //         .json({
    //             status:404,
    //             message:"Please Provide all the fields name, tagline, schedule, description, moderator, category, sub_category, rigor_rank",
    //             data:null
    //         })
    // }
    console.log(req.body);
    const files = file.map((file) => file.path);
    const event = await eventCollection.insertOne({
      name,
      files,
      tagline,
      schedule,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank,
    });
    if (!event) {
      return res.status(400).json({
        status: 400,
        message: "Something went wrong",
        data: null,
      });
    }

    return res.json({
      status: 200,
      message: "Data saved saccussfully",
      data: event,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: 500,
      message: "Something went wrong",
      data: null,
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const file = req.files;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Please provide a valid object id",
        data: null,
      });
    }

    if (!data)
      return res.status(404).json({
        status: 404,
        message: "No field found Please provide at least one field",
        data: null,
      });

    const event = await eventCollection.findOne({ _id: new ObjectId(id) });
    if (!event) {
      return res.status(404).json({
        status: 404,
        message: "No Event found",
        data: null,
      });
    }

    if (file) {
      event.files.length &&
        event.files.map(async (file) => {
          await deleteFileByUrl(file);
        });
      data.files = file;
    }
    const result = await eventCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
    if (result) {
      return res.status(200).json({
        status: 200,
        message: "Data updated successfully",
        data: result,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 505,
      message: "Some thing went wrong",
      data: null,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Please provide a valid object id",
        data: null,
      });
    }
    const event = await eventCollection.findOne({ _id: new ObjectId(id) });
    if (!event) {
      return res.status(404).json({
        status: 404,
        message: "No Event found",
        data: null,
      });
    }

    const result = await eventCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return res.status(200).json({
        status: 200,
        message: "Data updated successfully",
        data: result,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: "Something went wrong while deletion",
        data: result,
      });
    }
  } catch (error) {
    console.log("Error at deleteEvent", error);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong ",
      data: null,
    });
  }
};

const getEventByQuery = async (req, res) => {
  const { type, limit = 10, page = 1,id } = req.query;
if(id){
  try {
    console.log(id);

    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "please provide a eventId",
        data: null,
      });
    }
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 400,
        message: "Please provide a valid object id",
        data: null,
      });
    }
    const event = await eventCollection.findOne({ _id: new ObjectId(id) });
    if (!event) {
      return res.status(404).json({
        status: 404,
        message: "No Event found",
        data: null,
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "Data fetched successfully",
        data: event,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong ",
      data: null,
    });
  }
}
  try {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
  
    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid limit or page value",
        data: null,
      });
    }
   
      let query = {};
      if (type) {
        query.type = type;
      }
      console.log(query);
      
      const events = await eventCollection
        .find(query)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .toArray();
        console.log(events);
        
      if (events.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "Data Not  Found",
          data: null,
        });
      }
      return res.status(200).json({
        status: 200,
        message: "Data fetched successfully",
        data: events,
      });
  
  } catch (error) {
    console.log("Error at pagination", error);
      return res.status(200).json({
        status: 500,
        message: "Something went wrong",
        data: null,
      });
  }
 
};


export { createEvent, updateEvent, deleteEvent,getEventByQuery};
