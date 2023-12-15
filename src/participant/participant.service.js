const { participant } = require("../db");
const {
  findParticipants,
  insertParticipant,
  findParticipantById,
  editParticipant,
  deleteParticipant: deleteParticipantRepository,
  findParticipantAlreadyExist,
} = require("./participant.repository");

const getAllParticipant = async () => {
  const participant = await findParticipants();

  return participant;
};

const getParticipantById = async (id) => {
  const participant = await findParticipantById(id);

  return participant;
};

const getParticipantAlreadyExist = async (nim) => {
  const participant = await findParticipantAlreadyExist(nim);

  return participant;
};

const createParticipant = async (participantData) => {
  const participant = await insertParticipant(participantData);

  return participant;
};

const updateParticipant = async (id, participantData) => {
  await getParticipantById(id);

  const participant = await editParticipant(id, participantData);

  return participant;
};

const deleteParticipant = async (id) => {
  await getParticipantById(id);
  await deleteParticipantRepository(id);
};

module.exports = {
  getAllParticipant,
  getParticipantById,
  getParticipantAlreadyExist,
  createParticipant,
  updateParticipant,
  deleteParticipant,
};
