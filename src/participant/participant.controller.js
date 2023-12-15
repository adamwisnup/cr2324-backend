const {
  getAllParticipant,
  getParticipantById,
  getParticipantAlreadyExist,
  updateParticipant,
  deleteParticipant,
  createParticipant,
} = require("./participant.service");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const participant = await getAllParticipant();

  res.json({
    message: "get all participant success",
    data: participant,
  });
});

router.get("/:id", async (req, res) => {
  try {
    const participantId = req.params.id;

    if (!Number.isInteger(parseInt(participantId))) {
      return res.status(400).json({
        message: "Invalid participant ID format. Must be an integer.",
      });
    }

    const participant = await getParticipantById(parseInt(participantId));

    if (!participant) {
      return res.status(404).json({ message: "Participant not found." });
    }

    res.json({
      message: "Get participant by ID success",
      data: participant,
    });
  } catch (error) {
    console.error("Error while getting participant by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      nim,
      class: participantClass,
      major,
      email,
      faculty,
      gender,
      phone_number,
      entry_year,
      document,
    } = req.body;

    if (
      !name ||
      !nim ||
      !participantClass ||
      !major ||
      !email ||
      !faculty ||
      !gender ||
      !phone_number ||
      !entry_year ||
      !document
    ) {
      return res.status(400).json({ message: "Some fields are missing" });
    }

    const existingParticipant = await getParticipantAlreadyExist(
      name,
      nim,
      participantClass,
      major,
      email,
      faculty,
      gender,
      phone_number,
      entry_year,
      document
    );
    if (existingParticipant) {
      return res.status(400).json({ message: "Participant already exists" });
    }

    if (
      typeof name !== "string" ||
      typeof nim !== "string" ||
      typeof participantClass !== "string" ||
      typeof email !== "string" ||
      typeof major !== "string" ||
      typeof faculty !== "string" ||
      typeof gender !== "string" ||
      typeof phone_number !== "string" ||
      typeof entry_year !== "string" ||
      typeof document !== "string"
    ) {
      return res.status(400).json({ message: "Invalid data types or values" });
    }

    const newParticipant = await createParticipant({
      name,
      nim,
      class: participantClass,
      major,
      email,
      faculty,
      gender,
      phone_number,
      entry_year,
      document,
    });

    res.status(201).json({
      message: "Register participant success",
      data: newParticipant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const participantId = req.params.id;
    const participantData = req.body;

    const participant = await updateParticipant(
      parseInt(participantId),
      participantData
    );

    res.json({
      message: "update participant success",
      data: participant,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const participantId = req.params.id;

    await deleteParticipant(parseInt(participantId));

    res.json({
      message: "delete participant success",
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
