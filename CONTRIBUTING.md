# Contributing

Thank you for helping keep this list accurate and up-to-date!<br>
Contributions are welcome, even if this is your first pull request.

## Before You Start

Please make sure the role you're contributing meets **all** of the following:

* ✅ A **technology-focused internship**
* ✅ Located in **Singapore**
* ✅ **Not already listed** (check for duplicates first)

---

## Adding a New Role

Follow the steps below to add a new internship to the list.

### Step 1: Edit the Right Part of the README

Open `README.md` and edit **only** the table between these markers:

* `<!-- JOBS_TABLE_START -->`
* `<!-- JOBS_TABLE_END -->`

Always add new rows **at the top of the table**, immediately after this separator row:

```markdown
|---|---|:---:|:---:|:---:|
```

Do **not** change the table header or column order.

### Step 2: Add a New Row

Copy the row below and replace the placeholders:

```markdown
| [COMPANY_NAME](COMPANY_URL) | JOB_TITLE | - | JOB_APPLICATION_URL | YYYY-MM-DD |
```

#### Notes

* **Company** must be a markdown link: `[Company Name](https://company.com)`
* **Track** must be exactly `-`
* **Application** must be a **plain URL**
  (no HTML, no buttons, no markdown)
* **Date Added** must be today's date in `YYYY-MM-DD` format

Newly added rows should remain **simple markdown (links + text only)** in your pull request — buttons are added automatically after merge.

**How the README will look in your pull request:**

```markdown
| Company | Role | Track | Application | Date Added |
|---|---|:---:|:---:|:---:|
| [OpenAI](https://openai.com) | Software Engineer Intern | - | https://example.com/apply | 2026-01-14 |
```

<details>
<summary>What will it look like after merge?</summary>

**Rendered in your pull request:**

| Company                      | Role                     | Track |                       Application                      | Date Added |
| ---------------------------- | ------------------------ | :---: | :----------------------------------------------------: | :--------: |
| [OpenAI](https://openai.com) | Software Engineer Intern |   -   | [https://example.com/apply](https://example.com/apply) | 2026-01-14 |

**After merge (next resync):**

| Company                      | Role                     | Track |                                               Application                                              |  Date Added |
| ---------------------------- | ------------------------ | :---: | :----------------------------------------------------------------------------------------------------: | :---------: |
| [OpenAI](https://openai.com) | Software Engineer Intern |   -   | <a href="https://example.com/apply"><img alt="Apply" src="readme-buttons/apply.svg" width="160" /></a> | 14 Jan 2026 |

</details>

---

## Understanding Row Types (Advanced)

If you're just adding a new role, you only need to care about **Community Rows**.

There are **two types of rows** in the table.

### 1) Community Rows

A row is a **community row** if the **Track** column is exactly `-`.

* ✅ Can be added, edited, or removed via pull requests
* ✅ Are the **only** type of row you should add in a pull request

Example row (community):

| Company                      | Role                     | Track |                                               Application                                              |  Date Added |
| ---------------------------- | ------------------------ | :---: | :----------------------------------------------------------------------------------------------------: | :---------: |
| [OpenAI](https://openai.com) | Software Engineer Intern |   -   | <a href="https://example.com/apply"><img alt="Apply" src="readme-buttons/apply.svg" width="160" /></a> | 14 Jan 2026 |

### 2) Database-Managed Rows

Rows where the **Track** column contains a **Track button link**
(e.g. a URL with `didtheyghost.me/job/<uuid>`) are managed by [didtheyghost.me](https://didtheyghost.me?utm_source=github&utm_medium=readmecontributing).

* ✅ You may edit **Company**, **Role**, or **Application** if information is inaccurate
* ✅ When editing, keep the button HTML intact; only update the URL/text
* ❌ Do **not** edit **Track** or **Date Added**
* ✅ You may remove the entire row if the role is closed or outdated; the database will be updated after merge

Example row (database-managed):

| Company                                                                                                                                        | Role                                                                         |                                                                                                     Track                                                                                                     |                                                              Application                                                             |  Date Added |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: | :---------: |
| [TikTok](https://didtheyghost.me/company/ed6a1832-ab26-4b71-824b-2e2b0b66710c?utm_source=github&utm_medium=readme&utm_campaign=sg-intern-tech) | Backend Software Engineer Intern (Privacy and Security) - 2026 Start (BS/MS) | <a href="https://didtheyghost.me/job/96da747b-ab29-40b3-a010-e053bec1cbb6?utm_source=github&utm_medium=readme&utm_campaign=sg-intern-tech"><img alt="Track" src="readme-buttons/track.svg" width="160" /></a> | <a href="https://lifeattiktok.com/search/7582152132208429365"><img alt="Apply" src="readme-buttons/apply.svg" width="160" /></a> | 14 Jan 2026 |

---

## Pull Request Checklist (Self-Review)

> This checklist is for self-review only — you do **not** need to include it in your pull request.

### If you are adding a new role

* [ ] I added the row at the **top of the table**
* [ ] Company is a **markdown link**
* [ ] Track is exactly `-`
* [ ] Application is a **plain URL**
* [ ] Date Added is in `YYYY-MM-DD`
* [ ] The role is tech-focused and in Singapore

### If you are editing an existing role

* [ ] I did **not** edit the **Track** or **Date Added** columns

### If you are removing a role

* [ ] I removed the entire row

---

## Need Help?

If you're unsure about anything:

* Check existing community rows for examples
* Open an issue to ask a question
* Review any validation errors if your pull request fails

Thanks again for contributing!
