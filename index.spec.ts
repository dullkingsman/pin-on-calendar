import { getClientLink, getIcsData } from "./index";
import { test, describe, expect, beforeAll } from "@jest/globals";

const goal = {
  google:
    "https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20230605T033000Z%2F20230606T123000Z&details=The%20hike%20to%20make%20you%20or%20break%20you.&location=F3HM%2B4W%20Huayin%2C%20Weinan%2C%20Shaanxi%2C%20China&text=Hike%20to%20T%27ai-hua%20Shan",
  outlook:
    "https://outlook.live.com/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&allday=false&body=The%20hike%20to%20make%20you%20or%20break%20you.&enddt=2023-06-06T12%3A30%3A00.000Z&location=F3HM%2B4W%20Huayin%2C%20Weinan%2C%20Shaanxi%2C%20China&startdt=2023-06-05T03%3A30%3A00.000Z&subject=Hike%20to%20T%27ai-hua%20Shan",
  office365:
    "https://outlook.office.com/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&allday=false&body=The%20hike%20to%20make%20you%20or%20break%20you.&enddt=2023-06-06T12%3A30%3A00.000Z&location=F3HM%2B4W%20Huayin%2C%20Weinan%2C%20Shaanxi%2C%20China&startdt=2023-06-05T03%3A30%3A00.000Z&subject=Hike%20to%20T%27ai-hua%20Shan",
  yahoo:
    "https://calendar.yahoo.com/?v=60&desc=The%20hike%20to%20make%20you%20or%20break%20you.&dur=false&et=20230606T123000Z&in_loc=F3HM%2B4W%20Huayin%2C%20Weinan%2C%20Shaanxi%2C%20China&st=20230605T033000Z&title=Hike%20to%20T%27ai-hua%20Shan",
  ics:
    "BEGIN:VCALENDAR\n" +
    "VERSION:2.0\n" +
    "CALSCALE:GREGORIAN\n" +
    "\n" +
    "BEGIN:VEVENT\n" +
    "DTSTART:20230605T033000Z\n" +
    "DTEND:20230606T123000Z\n" +
    "SUMMARY:Hike to T'ai-hua Shan\n" +
    "DESCRIPTION:The hike to make you or break you.\n" +
    "LOCATION:F3HM+4W Huayin, Weinan, Shaanxi, China\n" +
    "ORGANIZER;CN=Hikers Guild:mailto:contact@hikersguild.org\n" +
    "URL:https://hikersguild.com/events/b9tt9g0ab7fqranc\n" +
    "END:VEVENT\n" +
    "\n" +
    "BEGIN:VEVENT\n" +
    "DTSTART:20230605\n" +
    "SUMMARY:Hike to T'ai-hua Shan\n" +
    "DESCRIPTION:The hike to make you or break you.\n" +
    "LOCATION:F3HM+4W Huayin, Weinan, Shaanxi, China\n" +
    "ORGANIZER;CN=Hikers Guild:mailto:contact@hikersguild.org\n" +
    "URL:https://hikersguild.com/events/b9tt9g0ab7fqranc\n" +
    "END:VEVENT\n" +
    "END:VCALENDAR",
  google_no_end_date:
    "https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20230605T033000Z&details=The%20hike%20to%20make%20you%20or%20break%20you.&location=F3HM%2B4W%20Huayin%2C%20Weinan%2C%20Shaanxi%2C%20China&text=Hike%20to%20T%27ai-hua%20Shan",
  google_with_rrule:
    "https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20230605T033000Z%2F20230606T123000Z&details=The%20hike%20to%20make%20you%20or%20break%20you.&location=F3HM%2B4W%20Huayin%2C%20Weinan%2C%20Shaanxi%2C%20China&recur=RRULE%3AFREQ%3DWEEKLY%3BUNTIL%3D20110701T170000Z&text=Hike%20to%20T%27ai-hua%20Shan",
  yahoo_all_day:
    "https://calendar.yahoo.com/?v=60&desc=The%20hike%20to%20make%20you%20or%20break%20you.&dur=allday&in_loc=F3HM%2B4W%20Huayin%2C%20Weinan%2C%20Shaanxi%2C%20China&st=20230605&title=Hike%20to%20T%27ai-hua%20Shan",
  ics_minimal:
    "BEGIN:VCALENDAR\n" +
    "VERSION:2.0\n" +
    "CALSCALE:GREGORIAN\n" +
    "\n" +
    "BEGIN:VEVENT\n" +
    "DTSTART:20230605T033000Z\n" +
    "SUMMARY:Hike to T'ai-hua Shan\n" +
    "END:VEVENT\n" +
    "END:VCALENDAR",
  ics_with_rrule:
    "BEGIN:VCALENDAR\n" +
    "VERSION:2.0\n" +
    "CALSCALE:GREGORIAN\n" +
    "\n" +
    "BEGIN:VEVENT\n" +
    "DTSTART:20230605T033000Z\n" +
    "DTEND:20230606T123000Z\n" +
    "SUMMARY:Hike to T'ai-hua Shan\n" +
    "DESCRIPTION:The hike to make you or break you.\n" +
    "LOCATION:F3HM+4W Huayin, Weinan, Shaanxi, China\n" +
    "RRULE:FREQ=WEEKLY;UNTIL=20110701T170000Z\n" +
    "ORGANIZER;CN=Hikers Guild:mailto:contact@hikersguild.org\n" +
    "URL:https://hikersguild.com/events/b9tt9g0ab7fqranc\n" +
    "END:VEVENT\n" +
    "END:VCALENDAR",
};

