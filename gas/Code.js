/**
 * AppSprint — Google Apps Script Backend
 * =========================================
 * Deploy this file as a Google Apps Script Web App with:
 *   - Execute as: Me
 *   - Who has access: Anyone
 *
 * SHEET STRUCTURE:
 *   Sheet 1: "users"       — id, name, email, created_at
 *   Sheet 2: "submissions" — id, user_email, title, description, target_user, monetization, status, rejection_reason, created_at, updated_at
 *   Sheet 3: "settings"    — key, value
 *
 * ENDPOINTS (via action param):
 *   GET:
 *     - getSubmissionByEmail
 *     - getAllSubmissions
 *     - getSettings
 *   POST:
 *     - createUser
 *     - createSubmission
 *     - updateSubmissionStatus
 *     - updateSettings
 */

// ── CORS Headers ──────────────────────────────────────────────────────────────

/**
 * Creates a CORS-enabled response object.
 * Required to allow cross-origin requests from the Next.js frontend.
 *
 * @param {Object} data - Response payload to serialize as JSON
 * @returns {TextOutput} Google Apps Script text output with CORS headers
 */
function createCorsResponse(data) {
    const output = ContentService.createTextOutput(JSON.stringify(data));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
}

// ── Utility Helpers ───────────────────────────────────────────────────────────

/**
 * Generates a unique ID using timestamp + random suffix.
 *
 * @returns {string} Unique identifier (e.g. "1706789012345_abc123")
 */
function generateId() {
    return Date.now() + "_" + Math.random().toString(36).substr(2, 6);
}

/**
 * Retrieves a sheet by name from the active spreadsheet.
 *
 * @param {string} name - The sheet tab name
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} The found sheet
 * @throws {Error} If sheet is not found
 */
function getSheet(name) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(name);
    if (!sheet) {
        throw new Error("Sheet '" + name + "' not found in spreadsheet.");
    }
    return sheet;
}

/**
 * Reads all data from a sheet and converts it to an array of objects.
 * First row is treated as headers.
 *
 * @param {string} sheetName - The sheet name to read
 * @returns {Object[]} Array of row objects with header keys
 */
function getAllRows(sheetName) {
    const sheet = getSheet(sheetName);
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) return [];

    const headers = data[0];
    return data.slice(1).map(function (row) {
        const obj = {};
        headers.forEach(function (header, i) {
            obj[header] = row[i];
        });
        return obj;
    });
}

/**
 * Appends a new row to a sheet based on the sheet's header order.
 *
 * @param {string} sheetName - Target sheet name
 * @param {Object} rowData - Object with field keys matching headers
 */
function appendRow(sheetName, rowData) {
    const sheet = getSheet(sheetName);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = headers.map(function (header) {
        return rowData[header] !== undefined ? rowData[header] : "";
    });
    sheet.appendRow(row);
}

// ── GET Handler ───────────────────────────────────────────────────────────────

/**
 * Handles all HTTP GET requests to the web app.
 * Routes to the appropriate handler based on the `action` query parameter.
 *
 * @param {GoogleAppsScript.Events.DoGet} e - The GET event object
 * @returns {TextOutput} JSON response
 */
function doGet(e) {
    try {
        const action = e.parameter.action;

        switch (action) {
            case "getSubmissionByEmail":
                return handleGetSubmissionByEmail(e.parameter.email);
            case "getAllSubmissions":
                return handleGetAllSubmissions();
            case "getSettings":
                return handleGetSettings();
            default:
                return createCorsResponse({ success: false, error: "Unknown action: " + action });
        }
    } catch (err) {
        return createCorsResponse({ success: false, error: err.message });
    }
}

// ── POST Handler ──────────────────────────────────────────────────────────────

/**
 * Handles all HTTP POST requests to the web app.
 * Parses JSON body and routes by `action` field.
 *
 * @param {GoogleAppsScript.Events.DoPost} e - The POST event object
 * @returns {TextOutput} JSON response
 */
function doPost(e) {
    try {
        const body = JSON.parse(e.postData.contents);
        const action = body.action;

        switch (action) {
            case "createUser":
                return handleCreateUser(body);
            case "createSubmission":
                return handleCreateSubmission(body);
            case "updateSubmissionStatus":
                return handleUpdateSubmissionStatus(body);
            case "updateSettings":
                return handleUpdateSettings(body);
            default:
                return createCorsResponse({ success: false, error: "Unknown action: " + action });
        }
    } catch (err) {
        return createCorsResponse({ success: false, error: err.message });
    }
}

// ── Action Handlers ───────────────────────────────────────────────────────────

/**
 * Creates a new user record in the "users" sheet.
 * Idempotent: returns existing user if email already exists.
 *
 * @param {Object} body - Request body
 * @param {string} body.name - User's full name
 * @param {string} body.email - User's email address
 * @returns {TextOutput} Created or existing user record
 */
function handleCreateUser(body) {
    const { name, email } = body;

    if (!email || !name) {
        return createCorsResponse({ success: false, error: "Missing name or email." });
    }

    const users = getAllRows("users");
    const existing = users.find(function (u) { return u.email === email; });

    if (existing) {
        return createCorsResponse({ success: true, data: existing });
    }

    const newUser = {
        id: generateId(),
        name: name,
        email: email,
        created_at: new Date().toISOString(),
    };

    appendRow("users", newUser);
    return createCorsResponse({ success: true, data: newUser });
}

