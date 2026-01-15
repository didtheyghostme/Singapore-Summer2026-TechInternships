# Contributing

Thank you for helping keep this list accurate and up-to-date!

## Before You Start

**Requirements:**
- ✅ The role must be for a **technology-focused internship** in **Singapore**
- ✅ The role must **not already exist** in the internship list (check for duplicates first)

> [!IMPORTANT]
> For information about adding, editing, or removing rows, see [Understanding Row Types](#understanding-row-types) below.

## Where to Edit

Edit **only** the table between these markers in `README.md`:

- `<!-- JOBS_TABLE_START -->`
- `<!-- JOBS_TABLE_END -->`

> [!IMPORTANT]
> Do not change the header row or column order.

## Where to Add New Entries

Add new entries **at the top of the table**, immediately after the separator row:

`|---|---|:---:|:---:|:---:|`

This ensures the most recent additions appear first.


## Table Structure

The table header must remain exactly:

```
| Company | Role | Track | Application | Date Added |
|---|---|:---:|:---:|:---:|
```

## Understanding Row Types

There are two types of rows in the table:

### 1. Database-Managed Rows (LIMITED EDITING)

Rows where the **Track** column contains a link (like `<a href="https://didtheyghost.me/job/<uuid>">`) are managed by  [didtheyghost.me](https://didtheyghost.me?utm_source=github&utm_medium=readmecontributing). These rows have specific editing rules:

**Allowed to edit if information is inaccurate:**
- ✅ **Company** column
- ✅ **Role** column
- ✅ **Application** column

**NOT allowed to edit:**
- ❌ **Track** column (must remain unchanged - contains `/job/<uuid>` link)
- ❌ **Date Added** column (must remain unchanged)

**Allowed to remove:**
- ✅ You can delete entire rows via pull requests (to signal that a role is closed/outdated). The database will be updated after the PR is merged.

**NOT allowed to add:**
- ❌ Pull requests must **not** add new rows with `/job/<uuid>` links. New roles must be added as **community rows** (Track must be `-`).

### 2. Community Rows (YOU CAN ADD/EDIT/REMOVE)

A row is a **community row** if the **Track** column is exactly `-`.

## Community Row Rules

When adding or editing a community row, follow these rules:

### Required Format

| Column | Format | Example |
|--------|--------|---------|
| **Company** | Markdown link: `[Company Name](https://company.com)` | `[OpenAI](https://openai.com)` |
| **Role** | Free text (job title) | `Software Engineer Intern` |
| **Track** | Must be exactly `-` | `-` |
| **Application** | Plain `http(s)` URL (no HTML/buttons) | `https://example.com/apply` |
| **Date Added** | `YYYY-MM-DD` format (real date) | `2026-01-14` |

### Important Notes

- **Company**: Must be a valid markdown link
- **Application**: Must be a plain URL (no HTML tags, no buttons, no markdown)
- **Date Added**: Use today's date in `YYYY-MM-DD` format (e.g., `2026-01-14`)
- **Track**: Must be exactly `-` (a single dash)

## Example

Here's a complete example template you can copy and paste (replace the placeholders with actual values):

```markdown
| [COMPANY_NAME](COMPANY_URL) | JOB_TITLE | - | JOB_APPLICATION_URL | YYYY-MM-DD |
```

Example with real values:

```markdown
| [OpenAI](https://openai.com) | Software Engineer Intern | - | https://example.com/apply | 2026-01-14 |
```

## Common Mistakes to Avoid

❌ **Don't** add HTML tags to the Application column  
❌ **Don't** use markdown links in the Application column  
❌ **Don't** add rows with Track links (those are database-managed)  
❌ **Don't** change the header row or column order  
❌ **Don't** add duplicate entries (check the list first)  
❌ **Don't** add non-tech roles or roles outside Singapore  
❌ **Don't** edit Track or Date Added columns for database-managed rows  

✅ **Do** use plain URLs in the Application column  
✅ **Do** add entries at the top of the table  
✅ **Do** use the exact date format `YYYY-MM-DD`  
✅ **Do** verify the role is tech-focused and in Singapore  

## Need Help?

If you're unsure about anything, feel free to:
- Check existing community rows for examples
- Open an issue to ask questions
- Review the validation errors if your PR fails

Thanks for contributing!
