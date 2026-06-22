const Contact = require("../models/Contacts");
console.log("SCHEMA PATHS:");
console.log(Object.keys(Contact.schema.paths));

const createContact = async (req, res) => {
    try {

        console.log("REQ.USER =", req.user);

        const existingContact = await Contact.findOne({
        user: req.user.userId,
        phone: req.body.phone
        });

        if (existingContact) {
            return res.status(400).json({
                message: "Contact already exists"
            });
        }
        const contact=await Contact.create({
                user: req.user.userId,
                name: req.body.name,
                phone: req.body.phone

        });
        console.log(contact);
        console.log(Contact.schema.paths);
        res.status(201).json(contact);
        

     
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getContacts = async (req, res) => {
    try {

        console.log("GET USER =", req.user);

        const contacts = await Contact.find({
            user: req.user.userId
        });

        console.log("CONTACTS =", contacts);

        res.status(200).json(contacts);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateContact = async (req, res) => {
    try {

        const updatedContact = await Contact.findOneAndUpdate(
    {
        _id: req.params.id,
        user: req.user.userId
    },
    req.body,
    { new: true }
);
        if (!updatedContact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.status(200).json(updatedContact);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
const deleteContact = async (req, res) => {
    try {

        const deletedContact = await Contact.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!deletedContact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.status(200).json({
            message: "Contact deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = { createContact,getContacts,updateContact,deleteContact };