# CopacaBela-Anmeldetool

Diese Seite war das offizielle Anmelde- und TN-Managementtool des Bezirkslagers 2022 des DPSG Bezirks München-Isar - des CopacaBeLas.


## Features

- Participants registration
  - During the registration particpants could fill out the registration form
  - The data was saved and the needed documents were filled out and sent to the particpant for signing them.
- Participant management
  - All groups could monitor the registrations of their participants.
  - During the registration phase data could be changed by group leaders
  - Granular access control: Each group can invite users for all levels
  - Document state management: Group leaders can check the received documents and filter for incomplete registrations
  - Registration state management: Group leaders had to confirm all registrations (when all documents were received)
  - Leader management
    - The organizational board can check and confirm all additional needed documents for leaders
  - Presence management: Quick check who is on-site or away for emergency / evacuation scenarios
  - Export as CSV
- Statistics: Easy overview of all participant numbers
- Kitchen tools: Easy access to all allergies and eating behviours without exposing sensitive data
- Strandkorb: Payment tool for the on-site bar
  - Easy product management with variable prices
  - Quick payment processing via the order number of each participant
  - Transaction logs

 
## Technical background

The tool uses NextJS for the frontend together with Payload CMS as backend / application framework.


## Deployment

Use the included docker-compose for a quick deployment of the tool together with the needed MongoDB database
