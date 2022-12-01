import * as moment from "moment";
import { stringify } from "query-string";
import { Client, Event, Organizer } from "./types";
import {
  dataUrlFromBlob,
  downloadFromBlob,
  getTextBlobFromString,
} from "./utils";

/**
 * Redirects to the specified calendar client.
 * @param client
 * @param event
 */
export function addToCalendar(client: Client, event: Event) {
  window.open(getClientLink(client, event), "_blank");
}

/**
 * Downloads the ICS file.
 */
export function downloadIcsFile(events: Array<Event>, fileName?: string) {
  downloadFromBlob(
    getTextBlobFromString(getIcsData(events)),
    `${fileName ? fileName : "event"}.ics`
  );
}

/**
 * Generates the proper link for the provided
 * client.
 * ___
 * N.B. For an `ics` client, this function
 * will produce a Data URL.
 */
export function getClientLink(client: Client, event: Event) {
  return `${getLinkStarter(client)}&${
    client === "ics"
      ? dataUrlFromBlob(getTextBlobFromString(getIcsData([event])))
      : getParams(client as Client, event)
  }`;
}

/**
 * Generates the ICS file data.
 */
export function getIcsData(events: Array<Event>) {
  return (
    "BEGIN:VCALENDAR\n" +
    "VERSION:2.0\n" +
    "CALSCALE:GREGORIAN\n" +
    `${events
      .map((event) => {
        return `BEGIN:VEVENT\n${getParams("ics", event)}END:VEVENT\n`;
      })
      .reduce((pre, curr) => `${pre}\n${curr}`, "")}` +
    "END:VCALENDAR"
  );
}

function getParams(client: Client, event: Event): string {
  const formattedEvent = formatEventDates(client, event);

  switch (client) {
    case "google":
      return stringify({
        text: formattedEvent.title,
        details: formattedEvent.description,
        location: formattedEvent.location,
        trp: formattedEvent.busy,
        dates: `${formattedEvent.startDate}${
          formattedEvent.endDate ? `/${formattedEvent.endDate}` : ``
        }`,
        recur: formattedEvent.rRule && `RRULE:${formattedEvent.rRule}`,
      });
    case "outlook":
    case "office365":
      return stringify({
        startdt: formattedEvent.startDate,
        enddt: formattedEvent.endDate,
        subject: formattedEvent.title,
        body: formattedEvent.description,
        location: formattedEvent.location,
        allday: formattedEvent.allDay ?? false,
      });
    case "yahoo":
      return stringify({
        title: formattedEvent.title,
        st: formattedEvent.startDate,
        et: formattedEvent.endDate,
        desc: formattedEvent.description,
        in_loc: formattedEvent.location,
        dur: formattedEvent.allDay ? "allday" : false,
      });
    case "ics":
      return `${
        !!formattedEvent.startDate
          ? `DTSTART:${formattedEvent.startDate}\n`
          : ""
      }${!!formattedEvent.endDate ? `DTEND:${formattedEvent.endDate}\n` : ""}${
        !!formattedEvent.title ? `SUMMARY:${formattedEvent.title}\n` : ""
      }${
        !!formattedEvent.description
          ? `DESCRIPTION:${formattedEvent.description}\n`
          : ""
      }${
        !!formattedEvent.location ? `LOCATION:${formattedEvent.location}\n` : ""
      }${!!formattedEvent.rRule ? `RRULE:${formattedEvent.rRule}\n` : ""}${
        !!formattedEvent.organizer
          ? `ORGANIZER;CN=${formattedEvent.organizer.name}:mailto:${formattedEvent.organizer.email}\n`
          : ""
      }${!!formattedEvent.url ? `URL:${formattedEvent.url}\n` : ""}`;
  }
}

function formatEventDates(client: Client, event: Event) {
  return {
    ...event,
    startDate: event.startDate && formatDate(event.startDate),
    endDate:
      event.endDate && !event.allDay ? formatDate(event.endDate) : undefined,
  };
}

function formatDate(
  date: string,
  { client, allDay }: { client?: Client; allDay?: boolean } = {
    allDay: false,
  }
) {
  const microsoft = client === "outlook" || client === "office365";
  const yahoo = client === "yahoo";

  return (
    microsoft || yahoo ? moment(new Date(date)) : moment.utc(new Date(date))
  ).format(
    allDay
      ? "YYYYMMDD"
      : microsoft
      ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
      : "YYYYMMDD[T]HHmmss[Z]"
  );
}

function getLinkStarter(client: Omit<Client, "ics">) {
  switch (client) {
    case "google":
      return `https://calendar.google.com/calendar/render?action=TEMPLATE`;
    case "outlook":
      return `https://outlook.live.com/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent`;
    case "yahoo":
      return `https://calendar.yahoo.com/?v=60&`;
    case "office365":
      return `https://outlook.office.com/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent`;
  }
}

export { Client, Event, Organizer };
