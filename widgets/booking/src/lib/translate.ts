import type {Venue} from "../types/domain/types.ts";

export const tr = (text: string, venue: Venue | undefined) => {
    if (venue === undefined) {
        return text
    }

    switch (venue.code) {
        case 'date-mate':
            if (text === 'What eventType type do you need?') text = 'What date type do you fancy?'
            if (text === 'appointment') text = 'date'
            if (text === 'EventType') text = 'Date style'
            if (text === 'EventHost') text = 'Date Host'
            if (text === 'Not a working day') text = 'No availability'
            break;
        case 'rachelle-hairdressing':
        case 'paddington-hairdressing':
            if (text === 'What eventType type do you need?') text = 'What haircut type do you fancy?'
            if (text === 'EventType') text = 'Haircut style'
            if (text === 'EventHost') text = 'Hairdresser'
            if (text === 'Not a working day') text = 'No availability'
            break;
        case 'poole-rugby':
            if (text === 'What eventType type do you need?') text = 'What event type do you fancy?'
            if (text === 'EventType') text = 'Event Type'
            if (text === 'EventHost') text = 'Trainer'
            if (text === 'Not a working day') text = 'No event'
            if (text === 'Book') text = 'Call team'
            break;
        case 'digital-rise-dorset':
            if (text === 'What eventType type do you need?') text = 'How do you want to meet?'
            if (text === 'EventType') text = 'Meeting Type'
            if (text === 'eventType') text = 'Appointment'
            if (text === 'EventHost') text = 'Appointment Host'
            if (text === 'Not a working day') text = 'No availability'
            if (text === 'In Cart!') text = 'Invite Sent'
            break;
        case 'southern-solar':
            if (text === 'Appointment type') text = 'What can we help you with?';
            if (text === 'Event type') text = 'Choose your appointment';
            if (text === 'Presenter') text = 'Your solar specialist';
            break;
        case 'green-edge':
            if (text === 'Appointment type') text = 'What type of care does your garden needs?';
            if (text === 'Event type') text = 'Choose your appointment';
            if (text === 'Presenter') text = 'Your gardener specialist';
            break;
        case 'stocking-filler':
            if (text === 'Appointment') text = 'Treat'
            if ((text === 'Week')) text = 'Minute'
            break;
        case 'qichen-restaurant':
            if (text === "Let's set your appointment details") text = "Let's organise your party"
            if (text === 'Appointment') text = 'Party'
            if (text === 'Appointment') text = 'Party'
            if (text === 'What eventType type do you need?') text = 'What haircut type do you fancy?'
            if (text === 'EventType') text = 'Number of guests'
            if (text === 'EventHost') text = 'Waiter / Waitress'
            if (text === 'Not a working day') text = 'No availability'
            break;
    }
    return text
}