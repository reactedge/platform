import assert from "node:assert/strict";
import test from "node:test";
import { GolfCourseApiError, GolfCourseSearchService } from "../src/domain/golf-course-search.service.ts";

test("search calls the golf course API with postcode and radius", async () => {
    let requestedUrl: URL | undefined;
    const service = new GolfCourseSearchService("https://api.example.test", async input => {
        requestedUrl = new URL(String(input));
        return Response.json({
            postcode: "GU25 4LH",
            radius_miles: 10,
            total: 1,
            courses: [{ id: "course-1", name: "Example Golf Club", distance_miles: 2.4 }],
        });
    });

    const result = await service.search(" gu25  4lh ", 10);

    assert.equal(requestedUrl?.pathname, "/golfcourses/nearby");
    assert.equal(requestedUrl?.searchParams.get("postcode"), "gu25  4lh");
    assert.equal(requestedUrl?.searchParams.get("radius_miles"), "10");
    assert.equal(result.courses[0]?.name, "Example Golf Club");
});

test("search surfaces API errors and rejects malformed success payloads", async () => {
    const failed = new GolfCourseSearchService("https://api.example.test", async () =>
        Response.json({ error: "The postcode was not recognised." }, { status: 400 }),
    );
    await assert.rejects(
        failed.search("invalid", 10),
        (error: unknown) => error instanceof GolfCourseApiError && error.message.includes("postcode"),
    );

    const malformed = new GolfCourseSearchService("https://api.example.test", async () =>
        Response.json({ courses: [] }),
    );
    await assert.rejects(
        malformed.search("GU25 4LH", 10),
        /invalid response/i,
    );
});

test("search distinguishes timeouts from connection failures", async () => {
    const timedOut = new GolfCourseSearchService("https://api.example.test", async () => {
        throw new DOMException("The operation timed out", "TimeoutError");
    });
    await assert.rejects(
        timedOut.search("GU25 4LH", 10),
        /search timed out/i,
    );

    const unreachable = new GolfCourseSearchService("https://api.example.test", async () => {
        throw new TypeError("Failed to fetch");
    });
    await assert.rejects(
        unreachable.search("GU25 4LH", 10),
        /service could not be reached/i,
    );
});

test("availability check probes the service status endpoint", async () => {
    let requestedUrl: string | undefined;
    const service = new GolfCourseSearchService("https://api.example.test", async input => {
        requestedUrl = String(input);
        return Response.json({ status: "ok" });
    });

    assert.equal(await service.checkAvailability(), true);
    assert.equal(new URL(requestedUrl!).pathname, "/golfcourses/status");
});
