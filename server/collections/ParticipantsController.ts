import { CollectionConfig, Where } from 'payload/types';
import { isValidTribe, TribesWithDistrict } from '../../src/utilitites/Tribes';
import Levels, { AccessLevels, isValidLevel } from '../../src/utilitites/Levels';
import { TeilnehmendenverwalterIn, User } from '../../payload-types';
import { Access } from 'payload/config';

export type ParticipantsControllerUser = (TeilnehmendenverwalterIn | User) & { collection: string }

const ParticipantsControllerQuery = (user: ParticipantsControllerUser ) => {
  if (user.collection == "users") {
    return true
  }
  const participantController = user as TeilnehmendenverwalterIn
  const query: Where = {}
  // BeVos can access all tribe users & district level accesses
  if (participantController.tribe === "1312" && participantController.level === "all") {
    query.or = [
      { tribe: { not_equals: "1312" } },
      { and: [ {tribe: { equals: "1312"}}, {level: { not_equals: "all" }}] }
    ]
    console.log("bevo")
    return query
  }

  // StaVos can access their tribe but not themself
  if (participantController.tribe !== "1312" && participantController.level === "all") {
    query.tribe = {
      equals: participantController.tribe
    }
    query.level = {
      not_equals: "all"
    }
    console.log("stavo")
    return query
  }

  query.tribe = {
    equals: "no"
  }

  query.level = {
    equals: "no"
  }
  console.log("other")
  return query
}

const ParticipantsControllerAccess: Access = ({ req: { user } }: { req: { user: ParticipantsControllerUser }}) => ParticipantsControllerQuery(user)

const ParticipantsController: CollectionConfig = {
  slug: "participantscontroller",
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      required: true
    },
    {
      name: "tribe",
      type: "select",
      options: TribesWithDistrict.map(tribe => ({
        label: tribe.name,
        value: String(tribe.number)
      })),
      label: "Zugriffsbereich",
      required: true
    },
    {
      name: "level",
      type: "select",
      options: AccessLevels.map(level => ({
        label: level.plural,
        value: level.slug
      })),
      label: "Stufe",
      required: true
    }
  ],
  labels: {
    singular: "Teilnehmendenverwalter:in",
    plural: "Teilnehmendenverwaltende"
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "tribe", "level"],
    disableDuplicate: true
  },
  access: {
    read: ParticipantsControllerAccess,
    create: ParticipantsControllerAccess,
    update: ParticipantsControllerAccess,
    delete: ParticipantsControllerAccess
  },
  auth: true,
}

export default ParticipantsController
