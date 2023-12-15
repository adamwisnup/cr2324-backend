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

    const participant = await getParticipantById(participantId);

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

    // Validasi apakah semua field terisi
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

    // Cek apakah peserta sudah ada berdasarkan beberapa field tertentu
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

    // Validasi tipe data dan ubah ke uppercase
    const uppercaseName = name.toUpperCase();
    const uppercaseNim = nim.toUpperCase();
    const uppercaseParticipantClass = participantClass.toUpperCase();
    const uppercaseMajor = major.toUpperCase();
    const uppercaseFaculty = faculty.toUpperCase();
    const uppercaseGender = gender.toUpperCase();
    const uppercasePhoneNumber = phone_number.toUpperCase();
    const uppercaseEntryYear = entry_year.toUpperCase();

    if (
      typeof uppercaseName !== "string" ||
      typeof uppercaseNim !== "string" ||
      typeof uppercaseParticipantClass !== "string" ||
      typeof email !== "string" ||
      typeof uppercaseMajor !== "string" ||
      typeof uppercaseFaculty !== "string" ||
      typeof uppercaseGender !== "string" ||
      typeof uppercasePhoneNumber !== "string" ||
      typeof uppercaseEntryYear !== "string" ||
      typeof document !== "string"
    ) {
      return res.status(400).json({ message: "Invalid data types or values" });
    }

    // Buat peserta baru dengan data yang sudah diubah
    const newParticipant = await createParticipant({
      name: uppercaseName,
      nim: uppercaseNim,
      class: uppercaseParticipantClass,
      major: uppercaseMajor,
      email,
      faculty: uppercaseFaculty,
      gender: uppercaseGender,
      phone_number: uppercasePhoneNumber,
      entry_year: uppercaseEntryYear,
      document,
    });

    // Jika berhasil, kirim respons sukses
    res.status(201).json({
      message: "Register participant success",
      data: newParticipant,
    });
  } catch (error) {
    console.error(error);

    // Tangani kesalahan jika post tidak berhasil
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const participantId = req.params.id;
    const participantData = req.body;

    const participant = await updateParticipant(participantId, participantData);

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

    await deleteParticipant(participantId);

    res.json({
      message: "delete participant success",
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
