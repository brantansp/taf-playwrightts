## Run the tests from command line
npx playwright test

## View the test results
npx playwright show-report

## Run the project specific tests
npx playwright test project=chromium

## Run tests in headed mode
npx playwright test --headed

## Run the specific test file
npx playwright test example.spec.ts

## Run the specific tests from a test file
npx playwright test -g "get started link"

## Skipping a test
test.skip

## Running only specified tests
test.only

## Ruuning the tests in CLI with trace on
npx playwright test --project="chromium" --trace on

## Ruuning the tests in CLI with debug
npx playwright test --project="chromium" --debug

## If apage method returns a promise then it should be preceded by an await and the method should be async to avoid race condition. If it does not returns a promise then no need to have await

## ## ## ## ##
## Locators ##
## ## ## ## ##

# By HTML Tag
page.locator('input')

# By ID
page.locator('#userName')

# By partial Class name
page.locator('.ui-button-isactive')

# By attribute
page.locator("[placeholder="Username"][type="text"]")

# By xpath
page.locator("//input[text()='Enter user name']")

# By using text
page.locator(":text("Login")")

# By using exact text
page.locator(":text-is("Login to salesforce")")

# By using predefined methods
page.getByRole('button', {name : "Login"}).click()

page.getByPlaceholder("username").click()

page.getByTitle("Header").click()

page.getByLabel("User Name").type("standard_user")

page.getByTestId("signin").click()  ### application should have attribute @data-testid="signin"

page.getByText("Login").click()