import { TeilnehmerIn } from '../payload-types';

const handedInDocuments = (participant: TeilnehmerIn): { txt: string, complete: boolean} => {
  const parts: string[] = []
  let complete: boolean = true
  if (participant.receivedRegistration) {
    parts.push("Anmeldung")
  } else {
    complete = false;
  }

  if (participant.receivedPhotoPermission === "never") {
    parts.push("Keine Fotoerlaubnis")
  } else if (participant.receivedPhotoPermission === "yes") {
    parts.push("Fotoerlaubnis")
  } else {
    complete = false;
  }

  if (participant.role !== "participant" && participant.receivedLeaderInfo) {
    parts.push('Leiter:in-Info')
  } else if (participant.role !== "participant" ) {
    complete = false;
  }
  return {
    txt: complete ? "Alles" : parts.join(", "),
    complete
  }
}

export { handedInDocuments }
