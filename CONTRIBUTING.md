# Contributing

Thank you for helping keep this list accurate and up-to-date!
Contributions are welcome, even if this is your first pull request (PR).

## Before You Start

Please make sure the role you're contributing meets **all** of these requirements:

- ✅ A **technology-focused internship**
- ✅ Located in **Singapore**
- ✅ **Not already listed** (check for duplicates first)

## Adding a New Role

If you're contributing a new internship, follow this section.

### What your row should look like

Copy and paste this row and replace the placeholders:

```markdown
| [COMPANY_NAME](COMPANY_URL) | JOB_TITLE | - | JOB_APPLICATION_URL | YYYY-MM-DD |
```

**Notes:**

* **Company** must be a markdown link
  Example: `[OpenAI](https://openai.com)`
* **Track** must be exactly `-`
* **Application** must be a **plain URL** (no HTML, no buttons, no markdown)
* **Date Added** must be today's date in `YYYY-MM-DD` format

It's expected that newly added rows look plain and do **not** contain buttons.

### Where to add it

Edit **only** the table between these markers in `README.md`:

* `<!-- JOBS_TABLE_START -->`
* `<!-- JOBS_TABLE_END -->`

Add your row **at the top of the table**, immediately after this separator row:

```
|---|---|:---:|:---:|:---:|
```

Do **not** change the header row or column order.

### Example

Here's what a correctly formatted row looks like in your PR:

```markdown
| Company | Role | Track | Application | Date Added |
|---|---|:---:|:---:|:---:|
| [OpenAI](https://openai.com) | Software Engineer Intern | - | https://example.com/apply | 2026-01-14 |
```

**Rendered:**

| Company                      | Role                     | Track |                       Application                      | Date Added |
| ---------------------------- | ------------------------ | :---: | :----------------------------------------------------: | :--------: |
| [OpenAI](https://openai.com) | Software Engineer Intern |   -   | [https://example.com/apply](https://example.com/apply) | 2026-01-14 |

<details>
<summary>What happens after merge?</summary>

After merge, a resync will automatically convert your row to include buttons:

| Company                      | Role                     | Track |                                               Application                                              |  Date Added |
| ---------------------------- | ------------------------ | :---: | :----------------------------------------------------------------------------------------------------: | :---------: |
| [OpenAI](https://openai.com) | Software Engineer Intern |   -   | <a href="https://example.com/apply"><img alt="Apply" src="readme-buttons/apply.svg" width="160" /></a> | 14 Jan 2026 |

</details>

## Understanding Row Types (Advanced)

There are **two types of rows** in the table.

### Community Rows

A row is a **community row** if the **Track** column is exactly `-`.

**Community rows:**

* ✅ Can be added, edited, or removed via PRs
* ✅ Are the only type of row you should add in a PR

Community rows look like this:

| Company | Role | Track | Application | Date Added |
|---|---|:---:|:---:|:---:|
| [OpenAI](https://openai.com) | Software Engineer Intern | - | https://example.com/apply | 2026-01-14 |

### Database-Managed Rows

Rows where the **Track** column contains a **Track button link**
(e.g. a URL with `/job/<uuid>`) are managed by [didtheyghost.me](https://didtheyghost.me?utm_source=github&utm_medium=readmecontributing).

**Rules for database-managed rows:**

* ✅ You may edit **Company**, **Role**, or **Application** if information is inaccurate
* ✅ When editing, keep the button HTML intact; only update the URL/text
* ❌ Do **not** edit **Track** or **Date Added**
* ✅ You may remove the entire row if the role is closed or outdated; the database will be updated after merge

Database-managed rows look like this:

| Company                                                                                                                                     | Role                                  |                                                                                                     Track                                                                                                     |                                                       Application                                                      |  Date Added |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------: | :---------: |
| [Sea](https://didtheyghost.me/company/87deba26-2f77-44c5-a566-142fe2798afb?utm_source=github&utm_medium=readme&utm_campaign=sg-intern-tech) | AI Ignite Internship Programme (AIIP) | <a href="https://didtheyghost.me/job/d5d44b14-651f-4808-9e38-eeb7390b5490?utm_source=github&utm_medium=readme&utm_campaign=sg-intern-tech"><img alt="Track" src="readme-buttons/track.svg" width="160" /></a> | <a href="https://career.sea.com/position/J02089415"><img alt="Apply" src="readme-buttons/apply.svg" width="160" /></a> | 14 Jan 2026 |


## PR Checklist (Self-Review)

> This checklist is for self-review only — you do **not** need to include it in your PR.

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

## Need Help?

If you're unsure about anything:

* Check existing community rows for examples
* Open an issue to ask a question
* Review any validation errors if your PR fails

Thanks again for contributing!