const input = {
  title: "Hike to T'ai-hua Shan",
  startDate: "2023-06-05T03:30:00Z",
  endDate: "2023-06-06T12:30:00Z",
  description: "The hike to make you or break you.",
  location: "F3HM+4W Huayin, Weinan, Shaanxi, China",
  organizer: { name: "Hikers Guild", email: "contact@hikersguild.org" },
  url: `https://hikersguild.com/events/b9tt9g0ab7fqranc`,
};

let result = {
  google: "",
  outlook: "",
  office365: "",
  yahoo: "",
  ics: "",
  google_no_end_date: "",
  google_with_rrule: "",
  yahoo_all_day: "",
  ics_minimal: "",
  ics_with_rrule: "",
};

describe("Generators", () => {
  beforeAll(() => {
    result = {
      google: getClientLink("google", input),
      outlook: getClientLink("outlook", input),
      office365: getClientLink("office365", input),
      yahoo: getClientLink("yahoo", input),
      ics: getIcsData([input, { ...input, allDay: true }]),
      google_no_end_date: getClientLink("google", {
        ...input,
        endDate: undefined,
      }),
      google_with_rrule: getClientLink("google", {
        ...input,
        rRule: "FREQ=WEEKLY;UNTIL=20110701T170000Z",
      }),
      yahoo_all_day: getClientLink("yahoo", { ...input, allDay: true }),
      ics_minimal: getIcsData([
        { title: input.title, startDate: input.startDate },
      ]),
      ics_with_rrule: getIcsData([
        { ...input, rRule: "FREQ=WEEKLY;UNTIL=20110701T170000Z" },
      ]),
    };
  });

  test("Generates for google!", () => {
    expect(result.google).toStrictEqual(goal.google);
  });
  test("Generates for outlook!", () => {
    expect(result.outlook).toStrictEqual(goal.outlook);
  });
  test("Generates for outlook live!", () => {
    expect(result.office365).toStrictEqual(goal.office365);
  });
  test("Generates for yahoo!", () => {
    expect(result.yahoo).toStrictEqual(goal.yahoo);
  });
  test("Generates ICS!", () => {
    expect(result.ics).toStrictEqual(goal.ics);
  });
  test("Generates for google with no end date!", () => {
    expect(result.google_no_end_date).toStrictEqual(goal.google_no_end_date);
  });
  test("Generates for google with rrule!", () => {
    expect(result.google_with_rrule).toStrictEqual(goal.google_with_rrule);
  });
  test("Generates for yahoo with all day!", () => {
    expect(result.yahoo_all_day).toStrictEqual(goal.yahoo_all_day);
  });
  test("Generates minimal ICS!", () => {
    expect(result.ics_minimal).toStrictEqual(goal.ics_minimal);
  });
  test("Generates ICS with rrule!", () => {
    expect(result.ics_with_rrule).toStrictEqual(goal.ics_with_rrule);
  });
});
