import { test, expect } from "@playwright/test";
import {
  ClassicRunner,
  BatchInfo,
  Configuration,
  Eyes,
  Target,
} from "@applitools/eyes-playwright";

// Applitools objects to share for all tests
export let Runner: ClassicRunner;
export let Batch: BatchInfo;
export let Config: Configuration;

test.beforeAll(async () => {
  // Create the classic runner.
  Runner = new ClassicRunner();

  // Create a new batch for tests.
  Batch = new BatchInfo({ name: "Visual testing with Classic Runner" });

  // Create a configuration for Applitools Eyes.
  Config = new Configuration();

  // Set the batch for the config.
  Config.setBatch(Batch);

  Config.setApiKey("E05FP7Mb156WSmTbmt22wJ3jt8iTlRFinAK0Bqc2nac110");
});

test.describe("Conduit", () => {
  let eyes: Eyes;

  test.beforeEach(async ({ page }) => {
    eyes = new Eyes(Runner, Config);

    await eyes.open(page, "Conduit Test App", test.info().title);
  });

  test("log into conduit", async ({ page }) => {
    // Load the home page.
    await page.goto("http://localhost:4200");

    // Check to make sure it's visually correct
    await eyes.check("Home page", Target.window().fully());

    // Click the signup button
    await page.locator("id=signin").click();

    await eyes.check("Signin page", Target.window().fully());

    // Perform login.
    await page.locator("id=email").fill("haseebsaeed@test.com");
    await page.locator("id=password").fill("suzy");
    await page.locator("id=auth-submit").click();

    // Verify the full main page loaded correctly.
    // This snapshot uses LAYOUT match level to avoid differences in closing time text.
    await eyes.check("Home page", Target.window().fully().layout());
  });

  // This method performs cleanup after each test.
  test.afterEach(async () => {
    // Close Eyes to tell the server it should display the results.
    await eyes.closeAsync();
  });
});

test.afterAll(async () => {
  const results = await Runner.getAllTestResults();
  console.log("Visual test results", results);
});