/**
 * Creates a new submission in the "submissions" sheet.
 * Enforces one-submission-per-email rule (server-side).
 *
 * @param {Object} body - Request body
 * @param {string} body.user_email - Submitter's email
 * @param {string} body.title - Idea title
 * @param {string} body.description - Idea description
 * @param {string} body.target_user - Target user description
 * @param {string} [body.monetization] - Optional monetization strategy
 * @returns {TextOutput} Created submission record or error
 */
function handleCreateSubmission(body) {
    const { user_email, title, description, target_user, monetization } = body;

    if (!user_email || !title || !description || !target_user) {
        return createCorsResponse({ success: false, error: "Missing required fields." });
    }

    const submissions = getAllRows("submissions");
    const alreadySubmitted = submissions.find(function (s) {
        return s.user_email === user_email;
    });

    if (alreadySubmitted) {
        return createCorsResponse({
            success: false,
            error: "You have already submitted an idea. Only one free submission is allowed.",
        });
    }

    // Check accepting_submissions setting
    const settings = getAllRows("settings");
    const acceptingSetting = settings.find(function (s) { return s.key === "accepting_submissions"; });
    if (acceptingSetting && acceptingSetting.value === "false") {
        return createCorsResponse({
            success: false,
            error: "Submissions are currently closed.",
        });
    }

    const now = new Date().toISOString();
    const newSubmission = {
        id: generateId(),
        user_email: user_email,
        title: title,
        description: description,
        target_user: target_user,
        monetization: monetization || "",
        status: "pending",
        rejection_reason: "",
        created_at: now,
        updated_at: now,
    };

    appendRow("submissions", newSubmission);
    return createCorsResponse({ success: true, data: newSubmission });
}

/**
 * Retrieves the most recent submission for a given email.
 *
 * @param {string} email - The user's email address to look up
 * @returns {TextOutput} Matching submission or null
 */
function handleGetSubmissionByEmail(email) {
    if (!email) {
        return createCorsResponse({ success: false, error: "Email is required." });
    }

    const submissions = getAllRows("submissions");
    const match = submissions.find(function (s) { return s.user_email === email; });

    return createCorsResponse({ success: true, data: match || null });
}

/**
 * Returns all submissions from the sheet. Admin use only.
 *
 * @returns {TextOutput} Array of all submission records
 */
function handleGetAllSubmissions() {
    const submissions = getAllRows("submissions");
    // Sort by created_at descending (newest first)
    submissions.sort(function (a, b) {
        return new Date(b.created_at) - new Date(a.created_at);
    });
    return createCorsResponse({ success: true, data: submissions });
}

/**
 * Updates a submission's status and optionally sets a rejection reason.
 * Also updates the updated_at timestamp.
 *
 * @param {Object} body - Request body
 * @param {string} body.id - Submission ID to update
 * @param {string} body.status - New status value
 * @param {string} [body.rejection_reason] - Reason for rejection (optional)
 * @returns {TextOutput} Success indicator
 */
function handleUpdateSubmissionStatus(body) {
    const { id, status, rejection_reason } = body;

    if (!id || !status) {
        return createCorsResponse({ success: false, error: "Missing id or status." });
    }

    const sheet = getSheet("submissions");
    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    const idCol = headers.indexOf("id");
    const statusCol = headers.indexOf("status");
    const rejectionCol = headers.indexOf("rejection_reason");
    const updatedAtCol = headers.indexOf("updated_at");

    let found = false;
    for (let i = 1; i < data.length; i++) {
        if (data[i][idCol] === id) {
            sheet.getRange(i + 1, statusCol + 1).setValue(status);
            sheet.getRange(i + 1, rejectionCol + 1).setValue(rejection_reason || "");
            sheet.getRange(i + 1, updatedAtCol + 1).setValue(new Date().toISOString());
            found = true;
            break;
        }
    }

    if (!found) {
        return createCorsResponse({ success: false, error: "Submission not found." });
    }

    return createCorsResponse({ success: true });
}

/**
 * Retrieves all settings as a key-value array from the "settings" sheet.
 *
 * @returns {TextOutput} Array of {key, value} pairs
 */
function handleGetSettings() {
    const settings = getAllRows("settings");
    return createCorsResponse({ success: true, data: settings });
}

/**
 * Updates or inserts settings in the "settings" sheet.
 * Each entry in the provided array will be upserted.
 *
 * @param {Object} body - Request body
 * @param {Array<{key: string, value: string}>} body.settings - Array of key-value pairs
 * @returns {TextOutput} Success indicator
 */
function handleUpdateSettings(body) {
    const { settings } = body;

    if (!Array.isArray(settings)) {
        return createCorsResponse({ success: false, error: "Settings must be an array." });
    }

    const sheet = getSheet("settings");
    const data = sheet.getDataRange().getValues();

    // If sheet is empty, initialize with headers
    if (data.length === 0) {
        sheet.appendRow(["key", "value"]);
    }

    const allData = sheet.getDataRange().getValues();
    const headers = allData[0];
    const keyCol = headers.indexOf("key");
    const valueCol = headers.indexOf("value");

    settings.forEach(function (setting) {
        let found = false;
        for (let i = 1; i < allData.length; i++) {
            if (allData[i][keyCol] === setting.key) {
                sheet.getRange(i + 1, valueCol + 1).setValue(setting.value);
                allData[i][valueCol] = setting.value; // keep in-memory state consistent
                found = true;
                break;
            }
        }
        if (!found) {
            sheet.appendRow([setting.key, setting.value]);
        }
    });

    return createCorsResponse({ success: true });
}
