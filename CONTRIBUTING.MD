# Contributing

Thank you for helping keep this list accurate and up-to-date! 🎉

## Before You Start

**Requirements:**
- ✅ The internship must be for a **technology-focused role** in **Singapore**
- ✅ The job should **not already exist** in the internship list (check for duplicates first)
- ✅ Only **community rows** can be added via pull requests (see below)

## Where to Edit

Edit **only** the table between these markers in `README.md`:

- `<!-- JOBS_TABLE_START -->`
- `<!-- JOBS_TABLE_END -->`

**Important:** Do not change the header row or column order.

## Where to Add New Entries

Add new entries **at the top** of the table (right after the separator row `|---|---|:---:|:---:|:---:|` shown in the Table Structure section below), so the most recent additions appear first. The list is sorted by date, with newest entries at the top.

## Table Structure

The table header must remain exactly:

```
| Company | Role | Track | Application | Date Added |
|---|---|:---:|:---:|:---:|
```

## Understanding Row Types

There are two types of rows in the table:

### 1. Database-Managed Rows (LIMITED EDITING)

Rows with a **Track** column containing a link (like `<a href="https://didtheyghost.me/job/...">`) are managed by didtheyghost.me. These rows have specific editing rules:

**Allowed to edit:**
- ✅ **Company** column
- ✅ **Role** column
- ✅ **Application** column

**NOT allowed to edit:**
- ❌ **Track** column (must remain unchanged - contains `/job/<uuid>` link)
- ❌ **Date Added** column (must remain unchanged)

**Allowed to remove:**
- ✅ You can delete entire rows via pull requests (to signal that a role is closed/outdated). The admin will update the database after merging.

**NOT allowed to add:**
- ❌ Pull requests must **not** add new rows with `/job/<uuid>` links. New roles must be added as **community rows** (Track must be `-`).

### 2. Community Rows (YOU CAN ADD/EDIT/REMOVE)

A row is a **community row** if the **Track** column is exactly `-`.

## Community Row Rules

When adding or editing a community row, follow these rules:

<a id="company-format"></a>
### Required Format

| Column | Format | Example |
|--------|--------|---------|
| **Company** | Markdown link: `[Company Name](https://company.com)` | `[OpenAI](https://openai.com)` |
| **Role** | Free text (job title) | `Software Engineer Intern` |
| **Track** | Must be exactly `-` | `-` |
| **Application** | Plain `http(s)` URL (no HTML/buttons) | `https://example.com/apply` |
| **Date Added** | `YYYY-MM-DD` format (real date) | `2026-01-14` |

### Important Notes

- **Company**: Must be a [valid markdown link](#company-format)
- **Application**: Must be a plain URL (no HTML tags, no buttons, no markdown)
- **Date Added**: Use today's date in `YYYY-MM-DD` format (e.g., `2026-01-14`)
- **Track**: Must be exactly `-` (a single dash)

## Example

Here's a complete example you can copy and paste:

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

Thanks for contributing! 🙏
