// app/api/calendar/route.ts

import icalendar from "ical-generator"
import moment from "moment"

export async function GET(req) {
    if (req.method !== "GET") {
    return new Response("Method Not Allowed", {
        headers: { Allow: "GET" },
        status: 405,
    })
    }

    const filename = "calendar.ics"

    try {
    const calendar = icalendar({
        prodId: "//superman-industries.com//ical-generator//EN",
        events: [
            {
                start: moment(),
                end: moment().add(1, "hour"),
                summary: "Example Event",
                description: "It works ;)",
                url: "https://example.com"
            }
        ]
    });

    return new Response(calendar.toString(), {
        headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
        status: 200,
    })
    } catch (err) {
    console.error(err)
    return new Response(JSON.stringify(err), { status: 500 })
    }
}
